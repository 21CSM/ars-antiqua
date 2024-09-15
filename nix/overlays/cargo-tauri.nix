{ lib
, stdenv
, rustPlatform
, fetchFromGitHub
, openssl
, pkg-config
, glibc
, libsoup
, cairo
, gtk3
, webkitgtk
, darwin
}:

rustPlatform.buildRustPackage rec {
  pname = "tauri";
  version = "2.0.0-beta.25";

  src = fetchFromGitHub {
    owner = "tauri-apps";
    repo = "tauri";
    rev = "tauri-v${version}";
    hash = "sha256-zVC+W34LPeYcdJoOt7jAr6iL/RV3QKF8c+8D0lDavtA=";
  };

  sourceRoot = "${src.name}/tooling/cli";
  cargoHash = "sha256-vRejrAi7h0WvCOYGzd1WA51JMz1w7YuCiw/SDYqKOck=";

  nativeBuildInputs = [ pkg-config ];

  buildInputs = [ openssl ]
    ++ lib.optionals stdenv.isLinux [ glibc libsoup cairo gtk3 webkitgtk ]
    ++ lib.optionals stdenv.isDarwin (with darwin.apple_sdk.frameworks; [
    CoreServices
    Security
    SystemConfiguration
  ]);

  meta.mainProgram = "cargo-tauri";
}
