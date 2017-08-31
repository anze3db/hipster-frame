"""Endpoint test"""

from unittest.mock import MagicMock
from tornado.testing import AsyncHTTPTestCase
from tornado.web import create_signed_value
from api import make_app


# pylint: disable=R0201,W0613
class EndpointTestCase(AsyncHTTPTestCase):
    """Endpoint TestCase a base test case used for testing endpoints"""
    def get_app(self):
        self.app = app = make_app(debug=False)
        app.db = MagicMock()
        return app

    def _get_secure_cookie(self, cookie_name, cookie_value):
        cookie_name, cookie_value = 'auth', '1'
        secure_cookie = create_signed_value(
            self.app.settings["cookie_secret"],
            cookie_name,
            cookie_value)
        return 'auth="' + str(secure_cookie)[2:-1] + '"'
