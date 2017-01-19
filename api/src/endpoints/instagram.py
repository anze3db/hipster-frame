import os
from urllib.parse import urlencode
import tornado.ioloop
import tornado.web
from tornado.httpclient import AsyncHTTPClient
import json
from models.users import insert_user
from models.users import json_to_user
from models.users import get_user
from models.media import response_to_media
from models.media import insert_media
from models.media import get_media

REDIRECT_URI = os.environ.get("SERVER_URI")
INSTAGRAM_URI = "https://api.instagram.com/"
INSTAGRAM_OAUTH = INSTAGRAM_URI + "oauth/"
INSTAGRAM_MEDIA = INSTAGRAM_URI + "v1/users/self/media/recent?access_token="
REQUIRED_ENV_VARS = ("CLIENT_ID", "CLIENT_SECRET", "REDIRECT_URI")


class InstagramHandler(tornado.web.RequestHandler):
    def initialize(self):
        self._check_env_variables()
        self.get_actions = {
            "callback": self.callback,
            "authorize": self.authorize,
            "media": self.media,
            "logout": self.logout,
        }

    async def get(self, action):
        if action not in self.get_actions.keys():
            self.send_error(404)
            return
        await self.get_actions[action]()

    async def logout(self):
        self.clear_cookie("auth")
        self.redirect(REDIRECT_URI)

    async def callback(self):
        http_client = self._get_client()
        params = {
            "client_id": os.environ.get("CLIENT_ID"),
            "client_secret": os.environ.get("CLIENT_SECRET"),
            "grant_type": "authorization_code",
            "redirect_uri": os.environ.get("REDIRECT_URI"),
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
        await self._fetch_media(user)
        self.redirect(REDIRECT_URI)

    async def authorize(self):
        params = ("/?client_id={CLIENT_ID}&redirect_uri={REDIRECT_URI}" +
                  "&response_type=code").format(
                      CLIENT_ID=os.environ.get("CLIENT_ID"),
                      REDIRECT_URI=os.environ.get("REDIRECT_URI"))
        self.redirect(INSTAGRAM_OAUTH + "authorize" + params)

    async def media(self):
        id_ = int(self.get_secure_cookie("auth"))
        cursor = await get_media(self.application.db, id_)
        response = cursor.fetchall()
        self.write(json.dumps(response, default=lambda x: str(x)))

    def _get_client(self):
        return AsyncHTTPClient()

    def _check_env_variables(self):
        for key in REQUIRED_ENV_VARS:
            if key not in os.environ:
                raise Exception("Missing environment variable: {}".format(key))
            val = os.environ.get(key)
            if not len(val):
                raise Exception("Environment variable {} not set".format(key))

    async def _fetch_media(self, user):
        http_client = self._get_client()
        response = await http_client.fetch(
            INSTAGRAM_MEDIA + user.get("access_token"),
            method="GET")
        media = json.loads(response.body.decode("utf-8"))
        to_insert = list(response_to_media(data, user.get('id')) for data in
                         media.get('data', []))
        await insert_media(self.application.db, to_insert)
