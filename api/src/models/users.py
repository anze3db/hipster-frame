import json


def json_to_user(json_str):
    data = json.loads(json_str)
    user = data.get("user")
    user["access_token"] = data["access_token"]
    user["instagram_id"] = user["id"]
    user["id"] = None
    return user


def insert_user(db, user):
    return db.execute(
        """
        INSERT INTO users (instagram_id, access_token, username, bio,
                           website, profile_picture, full_name,
                           created_at)
        VALUES (%(instagram_id)s, %(access_token)s, %(username)s, %(bio)s,
                %(website)s, %(profile_picture)s, %(full_name)s,
                current_timestamp)
        ON CONFLICT (instagram_id)
        DO UPDATE SET (access_token, username, bio,
                       website, profile_picture, full_name,
                       updated_at) =
                      (%(access_token)s, %(username)s, %(bio)s,
                       %(website)s, %(profile_picture)s, %(full_name)s,
                       current_timestamp)
        WHERE users.instagram_id = %(instagram_id)s
        RETURNING id;
        """, user)


def get_user(db, id_):
    # TODO: Querying the database like this might not be ideal
    id_ = int(id_)
    return db.execute(
        """
        SELECT * from users where id = %s;
        """, (id_,))
