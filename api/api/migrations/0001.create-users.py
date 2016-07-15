#
# file: migrations/0001.create-foo.py
#
from yoyo import step

step(
    """
    CREATE TABLE users
    (
        id serial,
        instagram_id integer NOT NULL,
        access_token text NOT NULL,
        username text NOT NULL,
        bio text,
        website text,
        profile_picture text,
        full_name text,
        created_at timestamp with time zone NOT NULL,
        updated_at timestamp with time zone,
        CONSTRAINT pk_users PRIMARY KEY (id),
        CONSTRAINT uq_instagram_id UNIQUE (instagram_id)
    )
    """,
    "DROP TABLE IF EXISTS users",
)
