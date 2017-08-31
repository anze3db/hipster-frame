"""Index test"""

from endpoints.endpoint_test import EndpointTestCase

# pylint: disable=R0201,W0613
class IndexTestCase(EndpointTestCase):
    """Index TestCase"""

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
