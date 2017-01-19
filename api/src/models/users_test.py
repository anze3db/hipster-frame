from unittest import TestCase
from unittest.mock import MagicMock
from models.users import json_to_user
from models.users import insert_user
from models.users import get_user


class TestUsers(TestCase):

    def setUp(self):
        self.db = MagicMock()

    def test_response_to_user(self):
        json = u'{"user": {"username": "bond", "id": "007", "profile_picture": "https://scontent.cdninstagram.com/t51.2885-19/007_509223142569119_1064089302_a.jpg", "bio": "I\'m Bond. James Bond.", "full_name": "Jane\u017e Bondi\u010d", "website": "http://bond.si"}, "access_token": "00706441.c7943a3.2923c6a395ca42b99d6c7065eaaf57b7"}'
        user = json_to_user(json)
        assert user["id"] is None
        assert user["access_token"] == \
            "00706441.c7943a3.2923c6a395ca42b99d6c7065eaaf57b7"

    def test_insert_user(self):
        insert_user(self.db, {})
        assert self.db.execute.called is True

    def test_get_user(self):
        get_user(self.db, "1")
        assert self.db.execute.called is True
