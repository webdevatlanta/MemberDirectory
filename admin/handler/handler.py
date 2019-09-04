import time
import re
import json
from http.server import BaseHTTPRequestHandler
import urllib.request
import urllib.parse

AUTH_CALLBACK_PATTERN = re.compile("\/auth-callback\?code=(\w+)$")
AUTH_PERMISSION_PATTERN = re.compile("\/token$")


def create(config, storage):
    class Handler(BaseHTTPRequestHandler):
        def do_GET(s):
            authPermission = AUTH_PERMISSION_PATTERN.search(s.path)
            if authPermission:
                if storage.token is None:
                    s.send_response(200)
                    s.send_header('Content-type', 'application/json')
                    s.send_header('Access-Control-Allow-Origin', '*')
                    s.end_headers()
                    redirect = config["REQUEST_CODE"] + \
                        "?client_id=%s" % (config["CLIENT_ID"])
                    s.wfile.write(json.dumps(
                        {"redirect": redirect}).encode())
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
                            s.send_response(200)
                            s.send_header('Content-type', 'text/html')
                            s.end_headers()
                            html = "<p>Ok, we've logged in. You may now close this window and reload the admin page.</p>"
                            s.wfile.write(html.encode())
                            pass
                except urllib.error.HTTPError as err:
                    print(time.asctime(), err)
                    return

            else:
                s.send_response(404)
                return

    return Handler
