{
  description = "Dev environment for Rust based on Nix flakes";

  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs/nixos-unstable";
    flake-utils.url = "github:numtide/flake-utils";
    fenix = {
      url = "github:nix-community/fenix";
      inputs.nixpkgs.follows = "nixpkgs";
    };
  };

  outputs = { self, nixpkgs, flake-utils, fenix }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        pkgs = nixpkgs.legacyPackages.${system};
        rustToolchain = fenix.packages.${system}.minimal.toolchain;
      in
      {
        devShells.default = pkgs.mkShell {
          buildInputs = [
            rustToolchain
          ];
        };

        checks.default = pkgs.runCommand "check-rust-env" {
          buildInputs = [ rustToolchain ];
        } ''
          if ! command -v rustc > /dev/null || ! command -v cargo > /dev/null; then
            exit 1
          fi
          touch $out
        '';
      }
    );
}