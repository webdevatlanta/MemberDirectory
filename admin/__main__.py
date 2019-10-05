import time
import os
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
    STATE = handler.State()

    httpd = HTTPServer(HOST, handler.create(CONFIG, STORE, STATE))
    print(time.asctime(), "OAuth Token Server started on %s:%s" % HOST)

    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        pass

    httpd.server_close()
    print(time.asctime(), "Server stop - %s:%s" % HOST)
