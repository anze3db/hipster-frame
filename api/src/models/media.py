"""Media module"""

import json
import logging
import psycopg2
from tornado.httpclient import AsyncHTTPClient
from tornado import gen


def json_to_media(json_str, user_id, source):
    """Transform the media json string into media dicts"""
    media = json.loads(json_str)
    to_insert = []
    for data in media.get('data', []):
        to_insert.append({
            'media_id': data.get('id'),
            'media_created_time': data.get('created_time'),
            'user_id': user_id,
            'source': source,
            'data': psycopg2.extras.Json(data)
        })
    return to_insert


async def _get_args_str(db, data, values):
    """Get args str

    TODO: Fix this, we should not have to await every db.mogrify, either try
          to await a list or call db.mogrify only once!
    """
    args = []
    for datum in data:
        tmp = await db.mogrify(values, datum)
        args.append(tmp.decode('utf-8'))
    return ','.join(args)


async def insert_media(db, data):
    """Insert media into the database"""
    if not data:
        return
    args_str = await _get_args_str(db, data, """
        (%(media_id)s, to_timestamp(%(media_created_time)s),
         %(data)s, current_timestamp)
        """)
    res = await db.execute(
        """
        INSERT INTO media (media_id, media_created_time,
                           data, created_at)
        VALUES """ + args_str +
        """
        ON CONFLICT (media_id)
        DO UPDATE SET (data, updated_at) =
                      (EXCLUDED.data, current_timestamp)
        WHERE media.media_id = EXCLUDED.media_id
        RETURNING id;
        """)
    ids = res.fetchall()

    # Map media to user
    args_str = await _get_args_str(db, [{
        "media_id": id_[0],
        "user_id": data[0]["user_id"],
        "source": data[0]["source"]
    } for id_ in ids], """
        (%(media_id)s, %(user_id)s, %(source)s, current_timestamp)
        """)
    return db.execute(
        """
        INSERT INTO user_media (media_id, user_id, source, created_at)
        VALUES """ + args_str +
        """
        ON CONFLICT DO NOTHING
        """)


def get_media(db, user_id):
    """Get media from the database for a given user_id"""
    return db.execute(
        """
        SELECT m.* FROM media AS m JOIN user_media AS um ON um.media_id = m.id
        WHERE um.user_id = %s
        ORDER BY m.media_created_time DESC;
        """, (user_id, ))


def oldest_inserted_id(db, id_):
    """Get oldest media inserted id"""
    return db.execute(
        """
        SELECT m.media_id FROM media AS m
          JOIN user_media AS um ON um.media_id = m.id
         WHERE um.user_id = %s
         ORDER BY m.media_created_time ASC LIMIT 1;
        """, (id_, ))


async def _fetch(url):
    client = AsyncHTTPClient()
    logging.info('url %s started', url)
    res = await client.fetch(url, method="GET")
    logging.info("url %s finished", url)
    return res


async def fetch_media(db, user, url, liked=None):
    """Fetch media from the instagram API

    TODO: This method does not belong here, move into a separate integrations
    module"""
    source_names = (
        'INSTAGRAM_POSTED',
        'INSTAGRAM_LIKED'
    )
    source_requests = (
        _fetch(url),
        _fetch(liked)
    )
    source_results = await gen.multi(source_requests)
    source_jsons = [json_to_media(
        source_results[i].body.decode("utf-8"), user.get('id'), name
    ) for i, name in enumerate(source_names)]

    await gen.multi([
        insert_media(db, sjson) for sjson in source_jsons
    ])
    logging.info("Awaited DB INSERT")
    return True
