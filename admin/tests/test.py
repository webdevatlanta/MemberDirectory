from http.server import HTTPServer, BaseHTTPRequestHandler
import unittest
import urllib
import threading
import queue
import json

from handler import handler

MIDDLEWARE = "http://localhost:3007"  # The local "managing" server
REMOTE = "http://localhost:3008"  # Mocks the remote oauth server
DEST = "http://localhost:3009"  # Hosts the web app that needs an access code
AUTH_CODE = "AuthCode123"
BAD_CODE = "BadAuthCode123"
ACCESS_TOKEN = "AccessToken123"

CONFIG = {
    "REQUEST_CODE": "%s/login/oauth/authorize" % (REMOTE),
    "REQUEST_TOKEN": "%s/login/oauth/access_token" % (REMOTE),
    "CLIENT_ID": "client-id-123",
    "CLIENT_SECRET": "client-secret-abc",
    "REDIRECT_URI": "%s/redirect" % (DEST),
}


def MockDestination(queue):
    class Handler(BaseHTTPRequestHandler):
        def do_GET(s):
            s.send_response(200)
            s.end_headers()
    return Handler


def MockRemote(queue):
    class Handler(BaseHTTPRequestHandler):
      def do_GET(s):
          s.send_response(200)
          s.end_headers()

      def do_POST(s):
          s.send_response(200)
          s.send_header('Content-type', 'application/json')
          s.end_headers()
          qs = s.rfile.read(int(s.headers.get('Content-Length'))).decode()
          params = urllib.parse.parse_qs(qs)
          queue.put(params)
          response = json.dumps({"access_token": ACCESS_TOKEN})
          s.wfile.write(response.encode())
    return Handler


class Test(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.queue = queue.Queue()
        httpd = HTTPServer(("localhost", 3007), handler.create(CONFIG))
        httpd_thread = threading.Thread(target=httpd.serve_forever)
        httpd_thread.setDaemon(True)
        httpd_thread.start()

        mock = HTTPServer(("localhost", 3008), MockRemote(cls.queue))
        mock_thread = threading.Thread(target=mock.serve_forever)
        mock_thread.setDaemon(True)
        mock_thread.start()

        dest = HTTPServer(("localhost", 3009), MockDestination(cls.queue))
        dest_thread = threading.Thread(target=dest.serve_forever)
        dest_thread.setDaemon(True)
        dest_thread.start()

    def test_oauth_callback(self):
      with urllib.request.urlopen("%s/auth-callback?code=%s" % (MIDDLEWARE, AUTH_CODE)) as response:
          # Expect to be redirected to a preconfigured url, with access_token as a query param.
          self.assertEqual(response.geturl(), "%s?access_token=%s" %
                           (CONFIG["REDIRECT_URI"], ACCESS_TOKEN))

      item = self.__class__.queue.get()
      self.assertEqual(item['client_id'][0], CONFIG["CLIENT_ID"])
      self.assertEqual(item['client_secret'][0], CONFIG["CLIENT_SECRET"])
      self.assertEqual(item['code'][0], AUTH_CODE)
