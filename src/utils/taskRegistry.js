/** Source references live in the same private generation as tasks and outbox. */
import {offlineSession, offlineData} from '../offline/service';
const {findTask} = require('../offline/model');

function asReference(task) {
  return {...task, notePath: task.source.filePath,
    noteFile: task.source.filePath.split('/').pop(), pageNum: task.source.pageNum,
    createdAt: task.capturedAt ? new Date(task.capturedAt).toISOString() : null};
}
export async function getAllTasks() {
  return (await offlineData()).allTasks.filter(task => task.source?.filePath).map(asReference);
}
export async function getTask(id) { return (await getAllTasks()).find(task => task.id === id || task.remoteId === id) || null; }
export async function getTasksForNote(name) {
  return (await getAllTasks()).filter(task => name.startsWith('/') ? task.notePath === name : task.noteFile === name);
}
export async function getTasksForPage(name, page) { return (await getTasksForNote(name)).filter(task => task.pageNum === page); }
export async function addTask(id, {notePath, pageNum, noteFile, content}) {
  if (!notePath) return;
  const current = await offlineSession();
  await current.store.transaction(state => {
    const task = findTask(state, id);
    if (!task) throw new Error('Task was not saved; source reference was not written.');
    if (!state.tasks[task.id]) state.tasks[task.id] = {...task, remoteId: task.id};
    state.tasks[task.id].source = {filePath: notePath, pageNum: pageNum ?? 0, bounds: null};
    return state;
  });
}
export async function updateTaskNote(id, {notePath}) {
  if (!notePath) return;
  const current = await offlineSession();
  await current.store.transaction(state => {
    const task = findTask(state, id);
    if (task?.source) task.source.filePath = notePath;
    return state;
  });
}
// Completion is already persisted by the API facade; registry reads reflect it.
export async function markCompleted(id, completed = true) {}
// Online deletion removes the authoritative task in the API facade. Never prune
// a private queue merely because an active-only network list lacks its task.
export async function removeTask(id) {}
export async function setLastSync() {}
export function invalidateCache() {}
export async function updateTaskId() { throw new Error('Local source IDs remain stable across synchronization.'); }
