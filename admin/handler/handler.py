import time
import json
import re
from http.server import BaseHTTPRequestHandler
import urllib.request
import urllib.parse

AUTH_CALLBACK_PATTERN = re.compile("\/auth-callback\?code=(\w+)$")
AUTH_REDIRECT_PATTERN = re.compile("\/auth-callback/redirect")

def load_config(filename):
    try:
        with open(filename) as file:
            return json.load(file)
    except:
        print(time.asctime(), "Failed to load config:", filename)
        raise SystemExit("terminating.");

def create(config):
    class Handler(BaseHTTPRequestHandler):
      def do_GET(s):
          authRedirect = AUTH_REDIRECT_PATTERN.search(s.path)
          if authRedirect:
              print("this is the redirect callback", s.path)
              s.send_response(200)
              s.send_header('Content-type','text/html')
              s.end_headers()
              s.wfile.write("Hello".encode())
              return

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
                          s.send_header('Content-type','text/html')
                          s.end_headers()
                          s.wfile.write("Failed to get OAuth authorization".encode())
                          pass
                      elif "access_token" in response:
                          redirect_uri = config["REDIRECT_URI"] + "?" + "access_token=%s" % (response["access_token"])
                          s.send_response(301)
                          s.send_header('Location', redirect_uri)
                          s.end_headers()
                          pass
              except urllib.error.HTTPError as err:
                  print(time.asctime(), err)
              return

          else:
              s.send_response(404)
              return

    return Handler
