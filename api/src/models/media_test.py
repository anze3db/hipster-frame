import pytest
from unittest import TestCase
from unittest.mock import MagicMock

from models.media import json_to_media
from models.media import get_media
from models.media import insert_media
from models.media import _get_args_str


@pytest.fixture
def db():
    return MagicMock()


@pytest.fixture
def json_str():
    with open('./fixtures/media.fixture', 'r') as f:
        return f.read()


def test_json_to_media(json_str):
    res = json_to_media(json_str, 1)
    assert len(res) > 0
    first = res.pop(0)
    assert first['user_id'] == 1
    assert first['media_id'] == '1428454788512678858_31006441'


def test_get_media(db):
    get_media(db, 1)
    assert db.execute.called is True


async def _asyncmock():
    return MagicMock()


@pytest.mark.asyncio
async def test_insert_media():
    db = MagicMock()
    db.execute.return_value = _asyncmock()
    res = await insert_media(db, {})
    assert db.execute.call_count == 2
