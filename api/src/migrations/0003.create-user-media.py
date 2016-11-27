#
# file: migrations/0003.create_user_media.py
#
from yoyo import step

__depends__ = ['0001.create-users', '0002.create-media']

step(
    """
    CREATE TABLE user_media
    (
        id serial,
        user_id integer REFERENCES users (id) ON DELETE CASCADE,
        media_id integer REFERENCES media (id) ON DELETE CASCADE,
        source text NOT NULL,
        created_at timestamp with time zone NOT NULL,
        updated_at timestamp with time zone,
        CONSTRAINT pk_user_media PRIMARY KEY (id),
        CONSTRAINT uq_user_media UNIQUE (user_id, media_id)
    );
    """,
    "DROP TABLE IF EXISTS user_media;"
)
