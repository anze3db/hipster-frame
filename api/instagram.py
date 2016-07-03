import requests
import os
from flask import redirect
from flask import request

INSTAGRAM_URI = "https://api.instagram.com/"
INSTAGRAM_OAUTH = INSTAGRAM_URI + "oauth/"
REQUIRED_ENV_VARS = ("CLIENT_ID", "CLIENT_SECRET", "REDIRECT_URI")


def setup(app):
    _check_env_variables()
    setup_views(app)


def _check_env_variables():
    for key in REQUIRED_ENV_VARS:
        if key not in os.environ:
            raise Exception("Missing environment variable: {}".format(key))
        val = os.environ.get(key)
        if not len(val):
            raise Exception("Environment variable {} not set".format(key))


def setup_views(app):
    @app.route("/callback")
    def callback():
        r = requests.post(
            INSTAGRAM_OAUTH + "access_token",
            data={
                "client_id": os.environ.get("CLIENT_ID"),
                "client_secret": os.environ.get("CLIENT_SECRET"),
                "grant_type": "authorization_code",
                "redirect_uri": os.environ.get("REDIRECT_URI"),
                "code": request.args.get("code", "")
            })
        return r.text

    @app.route("/authorize")
    def authorize():
        params = ("/?client_id={CLIENT_ID}&redirect_uri={REDIRECT_URI}" +
                  "&response_type=code").format(
                      CLIENT_ID=os.environ.get("CLIENT_ID"),
                      REDIRECT_URI=os.environ.get("REDIRECT_URI"))

        return redirect(INSTAGRAM_OAUTH + "authorize" + params)
