from http.server import HTTPServer, BaseHTTPRequestHandler
import unittest
import urllib
import threading
import queue
import json

from handler import handler
from storage import storage

MIDDLEWARE = "http://localhost:3007"  # between Authority and Client
AUTHORITY = "http://localhost:3008"
CLIENT = "http://localhost:3009"

AUTH_CODE = "AuthCode123"
ACCESS_TOKEN = "AccessToken123"

CONFIG = {
    "REQUEST_CODE": "%s/login/oauth/authorize" % (AUTHORITY),
    "REQUEST_TOKEN": "%s/login/oauth/access_token" % (AUTHORITY),
    "CLIENT_ID": "client-id-123",
    "CLIENT_SECRET": "client-secret-abc",
    "AUTHORIZATION_GRANTED": "%s" % (CLIENT),
    "SCOPE": "public_repo",
}

STORE = storage.new_store()


def MockClient(queue):
    class Handler(BaseHTTPRequestHandler):
        def do_GET(s):
            s.send_response(200)
            s.end_headers()
    return Handler


def MockAuthority(queue):
    class Handler(BaseHTTPRequestHandler):
      def do_GET(s):
          s.send_response(200)
          s.end_headers()

      def do_POST(s):
          if s.path == "/login/oauth/access_token":
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
        middleware = HTTPServer(("localhost", 3007),
                                handler.create(CONFIG, STORE))
        middleware_thread = threading.Thread(target=middleware.serve_forever)
        middleware_thread.setDaemon(True)
        middleware_thread.start()

        authority = HTTPServer(("localhost", 3008), MockAuthority(cls.queue))
        authority_thread = threading.Thread(target=authority.serve_forever)
        authority_thread.setDaemon(True)
        authority_thread.start()

        client = HTTPServer(("localhost", 3009), MockAuthority(cls.queue))
        client_thread = threading.Thread(target=client.serve_forever)
        client_thread.setDaemon(True)
        client_thread.start()

    # GET on http://middleware/token should redirect to Authority's permissions page.

    def test_authorization_request(self):
        with urllib.request.urlopen("%s/token" % (MIDDLEWARE)) as response:
            redirect_expected = "%s?client_id=%s&scope=%s" % (
                CONFIG["REQUEST_CODE"], CONFIG["CLIENT_ID"], CONFIG["SCOPE"])
            js = json.load(response)
            self.assertEqual(js["redirect"], redirect_expected)

        self.assertEqual(STORE.token, None)

        # The Authority should reply with a GET of http://middleware/auth-callback.
        urllib.request.urlopen("%s/auth-callback?code=%s" %
                               (MIDDLEWARE, AUTH_CODE))

        # If the reply is positive, Middleware should POST to Authority's token server.
        # The Authority mock records post parameters into a queue:
        item = self.__class__.queue.get()
        self.assertEqual(item['client_id'][0], CONFIG["CLIENT_ID"])
        self.assertEqual(item['client_secret'][0], CONFIG["CLIENT_SECRET"])
        self.assertEqual(item['code'][0], AUTH_CODE)

        # confirm that the token was cached
        self.assertEqual(STORE.token, ACCESS_TOKEN)

        # Once cached, a second requestion to request-authorization should return the token immediately
        with urllib.request.urlopen("%s/token" % (MIDDLEWARE)) as response:
            js = json.load(response)
            self.assertEqual(js["access_token"], ACCESS_TOKEN)
