# Architecture

SuperTodoist runs its React Native JavaScript inside Supernote's PluginHost and uses `sn-plugin-lib` for plugin lifecycle, note selection, permissions, and host APIs. The Android native package supplies private task storage and note-opening support.

The Todoist API v1 client feeds a committed local snapshot of tasks, projects, and sections. UI actions first write supported changes to a durable local store and outbox. A foreground sync worker sends the queued commands with stable operation IDs, checks acknowledgements, refreshes remote state, and reconciles the queue. An uncertain network result can therefore be retried with the original command identity. If a remote baseline has changed in a way that makes a queued edit unsafe, the task moves to attention for review.

Private settings, credentials, cached tasks, operation queue, and logs live in PluginHost's private directory for `pluginID=supertodoist001`. The store partitions queued data by Todoist account and device identity. Shared storage is used for the explicit token-file import at `MyStyle/SuperTodoist/supertodoist-token.txt` and for checking source-note paths; there is no automatic read of SuperTask's private data. See [permissions and data](../README.md#permissions-and-data) for the user-facing scope.

Batch capture separates transcription and review from saving. OCR text is parsed into proposed fields, and optional AI refinement returns a validated proposal for the same review screen. Saving a selected set of rows is one local transaction. The capture code does not modify the source note.
