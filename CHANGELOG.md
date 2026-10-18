# Changelog

## 0.4.0-beta.29 — first standalone public prerelease

This release publishes the continuing SuperTask codebase as **SuperTodoist** in a standalone repository. The version code is **34**.

The device identity remains `pluginID=supertask001` and `pluginKey=SuperTask` so the package is intended to update the existing SuperTask installation and retain its private storage association. The device listing name is SuperTodoist. The renamed listing and upgrade path have not been verified on hardware for this prerelease.

The release includes the current offline task queue and conflict handling, project collections backed by Todoist sections, the two-lane paged board, task selection and batch actions, shorthand parsing for batch capture, and optional OpenAI refinement. See the [README](README.md) for user-facing details. The upstream fork's [PR 10](https://github.com/ofples/supernote-plugin-research/pull/10) records the final capture, pagination, keyboard, and header work before this standalone export.

Beta.28 was historically installed and checked on a Nomad during private development. That result does not verify beta.29 or its renamed display name. Beta.29 has no emulator or physical-device verification.
