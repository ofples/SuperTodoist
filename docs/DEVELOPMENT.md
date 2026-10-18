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
python verify_package.py build/outputs/SuperTask.snplg
```

On macOS or Linux, run:

```bash
./buildPlugin.sh
python3 verify_package.py build/outputs/SuperTask.snplg
```

The build script emits `build/outputs/SuperTask.snplg` because the npm package retains the legacy package name. For a public release, the asset is named `SuperTodoist-v0.4.0-beta.29.snplg`; the filename and display name do not change the plugin's internal key. The verifier inspects the `.snplg` archive, embedded `PluginConfig.json`, JavaScript bundle, icon, native package, registered native classes, and packaged ARM64 library.

The Android configuration enables Hermes. When checking a Hermes build manually, inspect the packaged bundle produced by the release build as well as the outer archive. A successful Gradle exit alone does not prove the expected JavaScript and native files are present.

Do not change `pluginID`, `pluginKey`, the `com.supertask` native package, or the legacy `MyStyle/SuperTask` storage/import paths without a reviewed migration plan. They preserve compatibility with the existing SuperTask installation. A standalone package cannot be installed alongside SuperTask because both use the same plugin identity.

## Verification status

Source-level checks and package inspection are release checks; they do not establish device behavior. The last historical device check was for beta.28 on a Nomad. The beta.29 listing rename and upgrade have not been tested on a device or emulator. Do not present beta.28 results as beta.29 verification.

Official Supernote documentation: [Plugin installation](https://docs.supernote.com/en/first-plugin#install-the-plugin), [plugin permissions](https://docs.supernote.com/en/plugin-base/permission), and [private plugin directory](https://docs.supernote.com/en/plugin-base/permission#default-accessible-scope). The private directory is keyed by `pluginID`, not by the display name.

For the exact beta.29 automated/package results, dependency-audit findings, and pending hardware checklist, see [Release checks](RELEASE-CHECKS.md).
