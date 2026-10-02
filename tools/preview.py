#!/usr/bin/env python3
"""Local-only, zero-dependency preview with fresh assets and automatic reload."""
import argparse
import hashlib
import io
import json
import os
from pathlib import Path
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from urllib.parse import urlsplit
import uuid

ROOT = Path(__file__).resolve().parents[1]
SESSION = uuid.uuid4().hex
EXTENSIONS = {'.html', '.css', '.js', '.json', '.svg', '.png', '.jpg', '.jpeg',
              '.webp', '.gif', '.avif', '.woff', '.woff2', '.ico'}
IGNORED = {'node_modules', '__pycache__', 'work', 'tests'}


def revision():
    digest = hashlib.sha256(SESSION.encode())
    for directory, folders, files in os.walk(ROOT):
        folders[:] = sorted(f for f in folders if not f.startswith('.') and f not in IGNORED)
        for name in sorted(files):
            path = Path(directory) / name
            if path.suffix.lower() not in EXTENSIONS:
                continue
            try:
                stat = path.stat()
            except FileNotFoundError:
                continue
            digest.update(f'{path.relative_to(ROOT)}:{stat.st_mtime_ns}:{stat.st_size}'.encode())
    return digest.hexdigest()


CLIENT = b'''(() => {
  // Only the top page reloads; its embedded screens refresh with it.
  if (window.top !== window) return;
  const initial = document.currentScript.dataset.revision;
  let pending = null;
  async function check() {
    try {
      const response = await fetch('/__preview/revision', {cache: 'no-store'});
      if (!response.ok) throw new Error('Preview unavailable');
      const {revision} = await response.json();
      if (revision !== initial) {
        // Wait for two matching observations so a multi-file save can settle.
        if (pending === revision) { location.reload(); return; }
        pending = revision;
      } else pending = null;
    } catch (_) { /* Retry after temporary server restarts. */ }
    setTimeout(check, 1000);
  }
  setTimeout(check, 1000);
})();'''


class Handler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(ROOT), **kwargs)

    def end_headers(self):
        self.send_header('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0')
        self.send_header('Pragma', 'no-cache')
        self.send_header('Expires', '0')
        super().end_headers()

    def content(self, data, content_type):
        self.send_response(200)
        self.send_header('Content-Type', content_type)
        self.send_header('Content-Length', str(len(data)))
        self.end_headers()
        return io.BytesIO(data)

    def send_head(self):
        route = urlsplit(self.path).path
        if route == '/__preview/revision':
            return self.content(json.dumps({'revision': revision()}).encode(), 'application/json')
        if route == '/__preview/client.js':
            return self.content(CLIENT, 'text/javascript; charset=utf-8')
        # Never return 304 for locally edited assets.
        if 'If-Modified-Since' in self.headers:
            del self.headers['If-Modified-Since']
        path = Path(self.translate_path(self.path))
        if path.is_dir() and route.endswith('/'):
            path = path / 'index.html'
        if path.is_file() and path.suffix.lower() == '.html':
            try:
                html = path.read_text(encoding='utf-8')
            except (OSError, UnicodeError):
                return super().send_head()
            script = f'<script src="/__preview/client.js" data-revision="{revision()}" defer></script>'
            position = html.lower().rfind('</body>')
            html = html[:position] + script + html[position:] if position >= 0 else html + script
            return self.content(html.encode(), 'text/html; charset=utf-8')
        return super().send_head()

    def log_message(self, format, *args):
        if urlsplit(self.path).path != '/__preview/revision':
            super().log_message(format, *args)


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--port', type=int, default=int(os.environ.get('PORT', 4173)))
    args = parser.parse_args()
    server = ThreadingHTTPServer(('127.0.0.1', args.port), Handler)
    print(f'Preview: http://localhost:{args.port} (no cache, automatic reload)', flush=True)
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        pass
    finally:
        server.server_close()
