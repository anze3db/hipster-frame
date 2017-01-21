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


def async_wrapper(*args):
  async def _asyncmock():
      a = MagicMock()
      a.decode.return_value = "A"
      return a
  return _asyncmock()


async def _asyncmock():
    return MagicMock()


def test_json_to_media(json_str):
    res = json_to_media(json_str, 1)
    assert len(res) > 0
    first = res.pop(0)
    assert first['user_id'] == 1
    assert first['media_id'] == '1428454788512678858_31006441'


def test_get_media(db):
    get_media(db, 1)
    assert db.execute.called is True


@pytest.mark.asyncio
async def test_insert_media():
    db = MagicMock()
    db.execute.return_value = _asyncmock()
    res = await insert_media(db, {})
    assert db.execute.call_count == 2


@pytest.mark.asyncio
async def test_get_args_str():
    db = MagicMock()
    db.mogrify.side_effect =  async_wrapper
    data = [1, 2, 3]
    values = {}
    await _get_args_str(db, data, values)
    assert db.mogrify.call_count == 3
