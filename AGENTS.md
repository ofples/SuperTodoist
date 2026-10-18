# Repository guidance

- Keep the project on npm and retain `package-lock.json`.
- Preserve the host pins: React 19.0.0, React Native 0.79.2, and `sn-plugin-lib` 0.1.65.
- Preserve update compatibility: plugin ID `supertask001`, plugin key `SuperTask`, native package `com.supertask`, and legacy storage/import paths under `MyStyle/SuperTask`.
- Never commit tokens, local config, private logs, note images, device exports, or personal device identifiers.
- Keep source tests/package inspection distinct from emulator and physical-device verification. State which exact package was checked.
- Follow [CONTRIBUTING.md](CONTRIBUTING.md) for local checks and contribution scope.
