{
  description = "Development environment for Ars Antiqua Online Edition";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = { self, nixpkgs, flake-utils }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        pkgs = import nixpkgs { inherit system; };
        buildInputs = with pkgs; [
          nodejs_22
          pnpm
        ];
      in
      {
        devShells.default = pkgs.mkShell {
          inherit buildInputs;
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