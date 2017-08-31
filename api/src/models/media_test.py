"""Media module tests"""

from unittest.mock import MagicMock
import pytest
from tornado.platform.asyncio import to_asyncio_future
import models
from models.media import json_to_media
from models.media import get_media
from models.media import insert_media
from models.media import _get_args_str
from models.media import fetch_media


@pytest.fixture
def db():
    """Pytest db fixture"""
    return MagicMock()


@pytest.fixture
def json_str():
    """Pytest json_str fixture"""
    with open('./fixtures/media.fixture', 'r') as f:
        return f.read()


def setup_async(mock):
    """Helper function for setting up async mocks"""
    async def _asyncmock(*args, **kwargs):
        return mock
    return _asyncmock


def test_json_to_media(json_str):  # pylint: disable=W0621
    """Test json_to_media"""
    res = json_to_media(json_str, 1, 'INSTAGRAM_LIKED')
    assert res
    first = res.pop(0)
    assert first['user_id'] == 1
    assert first['media_id'] == '1428454788512678858_31006441'


def test_get_media(db):  # pylint: disable=W0621
    """Test get_media"""
    get_media(db, 1)
    assert db.execute.called is True


@pytest.mark.asyncio
async def test_insert_media():
    """Test insert_media"""
    db = MagicMock()  # pylint: disable=W0621
    db.execute.side_effect = setup_async(MagicMock())
    db.mogrify.side_effect = setup_async(b"mogrified")
    await insert_media(db, {'something': 'other'})
    assert db.execute.call_count == 2


@pytest.mark.asyncio
async def test_empty_insert_media():
    """Test insert_media with empty dict"""
    db = MagicMock()  # pylint: disable=W0621
    db.execute.side_effect = setup_async(MagicMock())
    db.mogrify.side_effect = setup_async(b"mogrified")
    await insert_media(db, {})
    assert db.execute.call_count == 0


@pytest.mark.asyncio
async def test_get_args_str():
    """Test get_args_str"""
    db = MagicMock()  # pylint: disable=W0621
    decode_mock = MagicMock()
    decode_mock.decode.return_value = "A"
    db.mogrify.side_effect = setup_async(decode_mock)
    data = [1, 2, 3]
    values = {}
    await _get_args_str(db, data, values)
    assert db.mogrify.call_count == 3


@pytest.mark.asyncio
async def test_fetch_media(db, monkeypatch):  # pylint: disable=W0621
    """Test fetch_media"""
    decode_mock = MagicMock()
    decode_mock.body.decode.return_value = "{}"
    client_mock = MagicMock()
    client_mock.fetch.side_effect = setup_async(decode_mock)
    monkeypatch.setattr(models.media, 'AsyncHTTPClient', lambda: client_mock)
    monkeypatch.setattr(models.media, 'insert_media', setup_async(None))
    res = await to_asyncio_future(fetch_media(
        db, {'access_token': '1', 'id': 1}, '/url'))
    assert client_mock.fetch.called
    assert decode_mock.body.decode.called
    assert res is True
