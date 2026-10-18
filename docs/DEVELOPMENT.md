# Development guide

SuperTodoist is a React Native plugin loaded by Supernote's PluginHost. The host requires the project's pinned React Native and React versions; keep the lockfile and use npm.

## Prerequisites

- Node.js 18 or newer
- Python 3
- JDK 21
- Android SDK Platform 35 and Build Tools 35.0.0
- Android NDK 27.1.12297006
- PowerShell 7 (`pwsh`) on Windows, or Bash on macOS/Linux

Set `ANDROID_HOME` (or `ANDROID_SDK_ROOT`) to the Android SDK directory. Create `android/local.properties` with your local SDK path; the file is ignored by Git. For example:

```properties
# Windows example
sdk.dir=C:/Android/Sdk
```

On macOS or Linux, use a path such as `/path/to/Android/Sdk`. Set `JAVA_HOME` to a JDK 21 installation. The host-compatible dependencies are pinned in `package.json`: React 19.0.0, React Native 0.79.2, and `sn-plugin-lib` 0.1.65.

## Install dependencies and check the source

From the repository root:

```powershell
npm ci
npm run test:offline
npx tsc --noEmit
npm run lint
```

`test:offline` runs the Node test files in `tests/`.

## Build and inspect a plugin package

On Windows, run:

```powershell
.\buildPlugin.ps1
python verify_package.py build/outputs/SuperTodoist.snplg
```

On macOS or Linux, run:

```bash
./buildPlugin.sh
python3 verify_package.py build/outputs/SuperTodoist.snplg
```

The build script emits `build/outputs/SuperTodoist.snplg`. The v0.5.0 public asset is named `SuperTodoist-v0.5.0.snplg`. The verifier inspects the `.snplg` archive, embedded `PluginConfig.json`, JavaScript bundle, icon, native package, registered native classes, and packaged ARM64 library.

The Android configuration enables Hermes. When checking a Hermes build manually, inspect the packaged bundle produced by the release build as well as the outer archive. A successful Gradle exit alone does not prove the expected JavaScript and native files are present.

The standalone identity is `pluginID=supertodoist001`, `pluginKey=SuperTodoist`, native package `com.supertodoist`, and token import path `MyStyle/SuperTodoist/supertodoist-token.txt`. Changes to these identifiers or private-storage conventions require a reviewed migration plan. SuperTask uses a separate identity and storage; SuperTodoist does not automatically migrate its settings or queued operations.

## Verification status

Source-level checks and package inspection are release checks; they do not establish device behavior. Beta.28 was historically checked on a Nomad, and beta.29 had no device or emulator verification. Those results do not verify v0.5.0. The exact v0.5.0 package was installed and enabled on a Nomad; fresh Setup, model choices and the model-field keyboard behavior passed smoke checks. Authenticated sync/capture/AI checks remain separate and were not repeated in this pass.

Official Supernote documentation: [Plugin installation](https://docs.supernote.com/en/first-plugin#install-the-plugin), [plugin permissions](https://docs.supernote.com/en/plugin-base/permission), and [private plugin directory](https://docs.supernote.com/en/plugin-base/permission#default-accessible-scope). The private directory is keyed by `pluginID`, not by the display name.

For current results and remaining device checks, see [v0.5.0 release checks](RELEASE-0.5.0.md). The [beta.29 record](RELEASE-CHECKS.md) retains the historical dependency-audit findings.
