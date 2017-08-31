"""Main entry point for the hipster-frame API"""

import os
import momoko
import tornado.ioloop
import tornado.web
import tornado.options
import psycopg2
from endpoints.instagram import InstagramHandler
from yoyo import read_migrations
from yoyo import get_backend

DBARGS = {
    'password': os.environ.get('DB_PASSWORD'),
    'user': os.environ.get('DB_USERNAME'),
    'port': os.environ.get('DB_PORT'),
    'host': os.environ.get('DB_HOST')
}


class MainHandler(tornado.web.RequestHandler):  # pylint: disable=W0223
    """Main Handler"""
    def get(self):  # pylint: disable=W0221
        if self.get_secure_cookie("auth"):
            self.write("Authorized <a href='/instagram/logout'>Logout</a>")
        else:
            self.write("<a href='/instagram/authorize'>Authorize</a>")


def make_app(debug=False):
    """Create a new instance of tornado.web.Application

       Sets up the API routes (currently just /api/instagram)
    """
    return tornado.web.Application([
        (r"/api/", MainHandler),
        (r"/api/instagram/(?P<action>[\w]+)/?", InstagramHandler)
    ], debug=debug, cookie_secret=os.environ.get("CLIENT_ID"))


def init_db(app, ioloop):
    """Init the app db connection to the postgres database"""
    app.db = momoko.Pool(
        dsn=('dbname=postgres user={user} password={password} '
             'host={host} port={port}').format(**DBARGS),
        size=1,
        ioloop=ioloop,
        cursor_factory=psycopg2.extras.DictCursor
    )

    # this is a one way to run ioloop in sync
    future = app.db.connect()
    ioloop.add_future(future, lambda f: ioloop.stop())
    ioloop.start()
    future.result()  # raises exception on connection error


def init_migrations(rollback=False):
    """Run migrations

       Also rollback if the rollback parameter is True (useful for testing
       migrations), but kinda dangerous for production though."""
    backend = get_backend(
        'postgres://{user}:{password}@{host}/postgres'.format(**DBARGS))
    migrations = read_migrations('src/migrations')
    if rollback:
        backend.rollback_migrations(backend.to_rollback(migrations))
    backend.apply_migrations(backend.to_apply(migrations))


if __name__ == "__main__":
    APP = make_app(debug=True)
    tornado.options.parse_command_line()
    init_migrations(rollback=False)
    IOLOOP = tornado.ioloop.IOLoop.current()
    init_db(APP, IOLOOP)
    APP.listen(8888)
    IOLOOP.start()
