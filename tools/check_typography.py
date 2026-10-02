#!/usr/bin/env python3
"""Catch local type overrides that bypass the documented shared text styles."""
from pathlib import Path
import re
root=Path(__file__).resolve().parents[1]
tokens=(root/'css/tokens.css').read_text()
sizes=set(re.findall(r'(--text-[\w-]+)\s*:',tokens))
weights=set(re.findall(r'(--weight-[\w]+)\s*:',tokens))
errors=[]
leading=set(re.findall(r'(--line-height[\w-]*)\s*:',tokens))
tracking=set(re.findall(r'(--letter-spacing[\w-]*)\s*:',tokens))
if not all([sizes,weights,leading,tracking]):errors.append('Define shared size, weight, leading, and tracking tokens')
allowed={
 'font-size':{'inherit','100%'}|{f'var({v})' for v in sizes},
 'font-weight':{'inherit'}|{f'var({v})' for v in weights},
 'line-height':{'inherit'}|{f'var({v})' for v in leading},
 'letter-spacing':{'inherit'}|{f'var({v})' for v in tracking},
}
for p in [*root.rglob('*.css'),*root.rglob('*.html')]:
 if {'.claude','design','docs'} & set(p.relative_to(root).parts):continue
 source=re.sub(r'/\*.*?\*/','',p.read_text(),flags=re.S)
 for prop,values in allowed.items():
  for value in re.findall(r'(?<![\w-])'+prop+r'\s*:\s*([^;}"\n]+)',source):
   if value.strip() not in values:errors.append(f'{p.relative_to(root)}: undocumented {prop}: {value}')
 for value in re.findall(r'(?<![\w-])font\s*:\s*([^;}"\n]+)',source):
  if value.strip()=='inherit':continue
  if not any(f'/var({v})' in value for v in leading) or not any(f'var({size})' in value for size in sizes):errors.append(f'{p.relative_to(root)}: font shorthand bypasses shared styles: {value}')
if errors:raise SystemExit('\n'.join(errors))
print('PASS: typography uses current shared tokens; no undocumented local values')
