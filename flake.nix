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
          "cargo"
          "rustc"
          "rust-src"
          "clippy"
          "rustfmt"
        ];
        buildInputs = with pkgs; [
          rustToolchain
          rust-analyzer
          nixpkgs-fmt
          openssl
          cargo-tauri
          nodejs_20
          pnpm
          sqlite
          diesel-cli
        ] ++ lib.optional (pkgs ? lldb) lldb
        ++ lib.optionals stdenv.isLinux [ pkg-config glib gtk3 webkitgtk libsoup ]
        ++ lib.optionals stdenv.isDarwin [ libiconv darwin.apple_sdk.frameworks.WebKit ];
        checks = import ./nix/checks/check-dev-env.nix { inherit pkgs buildInputs; };
      in
      {
        devShells.default = pkgs.mkShell {
          inherit buildInputs;
          shellHook = ''
            export PATH=${pkgs.lib.makeBinPath buildInputs}:$PATH
          '';
        };
        checks.default = checks;
        formatter = pkgs.nixpkgs-fmt;
      }
    );
}
