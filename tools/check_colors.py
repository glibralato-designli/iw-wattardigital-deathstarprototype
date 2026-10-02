#!/usr/bin/env python3
"""Check the documented opaque sRGB token pairs, not arbitrary screen compositions."""
from pathlib import Path
import re

root = Path(__file__).resolve().parents[1]
# Accept an explicit source for checking a staged copy of this tool.
import sys
source = Path(sys.argv[1]) if len(sys.argv) > 1 else root / 'css/tokens.css'
css = re.sub(r'/\*.*?\*/', '', source.read_text(), flags=re.S)
def block(selector):
    match = re.search(re.escape(selector) + r'\s*\{([^{}]+)\}', css)
    if not match:
        raise SystemExit(f'Missing token block: {selector}')
    return dict(re.findall(r'(--[\w-]+)\s*:\s*([^;]+);', match[1]))
light = block(':root')
dark = block(':root[data-theme="dark"]')
if dark != block(':root:not([data-theme])'):
    raise SystemExit('Explicit and system dark theme tokens differ')

def resolve(tokens, name, trail=()):
    if name in trail:
        raise ValueError(f'Circular token: {name}')
    value = tokens[name].strip()
    alias = re.fullmatch(r'var\((--[\w-]+)\)', value)
    if alias:
        return resolve(tokens, alias[1], trail + (name,))
    if not re.fullmatch(r'#[0-9a-fA-F]{6}', value):
        raise ValueError(f'{name}: expected opaque six-digit hex, got {value}')
    channels = [int(value[i:i+2], 16) / 255 for i in (1, 3, 5)]
    linear = [c / 12.92 if c <= .04045 else ((c + .055) / 1.055) ** 2.4 for c in channels]
    return sum(c * w for c, w in zip(linear, (.2126, .7152, .0722)))

pairs = []
for fg in ['fg', 'fg-secondary', 'fg-muted', 'fg-subtle', 'fg-placeholder']:
    for bg in ['bg', 'bg-subtle', 'bg-muted']:
        pairs.append((fg, bg, 4.5))
pairs.append(('fg-inverse', 'bg-inverse', 4.5))
# Brand families come from the tokens: every --brand-<family>-text role defines one.
families = sorted(set(re.findall(r'--brand-([a-z]+)-text\s*:', css)))
for family in families:
    brand = f'brand-{family}'
    for bg in ['bg', 'bg-subtle', 'bg-muted', brand+'-subtle', brand+'-muted']:
        pairs.append((brand+'-text', bg, 4.5))
    for state in ['', '-hover', '-pressed']:
        pairs.append((brand+'-on', brand+state, 4.5))
    for bg in ['bg', brand+'-subtle', brand+'-muted']:
        pairs.append((brand+'-border', bg, 3))
for status in ['success', 'danger', 'warning', 'info']:
    pairs.append((status, status+'-bg', 4.5))
for bg in ['bg', 'bg-subtle', 'bg-muted']:
    pairs.append(('focus', bg, 3))
    pairs.append(('link', bg, 4.5))
# The navy shell frame: labels, muted group headings, disabled items, and the raised Ask Brain pill.
for fg in ['shell-fg', 'shell-fg-strong', 'shell-fg-icon', 'shell-muted', 'shell-disabled']:
    pairs.append((fg, 'shell', 4.5))
pairs.append(('shell-fg-strong', 'shell-raised', 4.5))
pairs.append(('shell-focus', 'shell', 3))
errors = []
minimum_text = 100
for theme, tokens in [('light', light), ('dark', light | dark)]:
    for fg, bg, target in pairs:
        a, b = resolve(tokens, '--'+fg), resolve(tokens, '--'+bg)
        ratio = (max(a,b)+.05)/(min(a,b)+.05)
        if target == 4.5: minimum_text = min(minimum_text, ratio)
        if ratio < target:
            errors.append(f'{theme}: {fg} on {bg} = {ratio:.2f}:1; needs {target}:1')
if errors:
    raise SystemExit('\n'.join(errors))
print(f'PASS: {len(pairs)*2} light/dark color pairs; minimum readable-text contrast {minimum_text:.2f}:1; dark definitions match')
