#
# file: migrations/0002.create-media.py
#
from yoyo import step

step(
    """
    CREATE TABLE media
    (
        id serial,
        media_id text NOT NULL,
        media_created_time timestamp NOT NULL,
        data json NOT NULL,
        created_at timestamp with time zone NOT NULL,
        updated_at timestamp with time zone,
        CONSTRAINT pk_media PRIMARY KEY (id),
        CONSTRAINT uq_media_id UNIQUE (media_id)
    )
    """,
    "DROP TABLE IF EXISTS media",
)
