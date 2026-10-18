# Repository guidance

- Keep the project on npm and retain `package-lock.json`.
- Preserve the host pins: React 19.0.0, React Native 0.79.2, and `sn-plugin-lib` 0.1.65.
- Preserve the standalone identity: plugin ID `supertodoist001`, plugin key `SuperTodoist`, native package `com.supertodoist`, and token import path `MyStyle/SuperTodoist/supertodoist-token.txt`.
- Never commit tokens, local config, private logs, note images, device exports, or personal device identifiers.
- Keep source tests/package inspection distinct from emulator and physical-device verification. State which exact package was checked.
- Follow [CONTRIBUTING.md](CONTRIBUTING.md) for local checks and contribution scope.
