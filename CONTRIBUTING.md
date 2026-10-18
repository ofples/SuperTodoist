# Contributing

Open an issue for a bug or proposed change. Keep pull requests focused, describe the user-visible behavior, and include the checks you ran. Credit upstream work when a change is based on it.

Use the committed npm lockfile. Keep React at 19.0.0, React Native at 0.79.2, and `sn-plugin-lib` at 0.1.65 unless a reviewed host-compatibility change justifies a coordinated update. Do not mix package managers.

For changes, run the relevant offline tests, TypeScript check, and lint. For packaging or native changes, build the `.snplg` and run `verify_package.py` against that exact file. Source tests and archive inspection do not prove that a package works on a device; report emulator or physical-device checks separately, with the exact package/version checked.

Never commit API tokens, local config, private logs, note images, device exports, or personal device identifiers. Do not upload or publish an artifact without permission from the repository owner.

Preserve the SuperTask device identity (`pluginID=supertask001`, `pluginKey=SuperTask`), native package `com.supertask`, and legacy `MyStyle/SuperTask` paths unless an explicit migration is designed and reviewed. SuperTodoist cannot coexist with SuperTask under the shared plugin identity.
