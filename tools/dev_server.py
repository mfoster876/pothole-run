#!/usr/bin/env python3
"""Dev static server with caching disabled.

python3 -m http.server sends Last-Modified with no Cache-Control, so browsers
heuristically cache the ES modules and serve STALE game code after edits (and the
service worker compounds it). This wrapper adds `Cache-Control: no-store` to every
response so a reload always reflects what's on disk. Dev tool only — production
caching is the service worker's job (sw.js).

Usage: python3 tools/dev_server.py [port]   (serves the repo root, default 8124)
"""
import http.server
import os
import sys

PORT = int(sys.argv[1]) if len(sys.argv) > 1 else 8124
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


class NoStoreHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=ROOT, **kwargs)

    def end_headers(self):
        self.send_header('Cache-Control', 'no-store')
        super().end_headers()


if __name__ == '__main__':
    with http.server.ThreadingHTTPServer(('', PORT), NoStoreHandler) as httpd:
        print(f'serving {ROOT} on http://localhost:{PORT} (no-store)')
        httpd.serve_forever()
