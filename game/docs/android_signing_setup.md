# Android Signing Setup — Zentri Phase 1

## Why Signing Matters

Android requires every app to be digitally signed before it can be installed or published.
Think of it like a wax seal on a letter — it proves the APK came from you and hasn't been tampered with.

- **Debug keystore** — auto-generated, used for testing on a device/emulator only. Play Store will reject it.
- **Release keystore** — generated once, kept forever. Used for all Play Store uploads. **If you lose it, you can never update your app on Play Store.**

---

## Step 1 — Generate the Release Keystore

Run this command **once** from the repo root. You only ever do this once.

```bash
keytool -genkey -v \
  -keystore game/certificates/zentri-release.keystore \
  -alias zentri \
  -keyalg RSA \
  -keysize 2048 \
  -validity 10000
```

You will be prompted for:
| Field | What to enter |
|---|---|
| Keystore password | Strong password — save in 1Password/Bitwarden |
| Key password | Can be same as keystore password |
| First and last name | Your name or "Zentri" |
| Organisation unit | "Engineering" |
| Organisation | "Zentri" |
| City | Your city |
| State | Your state |
| Country code | IN (for India) |

---

## Step 2 — Back Up the Keystore (Critical)

```
game/certificates/zentri-release.keystore   ← never commit this file
```

Back it up to **at least two** of:
- Google Drive (personal, not shared)
- iCloud / Dropbox
- Encrypted USB stick
- 1Password secure note (attach the file)

> ⚠️ The `game/certificates/` directory is gitignored. This is intentional.
> Never push the keystore to GitHub — it is a private key.

---

## Step 3 — Store Passwords Safely

Add these to your password manager right now:

```
App: Zentri Android Release Keystore
File: zentri-release.keystore
Alias: zentri
Keystore password: <the one you chose>
Key password: <the one you chose>
Generated: <today's date>
```

---

## Step 4 — Wire into Godot Export

Open Godot → Project → Export → "Android Release" preset:

- `Keystore/Release` → browse to `game/certificates/zentri-release.keystore`
- `Keystore/Release User` → `zentri`
- `Keystore/Release Password` → your password

Or pass via CLI in the build script (see `scripts/build_android.sh`).

---

## Certificates Directory Setup

```bash
mkdir -p game/certificates
echo "*" > game/certificates/.gitignore
echo "!.gitignore" >> game/certificates/.gitignore
```

This creates the folder and ensures nothing inside gets committed.

---

## Key Facts

| Property | Value |
|---|---|
| Package ID | `com.zentri.phase1` |
| Key alias | `zentri` |
| Min Android SDK | 24 (Android 7.0) |
| Target Android SDK | 34 (Android 14) |
| Export format (debug) | APK |
| Export format (release) | AAB (Android App Bundle) |
