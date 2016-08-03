import os
import io
from unittest.mock import patch
from unittest.mock import MagicMock
from tornado.httputil import url_concat
from tornado.concurrent import Future
from tornado.testing import AsyncHTTPTestCase
from tornado.testing import gen_test
from tornado.httpclient import HTTPRequest, HTTPResponse
from instagram import InstagramHandler
from api import make_app


class InstagramTestCase(AsyncHTTPTestCase):

    def get_app(self):
        app = make_app(debug=False)
        app.db = MagicMock()
        return app

    def test_authorize(self):
        response = self.fetch("/instagram/authorize", follow_redirects=False)
        location = response.headers.get("location")
        assert response.code == 302, str(response.code) + " Not a redirect"
        assert "https://api.instagram.com/oauth/authorize/" in location
        assert len(os.environ.get("CLIENT_ID")) > 0
        assert os.environ.get("CLIENT_ID") in location

    @patch('instagram.insert_user')
    @patch.object(InstagramHandler, '_get_client')
    @gen_test
    def test_callback(self, get_client, insert_user):
        fetch_mock = get_client().fetch
        db_mock = MagicMock()
        db_mock.fetchone.return_value = (1,)
        fetch_mock.side_effect = get_fetch_side_effect(
            fetch_mock, 200,
            b'{"access_token": "smth.sadf", "user": {"username": "ensmotko",'
            b'"bio": "I write code and surf waves", "website": '
            b'"http://smotko.si", "profile_picture": "https://a.jpg",'
            b'"full_name": "An\u017ee Pe\u010dar", "id": "31006441"}}')
        insert_user.side_effect = lambda db, data: setup_future(db_mock)
        url = url_concat("/instagram/callback", {"code": "mycode"})
        yield self.http_client.fetch(self.get_url(url))

        assert get_client.called
        assert insert_user.called
        assert db_mock.fetchone.called
        assert len(fetch_mock.call_args_list) == 2, \
            'get acess_token and media'
        args, kwargs = fetch_mock.call_args_list[0]
        assert "code=mycode" in kwargs["body"]


def setup_future(result):
    future = Future()
    future.set_result(result)
    return future


def get_fetch_side_effect(fetch_mock, status_code, body=None):
    def side_effect(request, **kwargs):
        if request is not HTTPRequest:
            request = HTTPRequest(request)
        buffer = io.BytesIO(body)
        response = HTTPResponse(request, status_code, None, buffer)
        return setup_future(response)
    return side_effect
