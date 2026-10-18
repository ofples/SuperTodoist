/** Settings and credentials are private to this plugin identity. */
import {privateStorage} from '../offline/privateStorage';
import {log, setDebugServerUrl} from './debug';
import {setFontScale, normalizeFontScale} from './fontScale';
const {DEFAULT_AI_MODEL, DEFAULT_AI_MODELS} = require('./aiModels');

function withDerived(merged) {
  merged.fontScale = normalizeFontScale(merged.fontScale);
  setFontScale(merged.fontScale);
  setDebugServerUrl(merged.debugServerUrl);
  return merged;
}

const DEFAULT_CONFIG = {
  apiToken: '',
  aiApiKey: '',
  aiModel: DEFAULT_AI_MODEL,
  // Explicit opt-in. Older configs inherit false and continue using device OCR.
  aiByDefault: false,
  aiModels: [...DEFAULT_AI_MODELS],
  privacyWarning: '',
  debugServerUrl: '',
  defaultProjectId: null,
  defaultSectionId: null,
  defaultPriority: 1,
  enabledProjectIds: [],
  // 'last' resolves to lastOpenedTab (F-038). Existing installs keep their
  // saved explicit tab; only fresh configs get the remember-where-I-was default.
  defaultTab: 'last',
  // Hidden (no UI row): the TaskHome tab the user was last on, persisted on
  // every tab switch so 'last' survives process restarts.
  lastOpenedTab: 'today',
  postCreateAction: 'prompt',
  debugMode: false,
  markAsTextFontSize: 32,
  // 'off', 'finger', or 'pen-lasso'. Controls the quick-add lasso gesture only;
  // long press and three-finger double tap are always active. Default 'off':
  // hold-then-drag resembles a paused scroll, so it is opt-in (session 34).
  lassoGestureInput: 'off',
  // Strict edge swipe: two or three coherent finger contacts from the bottom
  // edge. Opt-in; unknown physical dimensions or ambiguous streams fail closed.
  bezelSwipeEnabled: false,
  launcherEnabled: false,
  launcherEdge: 'right',
  launcherPosition: 0.45,
  // Three-finger double tap opens task home ANYWHERE on the canvas -- no
  // geometric constraint, so palm activity can mimic it (B-028). Opt-in
  // since session 34; was always-on from session 31 until B-028.
  threeFingerTapEnabled: false,
  // Show completed tasks inline on the Today tab (footer toggle, F-030)
  showDoneTasks: false,
  // Accessibility text scale: 1 / 1.15 / 1.3 (F-031)
  fontScale: 1,
  // B-033: one-shot native view invalidate after TaskHome's first content
  // paint, to clear the note ghost left by the partial refresh on open.
  // Device-confirmed 2026-09-06 (no visible cost), so there is no UI row --
  // this is a hidden kill switch, editable in the private settings JSON.
  refreshOnOpen: true,
};

let _runtimeConfig = null;
let _configSource = 'defaults';
let _loadPromise = null;
let _saveChain = Promise.resolve();

export async function loadConfig() {
  if (_runtimeConfig) return withDerived({...DEFAULT_CONFIG, ..._runtimeConfig});
  if (_loadPromise) return _loadPromise;
  _loadPromise = (async () => {
    const {storage} = await privateStorage();
    const raw = await storage.readSettings();
    if (raw !== null && raw !== undefined) {
      const value = JSON.parse(raw);
      if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error('Private settings are damaged.');
      _runtimeConfig = value;
      _configSource = 'private';
    } else {
      _runtimeConfig = {...DEFAULT_CONFIG};
      _configSource = 'defaults';
    }
    return withDerived({...DEFAULT_CONFIG, ..._runtimeConfig});
  })().finally(() => { _loadPromise = null; });
  return _loadPromise;
}

export function resolveDefaultTab(config) {
  const tab = config?.defaultTab || 'last';
  return tab === 'last' ? config?.lastOpenedTab || 'today' : tab;
}
export function getCachedConfig() {
  return _runtimeConfig ? {...DEFAULT_CONFIG, ..._runtimeConfig} : null;
}
export function wasTemplateGenerated() { return false; }
export function getConfigSource() { return _configSource; }
export async function reloadConfig() {
  await _saveChain;
  _runtimeConfig = null;
  return loadConfig();
}
export function saveConfig(changesOrUpdater) {
  const run = _saveChain.then(async () => {
    try {
      const current = await loadConfig();
      // Updaters execute inside the serialized save queue, against the newest
      // private settings. Returning null is an intentional account-switch no-op.
      const changes = typeof changesOrUpdater === 'function' ? changesOrUpdater({...current}) : changesOrUpdater;
      if (changes == null) return true;
      if (typeof changes !== 'object' || Array.isArray(changes)) return false;
      const merged = {...current, ...changes};
      const {storage} = await privateStorage();
      await storage.saveSettings(JSON.stringify(merged));
      _runtimeConfig = withDerived(merged);
      _configSource = 'private';
      if (Object.prototype.hasOwnProperty.call(changes, 'apiToken')) {
        require('../cache/taskCache').invalidateCache();
      }
      return true;
    } catch (error) {
      log('Config', `Private settings save failed: ${error.message}`);
      return false;
    }
  });
  _saveChain = run.catch(() => {});
  return run;
}
