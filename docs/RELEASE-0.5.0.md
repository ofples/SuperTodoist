# Release checks: 0.5.0

Checked on 18 October 2026.

## Package

- Runtime source: `ee2ed95005bb3d21882c4e94cb97c87b2a545036`.
- Plugin ID/key: `supertodoist001` / `SuperTodoist`.
- Native namespace: `com.supertodoist`; private storage and native module/event names are independent of SuperTask.
- Version: `0.5.0`, code `35`.
- Asset: `SuperTodoist-v0.5.0.snplg`, 7,611,051 bytes.
- SHA-256: `c9bfbbece726bb9327c218d1473a6a35e4fc07cca175e11be14cf6e64a1b3bfa`.

## Automated and local checks

- 335/335 offline tests pass, including independent settings, new native identity, and read compatibility for old note links/tags.
- TypeScript passes.
- Full ESLint exits successfully with no errors; 634 inherited style warnings remain.
- Native Android build succeeds with the pinned React 19.0.0 / React Native 0.79.2 / sn-plugin-lib 0.1.65 dependencies.
- Exact archive inspection passes: new identity/version, main and capture PNG assets, bundle, native registrations, expected DEX classes and ARM64 library. No old `com/supertask` classes are present.
- Pinned Hermes compilation passes: 5,024,533 byte check output, SHA-256 `a6fe91024d7e5a07bb0b609226487dd6020acb6f1cc877853765e71808e04819`. The compiler output stays outside the package.

Dependencies were reused through the ignored local dependency junction; a fresh clean-checkout npm install was not repeated. Dependency resolutions are unchanged from beta.29. The inherited dependency audit findings and tooling-remediation limits remain documented in the [historical beta.29 checks](RELEASE-CHECKS.md#dependency-audit); this is not a clean dependency-audit claim.

## Device verification

On the Nomad, the old SuperTask beta.28 entry was removed through Plugin Manager with user authorization. The exact v0.5.0 installer was transferred and its device SHA-256 matched the verified local artifact. Plugin Manager showed SuperTodoist 0.5.0 enabled ON.

The new Setup screen opened with empty Todoist/OpenAI inputs, no persistent config, and gpt-6-luna selected. The model list showed gpt-6-luna and gpt-6.1-sol. Focusing the empty Add model field opened the keyboard while keeping the field visible; dismissing it restored the Add model and Save settings controls. No credentials were entered or saved. The user chose to restore settings manually, so no settings transfer/export was performed.

These are installation/startup/settings smoke checks. Authenticated Todoist sync, AI recognition, capture-menu behavior in NOTE/DOC, legacy note navigation and the full task workflow were not re-exercised on this candidate. No tasks or note content were modified during this check.

There is no automatic settings migration from SuperTask. Credentials and preferences must be configured in the independent plugin. Legacy `supertask://` links and `[SuperTask]` note references remain readable; new writes use `supertodoist://` and `[SuperTodoist]`.
