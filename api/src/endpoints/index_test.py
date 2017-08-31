"""Index test"""

from tornado.testing import AsyncHTTPTestCase
from tornado.web import create_signed_value
from api import make_app


# pylint: disable=R0201,W0613
class IndexTestCase(AsyncHTTPTestCase):
    """Instagram TestCase"""
    def get_app(self):
        self.app = app = make_app(debug=False)
        return app

    def _get_secure_cookie(self, cookie_name, cookie_value):
        cookie_name, cookie_value = 'auth', '1'
        secure_cookie = create_signed_value(
            self.app.settings["cookie_secret"],
            cookie_name,
            cookie_value)
        return 'auth="' + str(secure_cookie)[2:-1] + '"'

    def test_index_without_cookie(self):
        """Test api/"""
        response = self.fetch("/api/")
        assert response.code == 200
        assert b'Authorize' in response.body

    def test_index_with_cookie(self):
        """Test api/ with a cookie"""
        headers = {'Cookie': self._get_secure_cookie('auth', '1')}
        response = self.fetch("/api/", headers=headers)
        assert response.code == 200
        assert b'Logout' in response.body
