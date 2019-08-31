import time
from http.server import HTTPServer
import urllib.request
import urllib.parse

from handler import handler
from config import config
from storage import storage

if __name__ == '__main__':
    HOST = ('localhost', 3001)
    CONFIG = config.load("./secrets/github-oauth.json")
    STORE = storage.new_store()

    httpd = HTTPServer(HOST, handler.create(CONFIG, STORE))
    print(time.asctime(), "Server start - %s:%s" % HOST)

    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        pass

    httpd.server_close()
    print(time.asctime(), "Server stop - %s:%s" % HOST)
