"""Instagram test"""

import os
import io
from unittest.mock import patch
from unittest.mock import MagicMock
from pytest import raises
from tornado.httputil import url_concat
from tornado.concurrent import Future
from tornado.testing import AsyncHTTPTestCase
from tornado.testing import gen_test
from tornado.web import create_signed_value
from tornado.httpclient import AsyncHTTPClient, HTTPRequest, HTTPResponse
from endpoints.instagram import _check_env_variables
from endpoints.instagram import _get_client
from api import make_app


# pylint: disable=R0201,W0613
class InstagramTestCase(AsyncHTTPTestCase):
    """Instagram TestCase"""
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

    def test_invalid_action(self):
        """Test api/instagram/invalid"""
        response = self.fetch("/api/instagram/invalid")
        assert response.code == 404

    def test_logout(self):
        """Test api/instagram/logout"""
        response = self.fetch("/api/instagram/logout", follow_redirects=False)
        assert response.code == 302
        assert 'auth=""' in response.headers['Set-Cookie']

    @patch('endpoints.instagram.get_media')
    @gen_test
    def test_media(self, get_media):
        """Test api/instagram/media"""
        mock = MagicMock()
        get_media.return_value = setup_future(mock)
        headers = {'Cookie': self._get_secure_cookie('auth', '1')}
        response = yield self.http_client.fetch(
            self.get_url("/api/instagram/media"), headers=headers)
        assert response.code == 200
        assert mock.fetchall.called is True

    def test_authorize(self):
        """Test /api/instagram/authorize"""
        response = self.fetch("/api/instagram/authorize",
                              follow_redirects=False)
        location = response.headers.get("location")
        assert response.code == 302, str(response.code) + " Not a redirect"
        assert "https://api.instagram.com/oauth/authorize/" in location
        assert os.environ.get("CLIENT_ID")
        assert os.environ.get("CLIENT_ID") in location

    @patch('endpoints.instagram.insert_user')
    @patch('endpoints.instagram.REDIRECT_URI', '/api/')
    @patch('endpoints.instagram.fetch_media')
    @patch('endpoints.instagram._get_client')
    @gen_test
    def test_callback(self, get_client, fetch_media, insert_user):
        """Test api/instagram/callback"""
        fetch_mock = get_client().fetch
        db_mock = MagicMock()
        db_mock.fetchone.return_value = (1,)
        # pylint: disable=W1402
        fetch_mock.side_effect = get_fetch_side_effect(
            fetch_mock, 200,
            b'{"access_token": "smth.sadf", "user": {"username": "ensmotko",'
            b'"bio": "I write code and surf waves", "website": '
            b'"http://smotko.si", "profile_picture": "https://a.jpg",'
            b'"full_name": "An\u017ee Pe\u010dar", "id": "31006441"}}')
        insert_user.side_effect = lambda db, data: setup_future(db_mock)
        fetch_media.side_effect = lambda db, user, url, lkd: setup_future(None)
        url = url_concat("/api/instagram/callback", {"code": "mycode"})
        yield self.http_client.fetch(self.get_url(url))

        assert get_client.called
        assert insert_user.called
        assert fetch_media.called
        assert db_mock.fetchone.called
        assert len(fetch_mock.call_args_list) == 1
        args, kwargs = fetch_mock.call_args_list[0]
        assert "code=mycode" in kwargs["body"]

    @patch('endpoints.instagram.environ')
    def test_env_variables(self, environ):
        """Test _check_undefined_env_variables"""
        handler = _check_env_variables
        with raises(Exception) as execinfo:
            handler()
        assert 'Missing environment variable' in str(execinfo.value)

    @patch('endpoints.instagram.environ', {'CLIENT_ID': ''})
    def test_empty_env_variables(self):
        """Test _check_undefined_env_variables with empty values"""
        handler = _check_env_variables
        with raises(Exception) as execinfo:
            handler()
        assert 'Environment variable' in str(execinfo.value)

    def test_get_client(self):
        """Test _get_client"""
        client = _get_client()
        assert isinstance(client, AsyncHTTPClient)


def setup_future(result):
    """Helper function to setup_future"""
    future = Future()
    future.set_result(result)
    return future


def get_fetch_side_effect(fetch_mock, status_code, body=None):
    """Helper function to get fetch side effect"""
    def side_effect(request, **kwargs):
        """Side effect"""
        if request is not HTTPRequest:
            request = HTTPRequest(request)
        buffer = io.BytesIO(body)
        response = HTTPResponse(request, status_code, None, buffer)
        return setup_future(response)
    return side_effect
