import {DeviceEventEmitter, NativeModules} from 'react-native';
import {
  loadConfig,
  saveConfig,
  resolveDefaultTab,
  getCachedConfig,
} from '../utils/config';
import {log} from '../utils/debug';

const bridge = NativeModules.SuperTodoistLauncher;
let initialized = false;
let viewOpen = false;
let revision = 0;
let queue = Promise.resolve();
const subscriptions = [];

export const launcherAvailable = !!bridge;
export async function launcherStatus() {
  if (!bridge) {
    return {
      permission: false,
      visible: false,
      scopedPenProtection: false,
      available: false,
    };
  }
  return {...(await bridge.getStatus()), available: true};
}
export async function requestLauncherPermission() {
  if (!bridge) {
    throw new Error('Reinstall the full plugin package to use the launcher.');
  }
  return bridge.requestPermission();
}
// Explicit Settings changes already committed their preference before clearing a
// native quick-Hide marker. Background reloads instead commit disabled first.
export async function confirmLauncherPreference() {
  await bridge?.confirmHide();
}
export function reloadLauncher() {
  const token = ++revision;
  const run = queue.then(async () => {
    let config = await loadConfig();
    if (!bridge || token !== revision) {
      return;
    }
    const status = await bridge.getStatus();
    if (token !== revision) {
      return;
    }
    if (status.hidePending) {
      if (!(await saveConfig({launcherEnabled: false}))) {
        throw new Error(
          'Launcher hidden now; disabling preference is waiting to save locally.',
        );
      }
      await bridge.confirmHide();
      config = await loadConfig();
    }
    if (token !== revision) {
      return;
    }
    await bridge.configure(
      config.launcherEnabled === true,
      config.launcherEdge,
      config.launcherPosition,
    );
    bridge.setViewOpen(viewOpen);
  });
  queue = run.catch(error =>
    log('Launcher', `Configuration failed: ${error.message}`),
  );
  return run;
}
export function launcherViewChanged(open) {
  viewOpen = open;
  bridge?.setViewOpen(open);
}
export function launcherLifecycle(state) {
  if (state === 1) {
    reloadLauncher().catch(() => {});
  }
  if (state === 2) {
    launcherViewChanged(true);
  }
  if (state === 3) {
    launcherViewChanged(false);
  }
  if (state >= 4) {
    revision++;
    bridge?.stop();
  }
}
export function initLauncher() {
  if (initialized || !bridge) {
    return;
  }
  initialized = true;
  subscriptions.push(
    DeviceEventEmitter.addListener('SuperTodoistLauncherTap', async event => {
      // Native opens the view once, waking React; do not open it again here.
      require('../utils/viewState').markViewOpen('edge-launcher');
      if (event?.route === 'settings') {
        global.__superTodoistButtonId = 'config';
        global.__superTodoistDeepLink = null;
        if (global.__superTodoistNavigate) {
          global.__superTodoistButtonId = null;
          global.__superTodoistNavigate('config');
        }
        return;
      }
      const config = getCachedConfig() || (await loadConfig());
      const focusTab = resolveDefaultTab(config);
      global.__superTodoistButtonId = null;
      global.__superTodoistDeepLink = {action: 'this-page', focusTab};
      if (global.__superTodoistNavigate) {
        global.__superTodoistDeepLink = null;
        global.__superTodoistNavigate('task-home', {focusTab});
      }
    }),
  );
  subscriptions.push(
    DeviceEventEmitter.addListener(
      'SuperTodoistLauncherPosition',
      async position => {
        const ok = await saveConfig({
          launcherEdge: position.edge,
          launcherPosition: position.position,
        });
        if (!ok) {
          log(
            'Launcher',
            'Position could not be saved; restoring the last durable position',
          );
          reloadLauncher().catch(() => {});
        }
      },
    ),
  );
  subscriptions.push(
    DeviceEventEmitter.addListener('SuperTodoistLauncherError', event => {
      log('Launcher', event.message || 'Launcher unavailable');
      // A rejected native launch never opened/marked our UI. Leave any newer
      // toolbar-opened view's lifecycle state intact.
    }),
  );
  subscriptions.push(
    DeviceEventEmitter.addListener('SuperTodoistLauncherResume', () =>
      reloadLauncher().catch(() => {}),
    ),
  );
  subscriptions.push(
    DeviceEventEmitter.addListener('SuperTodoistLauncherHide', () =>
      reloadLauncher().catch(() => {}),
    ),
  );
  reloadLauncher().catch(() => {});
}
