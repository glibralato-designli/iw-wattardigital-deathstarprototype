#!/usr/bin/env python3
"""Export the prototype for the Designli Design Portal. pages/ stays the source; never edit the output.

The portal serves one self-contained HTML file per screen state, one folder per flow, and renames
the files. This script reads the screens, flows, and states declared in config/project.js and writes:

  design/prototype.json                   devices and product basics (merged)
  design/flows/<flow>/flow.json           steps, states, waivers, entry points, order (merged: the
                                          plugin's own sync fields are kept)
  design/flows/<flow>/NN-Step-State[-Mobile].html
                                          one file per state: local CSS, scripts, and images inlined,
                                          links rewritten to exported names, the state preset baked in
  design/export-stamp.json                a fingerprint of the source it was built from

Usage:
  python3 tools/export_portal.py            export the default mode (config type)
  python3 tools/export_portal.py --mode responsive-web
  python3 tools/export_portal.py --check    exit 1 when the export is missing or older than the source
  python3 tools/export_portal.py --hook     Claude Code PreToolUse hook: blocks a portal publish when stale

Needs Node (to read config/project.js); on macOS, sips shrinks large images when present.
"""
from pathlib import Path
from urllib.parse import urlsplit
import argparse, base64, hashlib, json, mimetypes, re, shutil, subprocess, sys, tempfile

root = Path(__file__).resolve().parents[1]
design = root / 'design'
stamp_path = design / 'export-stamp.json'
VOCAB = ['Default', 'Loading', 'Empty', 'Validation', 'Submitting', 'Error', 'Success', 'Disabled', 'Selected', 'Partial', 'Stale']
KINDS = {'form', 'data', 'choice', 'confirmation', 'result', 'info'}
SOURCES = ['config', 'pages', 'css', 'js', 'assets']
IMAGE_MAX = 800            # long side, px, for inlined raster images
SIZE_WARN = 3_500_000      # the portal marks states above 4 MB unavailable

# ---------- source fingerprint ----------
def source_hash():
    digest = hashlib.sha256()
    for folder in SOURCES:
        for path in sorted((root / folder).rglob('*')):
            if path.is_file() and path.name != '.DS_Store':
                digest.update(str(path.relative_to(root)).encode() + b'\0' + path.read_bytes() + b'\0')
    return 'sha256:' + digest.hexdigest()

def freshness():
    """(ok, message)."""
    if not stamp_path.exists():
        return False, 'The portal export has never been built. Run /discovery-design-export (or python3 tools/export_portal.py) before publishing.'
    stamp = json.loads(stamp_path.read_text())
    if stamp.get('source') != source_hash():
        return False, 'The portal export is older than the prototype source (pages/, css/, js/, assets/, config/). Run /discovery-design-export (or python3 tools/export_portal.py) before publishing.'
    return True, 'The portal export matches the source.'

def hook():
    """PreToolUse: block the plugin's publish (MCP tool or portal.mjs CLI) while the export is stale."""
    try: event = json.load(sys.stdin)
    except Exception: event = {}
    tool, data = event.get('tool_name', ''), event.get('tool_input', {}) or {}
    publishing = tool.endswith('designli-design__publish') or (tool == 'Bash' and re.search(r'portal\.mjs\S*\s+publish', data.get('command', '')))
    if not publishing: return 0
    ok, message = freshness()
    if ok: return 0
    print(message, file=sys.stderr)
    return 2

# ---------- manifest ----------
def load_project():
    node = shutil.which('node')
    if not node: raise SystemExit('Node is required to read config/project.js (https://nodejs.org).')
    js = ("const fs=require('fs'),vm=require('vm');const c={window:{}};"
          f"vm.runInNewContext(fs.readFileSync({json.dumps(str(root / 'config/project.js'))},'utf8'),c);"
          "process.stdout.write(JSON.stringify(c.window.PROJECT))")
    return json.loads(subprocess.run([node, '-e', js], check=True, capture_output=True, text=True).stdout)

def pascal(text):
    words = re.findall(r'[A-Za-z0-9]+', text)
    out = ''.join(w[:1].upper() + w[1:] for w in words) or 'Screen'
    return out if out[0].isalpha() else 'S' + out

def state_name(key):
    return key if key in VOCAB else 'Custom-' + pascal(key.removeprefix('Custom-'))

def plan(project, mode):
    config = project['modes'][mode]
    screens = config.get('screens') or []
    if not screens: raise SystemExit(f'No screens in the {mode} manifest (config/project.js).')
    flows = config.get('flows') or [{'id': 'main', 'title': project.get('name') or 'Prototype'}]
    ids = [f['id'] for f in flows]
    errors = []
    for s in screens:
        s.setdefault('flow', ids[0] if len(ids) == 1 else None)
        if s['flow'] not in ids: errors.append(f"screen {s['id']}: flow {s['flow']!r} is not one of {ids}")
        if s.get('kind', 'info') not in KINDS: errors.append(f"screen {s['id']}: kind {s.get('kind')!r} is not one of {sorted(KINDS)}")
        if not (root / s['path']).is_file(): errors.append(f"screen {s['id']}: missing {s['path']}")
    for f in flows:
        if not any(s['flow'] == f['id'] for s in screens): errors.append(f"flow {f['id']}: no screens declare it")
    if errors: raise SystemExit('Fix the manifest first:\n  ' + '\n  '.join(errors))
    devices = ['mobile'] if mode == 'mobile' else ['desktop', 'mobile']
    out, by_page = [], {}
    for order, flow in enumerate(flows, 1):
        steps = [s for s in screens if s['flow'] == flow['id']]
        for n, s in enumerate(steps, 1):
            step = {'n': f'{n:02d}', 'id': pascal(s['id']), 'screen': s, 'flow': flow['id'], 'states': []}
            for key, preset in [('Default', '')] + list((s.get('states') or {}).items()):
                name = state_name(key)
                files = {d: f"{step['n']}-{step['id']}-{name}{'-Mobile' if d == 'mobile' else ''}.html" for d in devices}
                step['states'].append({'name': name, 'preset': preset, 'files': files})
            by_page[(root / s['path']).resolve()] = step
            out.append(step)
        flow['_order'] = order
    return config, flows, out, by_page, devices

# ---------- inlining ----------
def data_uri(path):
    kind = mimetypes.guess_type(path.name)[0] or 'application/octet-stream'
    data = path.read_bytes()
    if kind in ('image/jpeg', 'image/png') and shutil.which('sips'):
        with tempfile.TemporaryDirectory() as tmp:
            small = Path(tmp) / path.name
            subprocess.run(['sips', '-Z', str(IMAGE_MAX), str(path), '--out', str(small)], capture_output=True)
            if small.exists() and small.stat().st_size < len(data): data = small.read_bytes()
    return f'data:{kind};base64,' + base64.b64encode(data).decode()

def is_local(ref):
    url = urlsplit(ref)
    return ref and not url.scheme and not url.netloc and not ref.startswith(('#', 'data:', '//'))

def inline_css(css, base):
    def url(m):
        ref = m.group(2)
        target = (base / urlsplit(ref).path).resolve()
        return f'url("{data_uri(target)}")' if is_local(ref) and target.is_file() else m.group(0)
    return re.sub(r'url\((["\']?)([^)"\']+)\1\)', url, css)

def safe_script(text, name):
    if re.search(r'</script', text, re.I): raise SystemExit(f'{name} contains "</script"; split that string so it can be inlined.')
    return text

def render(step, state, device, by_page, assets_js, devices):
    page = (root / step['screen']['path']).resolve()
    html = page.read_text()
    base = page.parent
    html = re.sub(r'\s*<link\b[^>]*\brel="icon"[^>]*>', '', html)
    def css(m):
        href = m.group(1)
        target = (base / urlsplit(href).path).resolve()
        if not is_local(href) or not target.is_file(): return m.group(0)
        return f'<style>\n{inline_css(target.read_text(), target.parent)}\n</style>'
    html = re.sub(r'<link\b[^>]*\brel="stylesheet"[^>]*\bhref="([^"]+)"[^>]*>', css, html)
    deferred = []
    def script(m):
        src = m.group(1)
        target = (base / urlsplit(src).path).resolve()
        if not is_local(src) or not target.is_file(): return m.group(0)
        body = f'<script>{safe_script(target.read_text(), target.name)}</script>'
        if 'defer' in m.group(0) or 'type="module"' in m.group(0): deferred.append(body); return ''
        return body
    html = re.sub(r'<script\b[^>]*\bsrc="([^"]+)"[^>]*>\s*</script>', script, html)
    def img(m):
        ref = m.group(2)
        target = (base / urlsplit(ref).path).resolve()
        return f'{m.group(1)}"{data_uri(target)}"' if is_local(ref) and target.is_file() else m.group(0)
    html = re.sub(r'(<(?:img|source)\b[^>]*\bsrc=)"([^"]+)"', img, html)
    html = re.sub(r'(style="[^"]*)', lambda m: inline_css(m.group(1), base), html)
    def link(m):
        attr, ref = m.group(1), m.group(2)
        if not is_local(ref): return m.group(0)
        parts = urlsplit(ref)
        target = by_page.get((base / parts.path).resolve())
        if not target: return m.group(0)
        name = target['states'][0]['files'][device]
        path = name if target['flow'] == step['flow'] else f"../{target['flow']}/{name}"
        return f'{attr}="{path}{"?" + parts.query if parts.query else ""}{"#" + parts.fragment if parts.fragment else ""}"'
    html = re.sub(r'\b(href|data-goto)="([^"]+)"', link, html)
    params = dict(p.split('=', 1) if '=' in p else (p, '1') for p in state['preset'].split('&') if p)
    head = ('\n    <meta name="designli-device" content="mobile">' if device == 'mobile' else '') + \
           f'\n    <script>window.PREVIEW_EXPORT=true;window.PREVIEW_PARAMS={json.dumps(params)};{assets_js}</script>'
    html = re.sub(r'(<head[^>]*>)', lambda m: m.group(1) + head, html, count=1)
    html = html.replace('</body>', ''.join(d + '\n' for d in deferred) + '</body>', 1)
    return html

def asset_map(steps):
    """Assets a script may ask for through Nav.asset(): every file under assets/ whose name appears in a
    screen or a product script. Icons are already inline; brand SVGs, photos, and covers are embedded."""
    texts = [(root / s['screen']['path']).read_text() for s in steps] + [p.read_text() for p in (root / 'js').glob('*.js') if p.name != 'phosphor.js']
    blob = '\n'.join(texts)
    found = {}
    for path in (root / 'assets').rglob('*'):
        if path.is_file() and 'phosphor' not in path.parts and path.suffix.lower() in {'.jpg', '.jpeg', '.png', '.webp', '.svg', '.gif'} and path.name in blob:
            found[str(path.relative_to(root))] = data_uri(path)
    return found

# ---------- flow.json / prototype.json ----------
def merge_json(path, owned):
    current = json.loads(path.read_text()) if path.exists() else {}
    current.update(owned)
    path.write_text(json.dumps(current, indent=2) + '\n')

def write_flows(project, config, flows, steps, devices):
    for flow in flows:
        folder = design / 'flows' / flow['id']
        mine = [s for s in steps if s['flow'] == flow['id']]
        entries = flow.get('entry') or mine[0]['screen']['id']
        entries = entries if isinstance(entries, list) else [entries]
        entry_points = []
        for e in entries:
            screen_id, label = (e['screen'], e.get('from', 'Start')) if isinstance(e, dict) else (e, 'Start')
            match = next((s for s in mine if s['screen']['id'] == screen_id), None)
            if not match: raise SystemExit(f"flow {flow['id']}: entry {screen_id!r} is not a screen of this flow")
            entry_points.append({'from': label, 'to': f"{match['n']}-{match['id']}"})
        flow_steps = []
        for s in mine:
            screen = s['screen']
            states = {st['name']: dict(st['files']) for st in s['states']}
            for key, reason in (screen.get('waivers') or {}).items():
                states.setdefault(state_name(key), f'n/a: {reason}')
            step = {'n': s['n'], 'id': s['id'], 'kind': screen.get('kind', 'info'), 'title': screen['name'], 'states': states}
            if screen.get('description'): step['purpose'] = screen['description']
            if screen.get('primaryAction'): step['primaryAction'] = screen['primaryAction']
            flow_steps.append(step)
        merge_json(folder / 'flow.json', {
            'schema': 2, 'slug': flow['id'], 'title': flow.get('title') or flow['id'], 'goal': flow.get('goal', ''),
            'order': flow.get('order', flow['_order']), 'next': flow.get('next', []), 'entryPoints': entry_points,
            'devices': devices, 'steps': flow_steps,
        })
    if config.get('primaryViewport'):
        device_sizes = {'mobile': {'w': config['primaryViewport']['width'], 'h': config['primaryViewport']['height']}}
    else:
        v = config.get('viewports', {})
        device_sizes = {d: {'w': v[d]['width'], 'h': v[d]['height']} for d in ('desktop', 'mobile') if d in v}
    merge_json(design / 'prototype.json', {
        'schema': 1, 'source': 'static', 'dir': 'design', 'components': 'design/components', 'devices': device_sizes,
        'product': {'name': project.get('name') or 'Prototype', 'summary': project.get('description', '')},
    })

# ---------- main ----------
def export(mode):
    project = load_project()
    mode = mode or project.get('type', 'mobile')
    config, flows, steps, by_page, devices = plan(project, mode)
    assets = asset_map(steps)
    assets_js = f'window.PREVIEW_ASSETS={json.dumps(assets, separators=(",", ":"))};' if assets else ''
    written, sizes = 0, []
    for flow in flows:
        folder = design / 'flows' / flow['id']
        folder.mkdir(parents=True, exist_ok=True)
        for old in folder.glob('[0-9][0-9]-*.html'): old.unlink()
    for step in steps:
        for state in step['states']:
            for device, name in state['files'].items():
                path = design / 'flows' / step['flow'] / name
                path.write_text(render(step, state, device, by_page, assets_js, devices))
                sizes.append((path.stat().st_size, str(path.relative_to(root))))
                written += 1
    write_flows(project, config, flows, steps, devices)
    known = {f['id'] for f in flows}
    orphans = [p.name for p in (design / 'flows').iterdir() if p.is_dir() and p.name not in known]
    stamp_path.write_text(json.dumps({'source': source_hash(), 'mode': mode, 'files': written}, indent=2) + '\n')
    print(f"Exported {written} files: {len(flows)} flow(s), {len(steps)} step(s), devices {', '.join(devices)}.")
    for flow in flows:
        mine = [s for s in steps if s['flow'] == flow['id']]
        print(f"  {flow['id']}: " + ', '.join(f"{s['n']} {s['id']} ({len(s['states'])})" for s in mine))
    largest = max(sizes)
    print(f'  largest file {largest[1]} ({largest[0] // 1024} KB)')
    for size, name in sizes:
        if size > SIZE_WARN: print(f'  WARNING {name} is {size // 1024} KB; the portal marks states above 4 MB unavailable. Shrink its images.')
    if orphans: print(f"  Note: design/flows/{', '.join(orphans)} no longer match a flow in the manifest. Archive them on the portal before deleting.")

if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__.split('\n')[0])
    parser.add_argument('--mode', choices=['mobile', 'responsive-web'])
    parser.add_argument('--check', action='store_true')
    parser.add_argument('--hook', action='store_true')
    args = parser.parse_args()
    if args.hook: sys.exit(hook())
    if args.check:
        ok, message = freshness(); print(('PASS: ' if ok else 'STALE: ') + message); sys.exit(0 if ok else 1)
    export(args.mode)
