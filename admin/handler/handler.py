import time
import re
import json
import base64
import os
import secrets
from http.server import BaseHTTPRequestHandler
import urllib.request
import urllib.parse

AUTH_CALLBACK_PATTERN = re.compile(
    "\/auth-callback\?code=(\w+)\&state=(.*)$")
AUTH_PERMISSION_PATTERN = re.compile("\/token$")


class State:
    def __init__(self):
        self.dict = {}

    def current(self):
        return self.dict["value"]

    def equals(self, value):
        return self.dict["value"] == value

    def new(self):
        self.dict["value"] = secrets.token_urlsafe(16)
        return self.dict["value"]


def create(config, storage, state):
    class Handler(BaseHTTPRequestHandler):
        def do_GET(s):
            authPermission = AUTH_PERMISSION_PATTERN.search(s.path)
            if authPermission:
                if storage.token is None:
                    s.send_response(200)
                    s.send_header('Content-type', 'application/json')
                    s.send_header('Access-Control-Allow-Origin', '*')
                    s.end_headers()
                    params = str(urllib.parse.urlencode({
                        'client_id': config["CLIENT_ID"],
                        'scope': config["SCOPE"],
                        'state': state.new()}).encode('ascii'), 'ascii')
                    response = {"redirect": "%s?%s" %
                                (config["REQUEST_CODE"], params)}
                    s.wfile.write(json.dumps(response).encode())
                    return
                else:
                    s.send_response(200)
                    s.send_header('Content-type', 'application/json')
                    s.send_header('Access-Control-Allow-Origin', '*')
                    s.end_headers()
                    s.wfile.write(json.dumps(
                        {"access_token": storage.token}).encode())

            authCallback = AUTH_CALLBACK_PATTERN.search(s.path)
            if authCallback:
                if not state.equals(authCallback.group(2)):
                    s.send_response(400)
                    s.end_headers()
                    return

                params = urllib.parse.urlencode({
                    'client_id': config["CLIENT_ID"],
                    'client_secret': config["CLIENT_SECRET"],
                    'code': authCallback.group(1)})
                opener = urllib.request.build_opener()
                opener.addheaders = [('Accept', 'application/json')]
                try:
                    with opener.open(config["REQUEST_TOKEN"], params.encode('ascii')) as f:
                        response = json.load(f)
                        if "error" in response:
                            s.send_response(200)
                            s.send_header('Content-type', 'text/html')
                            s.end_headers()
                            html = "error=%s" % (response["error"])
                            s.wfile.write(html.encode())
                            pass
                        elif "access_token" in response:
                            storage.token = response["access_token"]
                            s.send_response(302)
                            s.send_header(
                                'Location', config["AUTHORIZATION_GRANTED"])
                            s.end_headers()
                            pass
                except urllib.error.HTTPError as err:
                    print(time.asctime(), err)
                    return

            else:
                s.send_response(404)
                return

    return Handler
