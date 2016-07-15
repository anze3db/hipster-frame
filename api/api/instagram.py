import os
from urllib.parse import urlencode
import tornado.ioloop
import tornado.web
from tornado.httpclient import AsyncHTTPClient
import json
import logging
from users import insert_user


INSTAGRAM_URI = "https://api.instagram.com/"
INSTAGRAM_OAUTH = INSTAGRAM_URI + "oauth/"
REQUIRED_ENV_VARS = ("CLIENT_ID", "CLIENT_SECRET", "REDIRECT_URI")


class InstagramHandler(tornado.web.RequestHandler):
    def initialize(self):
        self._check_env_variables()
        self.get_actions = {
            "callback": self._callback,
            "authorize": self._authorize,
        }

    async def get(self, action):
        if action not in self.get_actions.keys():
            self.send_error(404)
            return
        await self.get_actions[action]()

    async def _callback(self):
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
        logging.debug(response.body)
        res = insert_user(self.application.db,
                          json.loads(response.body.decode("utf-8")))
        self.write(response.body)
        self.finish()

    async def _authorize(self):
        params = ("/?client_id={CLIENT_ID}&redirect_uri={REDIRECT_URI}" +
                  "&response_type=code").format(
                      CLIENT_ID=os.environ.get("CLIENT_ID"),
                      REDIRECT_URI=os.environ.get("REDIRECT_URI"))
        self.redirect(INSTAGRAM_OAUTH + "authorize" + params)

    def _get_client(self):
        return AsyncHTTPClient()

    def _check_env_variables(self):
        for key in REQUIRED_ENV_VARS:
            if key not in os.environ:
                raise Exception("Missing environment variable: {}".format(key))
            val = os.environ.get(key)
            if not len(val):
                raise Exception("Environment variable {} not set".format(key))
