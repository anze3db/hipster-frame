"""Instagram endpoint (/api/instagram)"""

import json
from os import environ
from urllib.parse import urlencode
import tornado.ioloop
import tornado.web
from tornado.httpclient import AsyncHTTPClient
from models.users import insert_user
from models.users import json_to_user
from models.users import get_user
from models.media import fetch_media
from models.media import get_media
from models.media import oldest_inserted_id

REDIRECT_URI = environ.get("SERVER_URI")
INSTAGRAM_URI = "https://api.instagram.com/"
INSTAGRAM_OAUTH = INSTAGRAM_URI + "oauth/"
INSTAGRAM_MEDIA = INSTAGRAM_URI + "v1/users/self/media/recent?access_token="
INSTAGRAM_LIKED = INSTAGRAM_URI + "v1/users/self/media/liked?access_token="
REQUIRED_ENV_VARS = ("CLIENT_ID", "CLIENT_SECRET", "REDIRECT_URI")


class InstagramHandler(tornado.web.RequestHandler):  # pylint: disable=W0223
    """Instagram request handler

       Handles everything that comes through /api/instagram/<action>

       Action can be:
         * callback - used for authorisation callback
         * authorise - used for authorising the user
         * logout - used to log out the user
         * media - used to fetch the media
    """
    def initialize(self):
        _check_env_variables()
        self.get_actions = {
            "callback": self.callback,
            "authorize": self.authorize,
            "media": self.media,
            "more": self.more,
            "logout": self.logout,
        }

    async def get(self, action):  # pylint: disable=W0221
        if action not in self.get_actions.keys():
            self.send_error(404)
            return
        await self.get_actions[action]()

    async def logout(self):
        """Logout /api/instagram/logout

           Logs out the user and redirects to REDIRECT_URI
        """
        self.clear_cookie("auth")
        self.redirect(REDIRECT_URI)

    async def callback(self):
        """Callback /api/instagram/callback

           Receives the instagram oauth callback and does the following
              * Fetches the access_token
              * Stores the instagram user into the database
              * Sets the auth secure cookie
              * Fetches media from instagram and stores it into the database
              * Redirects to REDIRECT_URI
        """
        http_client = _get_client()
        params = {
            "client_id": environ.get("CLIENT_ID"),
            "client_secret": environ.get("CLIENT_SECRET"),
            "grant_type": "authorization_code",
            "redirect_uri": environ.get("REDIRECT_URI"),
            "code": self.get_query_argument("code", "")
        }
        body = urlencode(params)
        response = await http_client.fetch(INSTAGRAM_OAUTH + "access_token",
                                           method="POST", body=body)
        user = json_to_user(response.body.decode("utf-8"))
        cursor = await insert_user(self.application.db, user)
        res, = cursor.fetchone()
        user["id"] = res
        self.set_secure_cookie("auth", str(res))
        await fetch_media(self.application.db, user,
                          INSTAGRAM_MEDIA + user.get("access_token"),
                          INSTAGRAM_LIKED + user.get("access_token"))
        self.redirect(REDIRECT_URI)

    async def authorize(self):
        """Authorise the user with instagram /api/instagram/authorize

        First step in the oauth process"""
        params = ("/?client_id={CLIENT_ID}&redirect_uri={REDIRECT_URI}" +
                  "&response_type=code&scope={SCOPE}").format(
                      CLIENT_ID=environ.get("CLIENT_ID"),
                      REDIRECT_URI=environ.get("REDIRECT_URI"),
                      SCOPE="public_content")
        self.redirect(INSTAGRAM_OAUTH + "authorize" + params)

    async def media(self):
        """Fetch media /api/instagram/media"""
        id_ = int(self.get_secure_cookie("auth"))
        cursor = await get_media(self.application.db, id_)
        response = cursor.fetchall()
        self.write(json.dumps(response, default=str))

    async def more(self):
        """Fetch more /api/instagram/more"""
        id_ = int(self.get_secure_cookie("auth"))
        cursor = await get_user(self.application.db, id_)
        user = cursor.fetchone()
        cursor = await oldest_inserted_id(self.application.db, id_)
        response = cursor.fetchone()[0]
        await fetch_media(self.application.db, user,
                          INSTAGRAM_MEDIA + user[2] + '&max_id=' + response,
                          INSTAGRAM_LIKED + user[2] + '&max_id=' + response)
        cursor = await get_media(self.application.db, id_)
        response = cursor.fetchall()
        self.write(json.dumps(response, default=str))


def _get_client():
    return AsyncHTTPClient()


def _check_env_variables():
    for key in REQUIRED_ENV_VARS:
        if key not in environ:
            raise Exception("Missing environment variable: {}".format(key))
        val = environ.get(key)
        if not val:
            raise Exception("Environment variable {} not set".format(key))
