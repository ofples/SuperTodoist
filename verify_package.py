"""Inspect the actual snplg and nested native archive. Uses Python's stdlib."""
from pathlib import Path
import hashlib
import io
import json
import sys
import zipfile

root = Path(__file__).resolve().parent
artifact = Path(sys.argv[1]) if len(sys.argv) > 1 else root / 'build/outputs/SuperTodoist-v0.5.0.snplg'
source = json.loads((root / 'PluginConfig.json').read_text(encoding='utf-8'))
package = json.loads((root / 'package.json').read_text(encoding='utf-8'))
app = json.loads((root / 'app.json').read_text(encoding='utf-8'))
assert source['name'] == 'SuperTodoist'
assert source['versionName'] == '0.5.0' and source['versionCode'] == '35'
assert package['version'] == source['versionName']
assert app['displayName'] == source['name']
assert package['name'] == 'SuperTodoist'
assert package['dependencies']['react'] == '19.0.0'
assert package['dependencies']['react-native'] == '0.79.2'
assert package['dependencies']['sn-plugin-lib'] == '0.1.65'
with zipfile.ZipFile(artifact) as plugin:
    names = plugin.namelist()
    forbidden = ('.hbc', '.jsbundle', '.log', 'config.local', 'devconfig.json', '.env',
                 'supertask-token.txt', 'supertodoist-token.txt', 'debug.keystore')
    for name in names:
        lowered = name.lower()
        assert not any(marker in lowered for marker in forbidden), f'Unexpected debug or secret file: {name}'
    config = json.loads(plugin.read('PluginConfig.json'))
    for key in ['name', 'pluginID', 'pluginKey', 'versionName', 'versionCode', 'author', 'uses-permissions']:
        assert config[key] == source[key], f'Packaged {key} differs from source'
    assert config['pluginID'] == 'supertodoist001' and config['pluginKey'] == 'SuperTodoist'
    assert app['name'] == config['pluginKey'] and app['displayName'] == config['name']
    assert config['nativeCodePackage'] == '/app.npk'
    assert set(config['reactPackages']) == {
        'com.supertodoist.SuperTodoistNativePackage', 'com.rnfs.RNFSPackage',
        'org.linusu.RNGetRandomValuesPackage',
    }
    assert plugin.read(config['iconPath'].lstrip('/')).startswith(b'\x89PNG')
    capture_icons = [name for name in names if 'capturetodoist' in name.lower() and name.lower().endswith('.png')]
    assert capture_icons, 'Missing packaged Add to Todoist capture icon'
    for name in capture_icons:
        assert plugin.read(name).startswith(b'\x89PNG'), f'Invalid capture icon: {name}'
    bundle = plugin.read('SuperTodoist.bundle')
    assert len(bundle) > 1_000_000
    assert b'config.local' not in bundle
    for marker in [b'Review tasks', b'Batch actions', b'Task destination:', b'Change destination',
                   b'Refine with AI', b'Saved ', b'getLassoElements', b'json_schema']:
        assert marker in bundle, f'Missing JS implementation: {marker}'
    if (root / 'src/overview/model.js').exists():
        for marker in [b'Expand all', b'Collapse all', b'Comfortable']:
            assert marker in bundle, f'Missing overview implementation: {marker}'
    if (root / 'src/collections/model.js').exists():
        for marker in [b'No collection', b'Unavailable collections', b'Choose collection', b'sectionId']:
            assert marker in bundle, f'Missing collections implementation: {marker}'
    if (root / 'src/batch/captureChoice.js').exists():
        for marker in [b'item_close', b'collection_create', b'sourceRowIds', b'explicitFields',
                       b'projectVisibility', b'Sync summary', b'Cancel AI / Use device OCR', b'New collection']:
            assert marker in bundle, f'Missing feedback workflow implementation: {marker}'
    if (root / 'src/workspace/intents.js').exists():
        for marker in [b'Enter task', b'Task actions', b'Confirm delete', b'commitOnSelect', b'onCommitSelection',
                       b'New project', b'Completed', b'project_create', b'collection_create', b'order_key']:
            assert marker in bundle, f'Missing native task interaction implementation: {marker}'
    if (root / 'src/launcher/service.js').exists():
        for marker in [b'SuperTodoistLauncherTap', b'launcherEnabled', b'scopedPenProtection']:
            assert marker in bundle, f'Missing launcher implementation: {marker}'
    with zipfile.ZipFile(io.BytesIO(plugin.read('app.npk'))) as native:
        libs = [name for name in native.namelist() if name.startswith('lib/') and name.endswith('.so')]
        assert libs == ['lib/arm64-v8a/libnative-lib.so'], libs
        dex = b''.join(native.read(name) for name in native.namelist() if name.endswith('.dex'))
        for marker in [b'Lcom/supertodoist/SuperTodoistStorageModule;', b'Lcom/supertodoist/SuperTodoistNoteOpenerModule;',
                       b'Lcom/supertodoist/SuperTodoistNativePackage;',
                       b'Lorg/linusu/RNGetRandomValuesModule;']:
            assert marker in dex, f'Missing native implementation: {marker}'
        assert b'Lcom/supertask/' not in dex, 'Old SuperTask native classes leaked into the new identity package'
        if (root / 'src/launcher/service.js').exists():
            assert b'Lcom/supertodoist/SuperTodoistLauncherModule;' in dex, 'Missing native edge launcher'
print('Verified', config['versionName'], 'identity, icon, JS, native registration, classes and ARM64 library')
print('Bytes:', artifact.stat().st_size)
print('SHA256:', hashlib.sha256(artifact.read_bytes()).hexdigest())
