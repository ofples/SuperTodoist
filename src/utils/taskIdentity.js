const TASK_URI_PREFIX = 'supertodoist://task/';
const LEGACY_TASK_URI_PREFIX = 'supertask://task/';
const NOTE_REFERENCE_PATTERN = /\[(?:SuperTodoist|SuperTask)\] Captured from: (.+\.note) p\.(\d+)/;

function createTaskLink(taskId) {
  return `${TASK_URI_PREFIX}${taskId}`;
}

function taskIdFromLink(destination) {
  if (typeof destination !== 'string') return null;
  const prefix = destination.startsWith(TASK_URI_PREFIX) ? TASK_URI_PREFIX
    : destination.startsWith(LEGACY_TASK_URI_PREFIX) ? LEGACY_TASK_URI_PREFIX : null;
  return prefix ? destination.slice(prefix.length) || null : null;
}

function createNoteReference(path, pageNum) {
  return `\n\n---\n[SuperTodoist] Captured from: ${path} p.${pageNum}`;
}

function parseNoteReference(description) {
  const match = String(description || '').match(NOTE_REFERENCE_PATTERN);
  if (!match) return null;
  const path = match[1];
  return {path, pageNum: Number.parseInt(match[2], 10), fullPath: path.startsWith('/')};
}

function stripNoteReference(description) {
  return String(description || '').split(/\n*---\n\[(?:SuperTodoist|SuperTask)\] Captured from:/)[0].trim();
}

module.exports = {TASK_URI_PREFIX, createTaskLink, taskIdFromLink, createNoteReference, parseNoteReference, stripNoteReference};
