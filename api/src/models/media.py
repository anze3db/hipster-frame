# 	to_timestamp(1284352323)
import psycopg2


def response_to_media(data, user_id):
    media = {
        'media_id': data.get('id'),
        'media_created_time': data.get('created_time'),
        'user_id': user_id,
        'data': psycopg2.extras.Json(data)
    }
    return media


async def insert_media(db, data):
    args = []
    # TODO: Fix this, we should not have to await every db.mogrify, either try
    #       to await a list or call db.mogrify only once!
    for datum in data:
        tmp = await db.mogrify(
            """
            (%(media_id)s, to_timestamp(%(media_created_time)s),
             %(user_id)s, %(data)s, current_timestamp)
            """, datum)
        args.append(tmp.decode('utf-8'))
    args_str = ','.join(args)
    return db.execute(
        """
        INSERT INTO media (media_id, media_created_time, user_id,
                           data, created_at)
        VALUES """ + args_str +
        """
        ON CONFLICT (media_id)
        DO UPDATE SET (data, updated_at) =
                      (EXCLUDED.data, current_timestamp)
        WHERE media.media_id = EXCLUDED.media_id
        RETURNING id;
        """.format(args_str))


def get_media(db, id_):
    return db.execute(
        """
        SELECT * FROM media WHERE user_id = %s
        ORDER BY media_created_time DESC;
        """, (id_, ))
