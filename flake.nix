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
      in
      {
        devShells.default = pkgs.mkShell {
          inherit buildInputs;
          shellHook = ''
            export PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1
            export PLAYWRIGHT_BROWSERS_PATH="${pkgs.playwright-driver.browsers}"
          '';
        };

        checks.default = pkgs.runCommand "check-env" {
          inherit buildInputs;
        } ''
          echo "Checking Node.js version..."
          if ! node --version | grep -q "v22"; then
            echo "Node.js v22 not found. Installed version: $(node --version)"
            exit 1
          fi

          echo "Checking pnpm availability..."
          pnpm --version || (echo "pnpm not found" && exit 1)

          touch $out
        '';
      }
    );
}