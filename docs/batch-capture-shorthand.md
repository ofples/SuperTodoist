# Batch capture and shorthand

Batch capture turns selected handwriting or manual text into a reviewable set of Todoist tasks. Device OCR transcribes the selection into editable rows. You can correct titles and descriptions, split or merge rows, exclude rows, change task details, and save the selected rows together. Cancel before saving to leave the queue unchanged. Capture does not edit the source note.

The **Batch actions** panel controls selection, shared project/collection, date, priority, labels, row addition, and OCR grouping. A row's own edit takes precedence over a shared default. Review every row before saving.

## Text parsing

The first unquoted spaced dash (` - `, ` – `, or ` — `) can divide a title from a description. For example:

```text
Call vet - ask about the new diet
```

becomes title `Call vet` and description `ask about the new diet`. Hyphenated words, quoted dashes, date and number ranges, and minus signs are kept intact. A leading bullet is removed. OCR grouping offers line and paragraph modes; a manual **Split lines** action creates one row per non-empty line.

Supported quick-add metadata includes:

| Text | Result |
| --- | --- |
| `#Home` or `in Home` | Choose a uniquely named Todoist project |
| `#Home /Garden` | Choose a collection (Todoist section) within a project |
| `/Garden` | Choose a collection in the selected/default project |
| `%urgent` or legacy `@urgent` | Add a label |
| `p1`, `p2`, `p3`, `p4` | Set Todoist priority |
| `today`, `tomorrow`, `tonight`, or `YYYY-MM-DD` | Set a supported due date; `at 9am` or `at 09:30` adds a local time |

Names must resolve uniquely against the loaded projects and collections. Unknown, ambiguous, or contradictory references stay in the task text for review. Location is never guessed from task meaning. When the text includes an unsupported recurrence, reminder, assignee, or deadline phrase, it remains visible in the title rather than being silently converted to another field.

## Optional AI refinement

AI refinement is available from batch review when configured. It sends the selected rows and, when all rows remain selected and an image preview exists, the lasso image to OpenAI. AI proposes editable task fields; it does not save them. You can cancel the AI request and continue with device OCR. See [README](../README.md#optional-ai-refinement) for data and permission details.
