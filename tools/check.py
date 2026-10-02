#!/usr/bin/env python3
"""Architecture checks for a static starter; no installation required."""
from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urlsplit, unquote
import re, subprocess, sys
root=Path(__file__).resolve().parents[1]
errors=[]
# Agent settings (.claude/) and the generated portal export (design/) are not project source.
def files(pattern):return [p for p in root.rglob(pattern) if not {'.claude','design'} & set(p.relative_to(root).parts)]
class Document(HTMLParser):
 def __init__(self): super().__init__();self.ids=[];self.links=[];self.labels=[];self.controls=[]
 def handle_starttag(self,tag,attrs):
  a=dict(attrs)
  if 'id' in a:self.ids.append(a['id'])
  for key in ['href','src']:
   if a.get(key):self.links.append(a[key])
  if tag=='label' and 'for' in a:self.labels.append(a['for'])
for file in files('*.html'):
 source=file.read_text();doc=Document();doc.feed(source)
 if len(doc.ids)!=len(set(doc.ids)):errors.append(f'{file.name}: duplicate IDs')
 for target in doc.labels:
  if target not in doc.ids:errors.append(f'{file.name}: label targets missing {target}')
 for link in doc.links:
  url=urlsplit(link)
  if url.scheme or url.netloc:continue
  if url.path:
   dest=(file.parent/unquote(url.path)).resolve()
   if not dest.is_file():errors.append(f'{file.name}: missing {link}')
  elif url.fragment and url.fragment not in doc.ids:errors.append(f'{file.name}: missing anchor {link}')
 if file.parent.name=='pages' and ('prototype/' in source or 'shell.js' in source or 'shell.css' in source):errors.append(f'{file.name}: review leak')
css='\n'.join(p.read_text() for p in files('*.css'))
all_source=css+'\n'+'\n'.join(p.read_text() for p in files('*.html'))
definitions=set(re.findall(r'(--[\w-]+)\s*:',all_source))|{'--preview-width','--preview-height','--vw','--vh','--scale','--gap','--column-min'}
for name in set(re.findall(r'var\((--[\w-]+)',css))-definitions:errors.append(f'Undefined CSS variable: {name}')
for f in (root/'css').glob('*.css'):
 if f.name!='product.css' and re.search(r'\.(pet-|network-)',f.read_text()):errors.append(f'{f.name}: product pattern in core')
subprocess.run([sys.executable,str(root/'tools/sync_tokens.py'),'--check'],check=True)
subprocess.run([sys.executable,str(root/'tools/check_colors.py')],check=True)
subprocess.run([sys.executable,str(root/'tools/check_typography.py')],check=True)
subprocess.run([sys.executable,str(root/'tools/sync_icons.py'),'--check'],check=True)
# A stale portal export is a warning here; publishing is blocked separately (tools/export_portal.py --hook).
if (root/'design/export-stamp.json').exists():
 fresh=subprocess.run([sys.executable,str(root/'tools/export_portal.py'),'--check'],capture_output=True,text=True)
 if fresh.returncode:print('WARNING: '+fresh.stdout.strip().removeprefix('STALE: '))
if errors:raise SystemExit('\n'.join(errors))
print('PASS: local references, unique IDs, labels, CSS variables, and layer isolation')
