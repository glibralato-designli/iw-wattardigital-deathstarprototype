#!/usr/bin/env python3
"""Keep the executable token file aligned with DESIGN.md; no third-party packages."""
from pathlib import Path
import re, sys
root=Path(__file__).resolve().parents[1]
source=(root/'DESIGN.md').read_text()
match=re.search(r'<!-- tokens:start -->\s*```css\n(.*?)\n```\s*<!-- tokens:end -->',source,re.S)
if not match: raise SystemExit('Missing canonical token block in DESIGN.md')
expected=match.group(1).strip()+'\n'
target=root/'css/tokens.css'
if '--check' in sys.argv:
 if target.read_text()!=expected: raise SystemExit('Token drift: run python3 tools/sync_tokens.py')
 print('PASS: token source and CSS match')
else:
 target.write_text(expected)
 print('Updated css/tokens.css from DESIGN.md')
