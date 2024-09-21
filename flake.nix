{
  description = "Development environment for Ars Antiqua Online Edition";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    flake-utils.url = "github:numtide/flake-utils";
    playwright.url = "github:pietdevries94/playwright-web-flake";
  };

  outputs = { self, nixpkgs, flake-utils, playwright }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        overlay = final: prev: {
          inherit (playwright.packages.${system}) playwright-test playwright-driver;
        };
        pkgs = import nixpkgs {
          inherit system;
          overlays = [ overlay ];
        };
        buildInputs = with pkgs; [
          nodejs_22
          pnpm
          playwright-test
        ];
        commonEnv = {
          PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD = "1";
          PLAYWRIGHT_BROWSERS_PATH = "${pkgs.playwright-driver.browsers}";
        };
      in
      {
        devShells.default = pkgs.mkShell {
          inherit buildInputs;
          shellHook = ''
            export PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=${commonEnv.PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD}
            export PLAYWRIGHT_BROWSERS_PATH=${commonEnv.PLAYWRIGHT_BROWSERS_PATH}
          '';
        };

        checks.default = pkgs.runCommand "check-env" {
          inherit buildInputs;
          inherit (commonEnv) PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD PLAYWRIGHT_BROWSERS_PATH;
        } ''
          echo "Checking Node.js version..."
          if ! node --version | grep -q "v22"; then
            echo "Node.js v22 not found. Installed version: $(node --version)"
            exit 1
          fi

          echo "Checking pnpm availability..."
          pnpm --version || (echo "pnpm not found" && exit 1)
          
          echo "Checking PLAYWRIGHT_BROWSERS_PATH..."
          if [ -z "$PLAYWRIGHT_BROWSERS_PATH" ]; then
            echo "PLAYWRIGHT_BROWSERS_PATH is not set"
            exit 1
          fi
          
          echo "Checking if PLAYWRIGHT_BROWSERS_PATH exists..."
          if [ ! -d "$PLAYWRIGHT_BROWSERS_PATH" ]; then
            echo "PLAYWRIGHT_BROWSERS_PATH directory does not exist"
            exit 1
          fi
          
          echo "Checking for specific browsers..."
          for browser in chromium firefox webkit; do
            if [ ! -d "$PLAYWRIGHT_BROWSERS_PATH/$browser"* ]; then
              echo "$browser not found in PLAYWRIGHT_BROWSERS_PATH"
              exit 1
            fi
          done
          
          touch $out
        '';
      }
    );
}