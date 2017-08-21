import pytest
import models
from unittest.mock import MagicMock
from tornado.platform.asyncio import to_asyncio_future
from models.media import json_to_media
from models.media import get_media
from models.media import insert_media
from models.media import _get_args_str
from models.media import fetch_media


@pytest.fixture
def db():
    return MagicMock()


@pytest.fixture
def json_str():
    with open('./fixtures/media.fixture', 'r') as f:
        return f.read()


def setup_async(mock):
    async def _asyncmock(*argv, **args):
        return mock
    return _asyncmock


def test_json_to_media(json_str):
    res = json_to_media(json_str, 1, 'INSTAGRAM_LIKED')
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
    db.execute.side_effect = setup_async(MagicMock())
    db.mogrify.side_effect = setup_async(b"mogrified")

    await insert_media(db, {'something': 'other'})
    assert db.execute.call_count == 2


@pytest.mark.asyncio
async def test_get_args_str():
    db = MagicMock()
    decodeMock = MagicMock()
    decodeMock.decode.return_value = "A"
    db.mogrify.side_effect = setup_async(decodeMock)
    data = [1, 2, 3]
    values = {}
    await _get_args_str(db, data, values)
    assert db.mogrify.call_count == 3


@pytest.mark.asyncio
async def test_fetch_media(db, monkeypatch):
    decodeMock = MagicMock()
    decodeMock.body.decode.return_value = "{}"
    clientMock = MagicMock()
    clientMock.fetch.side_effect = setup_async(decodeMock)
    monkeypatch.setattr(models.media, 'AsyncHTTPClient', lambda: clientMock)
    monkeypatch.setattr(models.media, 'insert_media', setup_async(None))
    res = await to_asyncio_future(fetch_media(
        db, {'access_token': '1', 'id': 1}, '/url'))
    assert clientMock.fetch.called
    assert decodeMock.body.decode.called
    assert res is True
