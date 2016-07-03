import api
import os
import unittest
import requests_mock


class InstagramTestCase(unittest.TestCase):

    def setUp(self):
        self.app = api.app.test_client()

    def tearDown(self):
        pass

    def test_authorize(self):
        response = self.app.get("/authorize")
        assert 302 == response.status_code
        assert b"https://api.instagram.com/oauth/authorize/" in response.data
        assert len(os.environ.get("CLIENT_ID")) > 0
        assert bytes(os.environ.get("CLIENT_ID"), "utf-8") in response.data

    def test_callback(self):
        with requests_mock.mock() as m:
            m.post("https://api.instagram.com/oauth/access_token")
            response = self.app.get("/callback", data={"code": "mycode"})
            assert response.status_code == 200
            assert m.called
