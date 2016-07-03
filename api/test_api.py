import api
import unittest


class ApiTestCase(unittest.TestCase):

    def setUp(self):
        self.app = api.app.test_client()

    def tearDown(self):
        pass

    def test_hello_world(self):
        response = self.app.get("/")
        assert b"Hello World" in response.data
