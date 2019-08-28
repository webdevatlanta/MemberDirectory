import time
from http.server import HTTPServer
import urllib.request
import urllib.parse

from handler import handler

host = ('localhost', 3001)
config = handler.load_config("secrets/github-oauth.json")

if __name__ == '__main__':
    httpd = HTTPServer(host, handler.create(config))
    print(time.asctime(), "Server start - %s:%s" % host)

    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        pass

    httpd.server_close()
    print(time.asctime(), "Server stop - %s:%s" % host)
