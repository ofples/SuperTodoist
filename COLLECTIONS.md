# Collections

SuperTodoist calls Todoist **sections** collections in the interface. A collection belongs to a project and keeps its Todoist section ID. Tasks with no section appear under **No collection**. The plugin uses existing Todoist collections and supports creating a collection from its task workflow.

Project views and overview groups show collections, including empty sections. Task forms and batch rows let you select a project and then one of its collections. Changing projects clears a collection from the previous project. Sections loaded in a previous sync remain in the private cache and can be used offline until refreshed.

Collection creation and supported task changes can be queued on device and synced when the plugin is open and connected. Sync checks the current Todoist destination before sending a queued location change; if the destination is no longer valid, the item is shown for attention rather than reassigned silently.

See the [README](README.md#use-tasks-and-collections) for the complete user guide.
