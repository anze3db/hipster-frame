#
# file: migrations/0002.create-media.py
#
from yoyo import step

__depends__ = ['0001.create-users']

step(
    """
    CREATE TABLE media
    (
        id serial,
        media_id text NOT NULL,
        media_created_time timestamp NOT NULL,
        user_id integer REFERENCES users (id) ON DELETE CASCADE,
        data json NOT NULL,
        created_at timestamp with time zone NOT NULL,
        updated_at timestamp with time zone,
        CONSTRAINT pk_media PRIMARY KEY (id),
        CONSTRAINT uq_media_id UNIQUE (media_id)
    )
    """,
    "DROP TABLE IF EXISTS media",
)
