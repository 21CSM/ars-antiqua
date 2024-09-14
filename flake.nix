{
  description = "Dev environment for Rust and Tauri 2.0 based on Nix flakes";
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
        overlays = [ fenix.overlays.default (import ./nix/overlays) ];
        pkgs = import nixpkgs { inherit system overlays; };
        rustToolchain = pkgs.fenix.stable.withComponents [
          "cargo" "rustc" "rust-src" "clippy" "rustfmt"
        ];
        buildInputs = with pkgs; [
          rustToolchain openssl cargo-tauri
        ] ++ lib.optionals stdenv.isLinux [ pkg-config glib gtk3 webkitgtk libsoup ]
          ++ lib.optionals stdenv.isDarwin [ darwin.apple_sdk.frameworks.WebKit ];
      in {
        devShells.default = pkgs.mkShell {
          inherit buildInputs;
          shellHook = ''
            export PATH=${pkgs.lib.makeBinPath buildInputs}:$PATH
          '';
        };
        checks.default = pkgs.runCommand "check-rust-tauri-env" {
          inherit buildInputs;
        } ''
          export PATH=${pkgs.lib.makeBinPath buildInputs}:$PATH
          command -v rustc > /dev/null && command -v cargo > /dev/null || { echo "Rust toolchain not found"; exit 1; }
          command -v cargo-tauri > /dev/null || { echo "Tauri CLI not found"; exit 1; }
          cargo_tauri_version=$(cargo-tauri --version)
          [[ $cargo_tauri_version == tauri-cli* && $cargo_tauri_version == *2.0.0* ]] || { echo "Incorrect Tauri CLI version: $cargo_tauri_version"; exit 1; }
          ${pkgs.lib.optionalString pkgs.stdenv.isLinux ''
            pkg-config --exists gtk+-3.0 || { echo "GTK3 not found"; exit 1; }
            pkg-config --exists webkit2gtk-4.0 || { echo "WebKitGTK not found"; exit 1; }
          ''}
          echo "All checks passed"
          touch $out
        '';
      }
    );
}