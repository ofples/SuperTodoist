const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const Module = require('node:module');
const ts = require('typescript');
const identity = require('../src/utils/taskIdentity');

const root = path.resolve(__dirname, '..');
const read = relative => fs.readFileSync(path.join(root, relative), 'utf8');

test('new links and source tags are written while SuperTask references remain readable', () => {
  assert.equal(identity.createTaskLink('123'), 'supertodoist://task/123');
  assert.equal(identity.taskIdFromLink('supertodoist://task/123'), '123');
  assert.equal(identity.taskIdFromLink('supertask://task/456'), '456');
  assert.equal(identity.taskIdFromLink('other://task/1'), null);
  assert.equal(identity.createNoteReference('/notes/today.note', 3),
    '\n\n---\n[SuperTodoist] Captured from: /notes/today.note p.3');
  for (const tag of ['SuperTodoist', 'SuperTask']) {
    const description = `Bring the book\n\n---\n[${tag}] Captured from: /notes/today.note p.3`;
    assert.deepEqual(identity.parseNoteReference(description), {path: '/notes/today.note', pageNum: 3, fullPath: true});
    assert.equal(identity.stripNoteReference(description), 'Bring the book');
  }
});

test('fresh package, app registry, private storage, and native bridges use the independent identity', () => {
  const manifest = JSON.parse(read('PluginConfig.json'));
  const app = JSON.parse(read('app.json'));
  const packageJson = JSON.parse(read('package.json'));
  assert.deepEqual({name: manifest.name, pluginID: manifest.pluginID, pluginKey: manifest.pluginKey,
    versionName: manifest.versionName, versionCode: manifest.versionCode},
  {name: 'SuperTodoist', pluginID: 'supertodoist001', pluginKey: 'SuperTodoist', versionName: '0.5.0', versionCode: '35'});
  assert.equal(app.name, manifest.pluginKey);
  assert.equal(app.displayName, manifest.name);
  assert.equal(packageJson.name, 'SuperTodoist');
  assert.equal(packageJson.version, manifest.versionName);
  assert.ok(manifest['uses-permissions'].includes('plugin.permission.FILE:WRITE'));
  assert.deepEqual(manifest.reactPackages, ['com.supertodoist.SuperTodoistNativePackage']);

  const storageNative = read('android/app/src/main/java/com/supertodoist/SuperTodoistStorageModule.kt');
  const launcherNative = read('android/app/src/main/java/com/supertodoist/SuperTodoistLauncherModule.kt');
  const packageNative = read('android/app/src/main/java/com/supertodoist/SuperTodoistNativePackage.kt');
  assert.match(storageNative, /getName\(\)\s*=\s*"SuperTodoistStorage"/);
  assert.match(storageNative, /plugins\/supertodoist001/);
  assert.doesNotMatch(storageNative, /plugins\/supertask001/);
  assert.match(packageNative, /SuperTodoistNoteOpenerModule\(reactContext\).*SuperTodoistStorageModule\(reactContext\).*SuperTodoistLauncherModule\(reactContext\)/);
  assert.match(read('src/offline/privateStorage.js'), /NativeModules\.SuperTodoistStorage/);
  assert.match(read('src/launcher/service.js'), /NativeModules\.SuperTodoistLauncher/);
  assert.match(read('src/utils/noteOpener.js'), /\{SuperTodoistNoteOpener\}\s*=\s*NativeModules/);
  for (const event of ['Tap', 'Position', 'Error', 'Resume', 'Hide']) {
    const name = `SuperTodoistLauncher${event}`;
    assert.ok(launcherNative.includes(name), `native emitter is missing ${name}`);
    assert.ok(read('src/launcher/service.js').includes(name), `JS listener is missing ${name}`);
  }
  assert.match(read('android/app/src/main/java/com/supertodoist/SuperTodoistStorageModule.kt'), /plugins\/supertodoist001/);
});

test('new identity never imports the old shared settings or registry automatically', async () => {
  const configSource = read('src/utils/config.js');
  const registrySource = read('src/utils/taskRegistry.js');
  assert.doesNotMatch(configSource, /MyStyle\/SuperTask|readLegacy|decodeLegacy/);
  assert.doesNotMatch(registrySource, /MyStyle\/SuperTask|importVerifiedSources/);
  let saves = 0;
  const storage = {readSettings: async () => null, saveSettings: async () => {saves++;}};
  const overrides = {
    '../offline/privateStorage': {privateStorage: async () => ({storage})},
    './debug': {log() {}, setDebugServerUrl() {}},
    './fontScale': {setFontScale() {}, normalizeFontScale: value => value || 1},
  };
  const filename = path.join(root, 'src/utils/config.js');
  const loaded = new Module(filename, module);
  loaded.filename = filename;
  loaded.paths = Module._nodeModulePaths(path.dirname(filename));
  const normalRequire = loaded.require.bind(loaded);
  loaded.require = name => Object.hasOwn(overrides, name) ? overrides[name] : normalRequire(name);
  loaded._compile(ts.transpileModule(configSource, {compilerOptions: {
    module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true,
  }}).outputText, filename);
  const config = await loaded.exports.loadConfig();
  assert.equal(config.aiModel, 'gpt-6-luna');
  assert.equal(loaded.exports.getConfigSource(), 'defaults');
  assert.equal(saves, 0);
});
