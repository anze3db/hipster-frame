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

    @gen_test
    def test_callback(self):
        with patch.object(InstagramHandler, '_get_client') as get_client:
            mock = get_client().fetch
            setup_fetch(mock, 200, b'{"access_token": "smth.sadf", "user": {"username": "ensmotko", "bio": "I write code and surf waves", "website": "http://smotko.si", "profile_picture": "https://a.jpg", "full_name": "An\u017ee Pe\u010dar", "id": "31006441"}}')
            url = url_concat("/instagram/callback", {"code": "mycode"})
            yield self.http_client.fetch(self.get_url(url))
            assert get_client.called
            assert mock.called
            args, kwargs = mock.call_args
            assert "code=mycode" in kwargs["body"]


def setup_fetch(fetch_mock, status_code, body=None):
    def side_effect(request, **kwargs):
        if request is not HTTPRequest:
            request = HTTPRequest(request)
        buffer = io.BytesIO(body)
        response = HTTPResponse(request, status_code, None, buffer)
        future = Future()
        future.set_result(response)
        return future

    fetch_mock.side_effect = side_effect
