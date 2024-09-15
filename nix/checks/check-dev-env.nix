{ pkgs, buildInputs }:

pkgs.runCommand "check-dev-env"
{
  inherit buildInputs;
} ''
  export PATH=${pkgs.lib.makeBinPath buildInputs}:$PATH
  # Check Rust toolchain
  command -v rustc > /dev/null && command -v cargo > /dev/null || { echo "Rust toolchain not found"; exit 1; }
  rustc --version | grep -q "rustc 1" || { echo "Incorrect Rust version"; exit 1; }
  # Check Tauri CLI
  command -v cargo-tauri > /dev/null || { echo "Tauri CLI not found"; exit 1; }
  cargo_tauri_version=$(cargo-tauri --version)
  [[ $cargo_tauri_version == tauri-cli* && $cargo_tauri_version == *2.0.0* ]] || { echo "Incorrect Tauri CLI version: $cargo_tauri_version"; exit 1; }
  # Check Node.js and pnpm
  command -v node > /dev/null || { echo "Node.js not found"; exit 1; }
  command -v pnpm > /dev/null || { echo "pnpm not found"; exit 1; }
  node --version | grep -q "v20" || { echo "Node.js version should be 20.x"; exit 1; }
  # Check OpenSSL
  command -v openssl > /dev/null || { echo "OpenSSL not found"; exit 1; }
  # Check LLDB
  ${pkgs.lib.optionalString (pkgs ? lldb) ''
    command -v lldb > /dev/null || { echo "LLDB not found"; exit 1; }
    lldb --version | grep -q "lldb version" || { echo "Incorrect LLDB version"; exit 1; }
  ''}
  ${pkgs.lib.optionalString pkgs.stdenv.isLinux ''
    # Linux-specific checks
    pkg-config --exists gtk+-3.0 || { echo "GTK3 not found"; exit 1; }
    pkg-config --exists webkit2gtk-4.0 || { echo "WebKitGTK not found"; exit 1; }
    pkg-config --exists libsoup-2.4 || { echo "libsoup not found"; exit 1; }
  ''}
  ${pkgs.lib.optionalString pkgs.stdenv.isDarwin ''
    # macOS-specific checks
    [ -d /System/Library/Frameworks/WebKit.framework ] || { echo "WebKit framework not found"; exit 1; }
  ''}
  echo "All checks passed"
  touch $out
''
