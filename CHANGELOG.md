# Changelog

## 0.5.0 — independent SuperTodoist identity

SuperTodoist now has its own plugin identity and private storage: `pluginID=supertodoist001`, `pluginKey=SuperTodoist`, and native package `com.supertodoist` (version code **35**). Its token-file import uses `MyStyle/SuperTodoist/supertodoist-token.txt`, and its note links use the `supertodoist://` scheme.

This is a separate installation from SuperTask. It does not automatically migrate SuperTask settings, credentials, or queued operations, and does not add a user-facing migration or export/import flow. Configure the Todoist account and preferences in SuperTodoist; tasks already in that Todoist account load after connection. Sync any queued SuperTask changes before switching when possible.

The release retains the Todoist task workflow, offline queue, batch capture, and optional AI refinement described in the [README](README.md). The exact package was installed and enabled on a Nomad after removing the old plugin; fresh Setup, model choices, and model-field keyboard avoidance were checked. Authenticated task/AI workflows were not re-tested. See [v0.5.0 release checks](docs/RELEASE-0.5.0.md).

## 0.4.0-beta.29 — first standalone public prerelease (historical)

This release published the continuing SuperTask codebase as **SuperTodoist** in a standalone repository. The version code was **34**.

The device identity was `pluginID=supertask001` and `pluginKey=SuperTask`, with native package `com.supertask`. The device listing name was SuperTodoist. The beta.29 renamed listing and upgrade path were not verified on hardware. These details describe beta.29 only; v0.5.0 uses a separate identity and storage location.

The release included the offline task queue and conflict handling, project collections backed by Todoist sections, the two-lane paged board, task selection and batch actions, shorthand parsing for batch capture, and optional OpenAI refinement. The upstream fork's [PR 10](https://github.com/ofples/supernote-plugin-research/pull/10) records the final capture, pagination, keyboard, and header work before this standalone export.

Beta.28 was historically installed and checked on a Nomad during private development. That result did not verify beta.29 or its renamed display name. Beta.29 had no emulator or physical-device verification. See the [beta.29 release checks](docs/RELEASE-CHECKS.md) for the exact historical source and package results.
