# SuperTodoist

SuperTodoist brings Todoist tasks to Supernote. Browse and edit tasks on the device, queue supported changes while offline, and turn selected handwriting into tasks with a review step. It continues the open-source [SuperTask plugin by apclark31](https://github.com/apclark31/supernote-plugin-research); [Attribution](ATTRIBUTION.md) credits the upstream source, this fork's development, and retained license notices.

This is the first standalone public prerelease, **0.4.0-beta.29** (plugin version code **34**). Its internal plugin identity stays the same as SuperTask, so this package is intended to update that installation and cannot coexist with it. Sync queued work before updating when possible; do not uninstall SuperTask or clear PluginHost data. The beta.29 renamed listing and update path have not been checked on a device. PluginHost private storage is keyed by the plugin ID.

## Download and install

Download [**`SuperTodoist-v0.4.0-beta.29.snplg`**](https://github.com/ofples/SuperTodoist/releases/download/v0.4.0-beta.29/SuperTodoist-v0.4.0-beta.29.snplg) from the [0.4.0-beta.29 prerelease](https://github.com/ofples/SuperTodoist/releases/tag/v0.4.0-beta.29). Your Supernote firmware must support plugins.

1. Copy the `.snplg` package into the device's `MyStyle` folder using USB or a file-transfer method available to you.
2. On the device, open **Settings → Apps → Plugins → Select Plugin Package** and choose the file.
3. Install it, then make sure SuperTodoist is enabled in the plugin list.
4. Open SuperTodoist from NOTE's plugin toolbar or the plugin entry in Settings.

## Connect Todoist

Create a Todoist API token in Todoist under **Settings → Integrations → Developer** in the [Todoist developer portal](https://developer.todoist.com/). In SuperTodoist, open **Settings → Setup**, paste the token, save it, and use **Test connection**. You can paste with the device clipboard or enter the token with the on-screen keyboard.

There is also a file import option for users who transfer files to the device. Create a plain-text file named `supertask-token.txt` containing only the token and place it directly in `MyStyle/SuperTask/` (create the folder if needed). In **Settings → Setup**, choose **Import token**. The importer reads only that folder and filename. After a successful save, it requests deletion permission if needed; if permission is denied or deletion fails, remove the plaintext file yourself. The file import and folder migration still use the legacy SuperTask path for update compatibility.

The token and new settings are stored in PluginHost's private plugin storage. On upgrade, SuperTodoist can migrate an older shared SuperTask settings file after you allow shared-folder access. It saves the migrated settings privately before attempting to redact the old shared token. If redaction cannot run, follow the warning in Setup and remove or replace the old file yourself. Cloud copies made before migration cannot be recalled by the plugin.

## Use tasks and collections

The main workspace includes **Today**, **Tomorrow**, **Upcoming**, **Inbox**, **All projects**, **This Note**, **On Device**, and **Done** views. Upcoming shows later due dates in the current Monday-to-Sunday week. Choose a project from the sidebar to see its collections in the main pane; **All projects** lets you expand or collapse project groups. Task lists can use list or board layout, grouped by collection, project, date, or not grouped, and sorted by manual order, priority, due date, or title. The board shows two lanes at a time, with controls to page across more lanes. Selection controls support batch task actions. Completed tasks can be shown inline in supported views, and the Done view includes completed history.

SuperTodoist calls Todoist sections **collections** in its interface. A collection is a section inside a project. Choose a project and then one of its collections when adding or moving a task. A task with no section appears under **No collection**. Cached projects and collections remain available offline when already loaded.

Task creation, edits, moves, deletion, completion, reopening, and collection creation can be saved to a private on-device queue. The footer shows the queued count and sync status; tap it to open the sync summary and review queued work or attention items. Sync runs while SuperTodoist is open and connected, not in the background after the plugin closes. Retries keep the same operation identity to avoid duplicating a change after an uncertain response. If a remote edit conflicts with a queued change, SuperTodoist preserves the newer remote fields and flags the local operation for review instead of silently overwriting the remote task.

Recurring-task completion can be queued offline. Todoist determines the next occurrence when the completion syncs; SuperTodoist does not invent a next date locally. Once that completion has been sent, it cannot be undone from the offline queue. Keep SuperTodoist open after reconnecting or use Refresh to sync.

## Settings

Settings lets you choose the starting tab (including **Last opened**), default project and collection, which projects appear in due-date views, and text size. Set task priority in the task form or batch row; batch quick-add also accepts `p1` through `p4`. Capture options include optional finger or pen Quick Add gestures, an optional bottom-edge swipe, and a floating edge button. Choose whether a new-task form asks what to do next or returns to the workspace. Debug mode reveals the local log viewer and diagnostics; a log server URL is optional and log upload requires an explicit action.

## Capture handwriting

Select handwriting with the lasso and choose the SuperTodoist capture action. Device OCR creates editable rows. Review the task titles and descriptions, adjust destinations and other fields, select the rows to save, then save them as one batch. **Cancel** before saving creates no tasks. Capture reads the selected content and leaves the note unchanged.

In batch review, **Batch actions** contains shared defaults, selection, row addition, and OCR grouping controls. Each row can also have its own title, description, project, collection, priority, due date, and labels. The task text parser recognizes supported shorthand such as `#Project`, `#Project /Collection`, `%label` (and legacy `@label`), and `p1` through `p4`. It recognizes a limited set of dates such as today, tomorrow, tonight, and ISO dates. Unsupported recurrence, reminder, assignee, or deadline phrases remain in the text for review; they are not converted to a one-time due date.

A spaced dash such as `Call vet - ask about the new diet` splits into title `Call vet` and description `ask about the new diet`. Quoted dashes, hyphenated words, numeric ranges, and ordinary minus signs are preserved. You can also split or merge OCR rows in the review controls.

## Optional AI refinement

AI is optional. Device OCR and manual review work without an OpenAI key. Add a separate OpenAI API key in **Settings → Setup → AI settings**, select one of the default models (`gpt-4.1-mini`, `gpt-4.1`, or `gpt-4o-mini`), or add a model ID supported by your OpenAI account. **AI by default** is off unless you turn it on.

When you choose **Refine with AI**, SuperTodoist sends the reviewed rows and, when the full selection is included and an image preview is available, the selected handwriting image to OpenAI using your key. Refinement returns suggestions for you to review; it never saves tasks automatically. In AI-by-default capture, OCR and AI can run together. You can cancel AI and continue with device OCR. AI requests require internet access and may incur charges from your provider.

## Permissions and data

SuperTodoist asks for Supernote permissions when a feature needs them:

- **Shared-folder access** reads legacy settings, imports the token file, and checks source-note paths. It is not needed for the private task store.
- **Internet access** connects to Todoist, sends AI refinement to OpenAI when you request it or enable **AI by default**, and can upload a log to a server you configured.
- **File deletion** is used only to delete `supertask-token.txt` after a successful import.

Task data, the sync queue, credentials, and logs are stored in the plugin's private PluginHost directory. Todoist requests send your Todoist token and task data to Todoist. OpenAI receives the selected review data and optional handwriting image when you request refinement or enable AI-by-default with a key configured. No data is sent to the plugin author. Log upload is an explicit action and uses only the endpoint you configure.

Logs are also kept locally for troubleshooting. Ordinary log entries can include task titles, note names or paths, and error details. Review logs before sharing them. The plugin does not upload logs automatically.

Changing the Todoist token while work is queued keeps the queues partitioned by account; the old queue is not sent with the new credential.

## Development

See [Development guide](docs/DEVELOPMENT.md) for prerequisites, build commands, local checks, and package inspection. See [Architecture](docs/ARCHITECTURE.md), [Batch capture shorthand](docs/batch-capture-shorthand.md), and [Attribution](ATTRIBUTION.md) for implementation context and credits.

The project is an independent community release and has not been submitted to the Supernote Plugin Store.
