def response_to_user(data):
    user = data.get("user")
    user["access_token"] = data["access_token"]
    return user


def insert_user(db, user):
    return db.execute(
        """
        INSERT INTO users (instagram_id, access_token, username, bio,
                           website, profile_picture, full_name,
                           created_at)
        VALUES (%(id)s, %(access_token)s, %(username)s, %(bio)s,
                %(website)s, %(profile_picture)s, %(full_name)s,
                current_timestamp)
        ON CONFLICT (instagram_id)
        DO UPDATE SET (access_token, username, bio,
                       website, profile_picture, full_name,
                       updated_at) =
                      (%(access_token)s, %(username)s, %(bio)s,
                       %(website)s, %(profile_picture)s, %(full_name)s,
                       current_timestamp)
        WHERE users.instagram_id = %(id)s
        RETURNING id;
        """, user)
