# Historical release checks: 0.4.0-beta.29

Checked on 18 October 2026 for the first standalone SuperTodoist prerelease.

## Exact package

- Runtime source commit: `8845808921da5e9ca10c1580370c4a1bfe1c224b` (subsequent release-documentation commits do not alter runtime files).
- Plugin display name: `SuperTodoist`.
- Version: `0.4.0-beta.29`, code `34`.
- Asset: `SuperTodoist-v0.4.0-beta.29.snplg`.
- Size: 7,609,923 bytes.
- SHA-256: `9d51f2cee7a0335bdb846f7647696019f1d748f6b4e4825d626f6fcd193b902d`.

## Passed locally

- All 331 offline tests.
- TypeScript check.
- ESLint: no errors; 640 existing style warnings remain.
- PowerShell parser and Bash syntax checks.
- Native Android build with JDK 21.
- Actual archive inspection: matching display name/version/identity, icon, JavaScript bundle, native registrations, expected DEX classes and ARM64 native library. No stale bytecode, local config, token file, or logs in the outer plugin archive.
- Pinned Hermes compiler accepted the packaged JavaScript (bytecode check output: 5,026,583 bytes, SHA-256 `932d97dfd8772c40b54bbd3cd66d362edf3cbe3a2c469621999eaf6ef6044248`). The compiler check output stays outside the package.
- Local Markdown links resolve.

The build reused the existing pinned dependency installation through an ignored local junction. A fresh `npm ci` on a clean checkout was not exercised in this release pass.

## Device verification pending

No device or emulator was available for this release. The earlier beta.28 was installed on a Nomad during development; its results do not verify this renamed beta.29 package. In particular, update-in-place, the renamed listing/toolbar, task capture, offline reconnection/conflicts, recurring completions, board pagination, and multi-selection should be exercised on scratch content before relying on the prerelease.

This beta.29 package retained the SuperTask plugin ID, registration key, native package, note-link scheme, and private storage paths. Those facts apply only to beta.29; v0.5.0 uses an independent SuperTodoist identity and storage location. Do not use this historical section as installation guidance for v0.5.0.

## Dependency audit

`npm audit --omit=dev` reported 42 findings in the inherited dependency graph: 1 low, 9 moderate, 29 high, and 3 critical. The reported chains include React Native's CLI, Metro, and Jest tooling; this is **not a clean dependency audit** or a completed runtime exploitability assessment. Critical findings include the [React Native CLI advisory](https://github.com/advisories/GHSA-399j-vxmf-hjvr) and [shell-quote advisory](https://github.com/advisories/GHSA-w7jw-789q-3m8p).

Compatibility-reviewed dependency remediation remains outstanding. Do not use `npm audit fix --force`: its proposed React Native upgrade would conflict with PluginHost's required 0.79.2 runtime. Build/development servers and the optional log receiver should remain on a trusted development machine/network rather than exposed to the internet.
