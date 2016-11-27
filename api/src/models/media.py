import psycopg2


def response_to_media(data, user_id):
    media = {
        'media_id': data.get('id'),
        'media_created_time': data.get('created_time'),
        'user_id': user_id,
        'source': 'recents',
        'data': psycopg2.extras.Json(data)
    }
    return media

async def _get_args_str(db, data, values):
    # TODO: Fix this, we should not have to await every db.mogrify, either try
    #       to await a list or call db.mogrify only once!
    args = []
    for datum in data:
        tmp = await db.mogrify(values, datum)
        args.append(tmp.decode('utf-8'))
    return ','.join(args)

async def insert_media(db, data):
    # Insert media
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
        "source": "recents"
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


def get_media(db, id_):
    return db.execute(
        """
        SELECT m.* FROM media AS m JOIN user_media AS um ON um.media_id = m.id
        WHERE um.user_id = %s
        ORDER BY m.media_created_time DESC;
        """, (id_, ))
