#!/usr/bin/env bash
# ============================================================
# Zentri Phase 1 — Android Build Script
# ============================================================
# Usage:
#   ./scripts/build_android.sh debug     → builds zentri-debug.apk
#   ./scripts/build_android.sh release   → builds zentri-release.aab
#
# Requirements (install before running):
#   1. Godot 4.3 CLI available at $GODOT_PATH or in PATH as `godot4`
#   2. Android SDK at $ANDROID_HOME
#   3. Android NDK at $ANDROID_NDK_ROOT (r23c recommended for Godot 4)
#   4. Java 17+ for the Gradle build step
#   5. Release keystore at game/certificates/zentri-release.keystore
#      (debug builds skip this)
# ============================================================

set -euo pipefail

# ── Config ────────────────────────────────────────────────
GAME_DIR="$(cd "$(dirname "$0")/../game" && pwd)"
BUILD_DIR="$GAME_DIR/build"
PRESET_DEBUG="Android Debug"
PRESET_RELEASE="Android Release"

GODOT_PATH="${GODOT_PATH:-godot4}"          # override with: GODOT_PATH=/path/to/Godot ./build_android.sh
KEYSTORE_PATH="${KEYSTORE_PATH:-$GAME_DIR/certificates/zentri-release.keystore}"
KEYSTORE_ALIAS="${KEYSTORE_ALIAS:-zentri}"

# ── Helpers ───────────────────────────────────────────────
red()   { echo -e "\033[31m$*\033[0m"; }
green() { echo -e "\033[32m$*\033[0m"; }
info()  { echo -e "\033[34m→ $*\033[0m"; }

# ── Parse arg ─────────────────────────────────────────────
MODE="${1:-debug}"
if [[ "$MODE" != "debug" && "$MODE" != "release" ]]; then
  red "Usage: $0 [debug|release]"
  exit 1
fi

# ── Pre-flight checks ─────────────────────────────────────
info "Running pre-flight checks..."

if ! command -v "$GODOT_PATH" &>/dev/null; then
  red "Godot not found at '$GODOT_PATH'."
  red "Install Godot 4.3 and set GODOT_PATH, e.g.:"
  red "  export GODOT_PATH='/Applications/Godot.app/Contents/MacOS/Godot'"
  exit 1
fi

if [[ -z "${ANDROID_HOME:-}" ]]; then
  red "ANDROID_HOME is not set. Install Android SDK and set the variable."
  red "  export ANDROID_HOME=\$HOME/Library/Android/sdk"
  exit 1
fi

if [[ -z "${ANDROID_NDK_ROOT:-}" ]]; then
  red "ANDROID_NDK_ROOT is not set. Install NDK r23c and set the variable."
  red "  export ANDROID_NDK_ROOT=\$ANDROID_HOME/ndk/23.2.8568313"
  exit 1
fi

if [[ "$MODE" == "release" ]]; then
  if [[ ! -f "$KEYSTORE_PATH" ]]; then
    red "Release keystore not found at: $KEYSTORE_PATH"
    red "Generate it first — see game/docs/android_signing_setup.md"
    exit 1
  fi
  if [[ -z "${KEYSTORE_PASSWORD:-}" ]]; then
    red "KEYSTORE_PASSWORD env var is not set."
    red "  export KEYSTORE_PASSWORD='your-keystore-password'"
    exit 1
  fi
fi

green "Pre-flight passed."

# ── Run content validation ─────────────────────────────────
info "Validating game content..."
cd "$(dirname "$0")/.."
node tools/validate_phase1_content.js
green "Content valid."

# ── Create build dir ──────────────────────────────────────
mkdir -p "$BUILD_DIR"

# ── Build ─────────────────────────────────────────────────
if [[ "$MODE" == "debug" ]]; then
  info "Building DEBUG APK..."
  "$GODOT_PATH" \
    --headless \
    --path "$GAME_DIR" \
    --export-debug "$PRESET_DEBUG" \
    "$BUILD_DIR/zentri-debug.apk"

  green "✅ Debug APK built: $BUILD_DIR/zentri-debug.apk"
  info "Install on a connected device:"
  echo "  adb install -r $BUILD_DIR/zentri-debug.apk"

else
  info "Building RELEASE AAB..."
  "$GODOT_PATH" \
    --headless \
    --path "$GAME_DIR" \
    --export-release "$PRESET_RELEASE" \
    --export-pack-only=false \
    "$BUILD_DIR/zentri-release.aab"

  green "✅ Release AAB built: $BUILD_DIR/zentri-release.aab"
  info "Upload this file to Google Play Console → Production → Create new release."
fi
