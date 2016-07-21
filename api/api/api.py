import momoko
import logging
import os
import tornado.ioloop
import tornado.web
import tornado.options
from instagram import InstagramHandler
from yoyo import read_migrations
from yoyo import get_backend

DBARGS = {
    'password': os.environ.get('DB_ENV_POSTGRES_PASSWORD'),
    'user': os.environ.get('DB_ENV_POSTGRES_USER'),
    'port': os.environ.get('DB_PORT_5432_TCP_PORT'),
    'host': os.environ.get('DB_PORT_5432_TCP_ADDR')
}


class MainHandler(tornado.web.RequestHandler):
    def get(self):
        if self.get_secure_cookie("auth"):
            self.write("Authorized <a href='/instagram/logout'>Logout</a>")
        else:
            self.write("<a href='/instagram/authorize'>Authorize</a>")


def make_app(debug=False):
    return tornado.web.Application([
        (r"/", MainHandler),
        (r"/instagram/(?P<action>[\w]+)/?", InstagramHandler)
    ], debug=debug, cookie_secret=os.environ.get("CLIENT_ID"))


def init_db(app, ioloop):
    app.db = momoko.Pool(
        dsn=('dbname=postgres user={user} password={password} '
             'host={host} port={port}').format(**DBARGS),
        size=1,
        ioloop=ioloop,
    )

    # this is a one way to run ioloop in sync
    future = app.db.connect()
    ioloop.add_future(future, lambda f: ioloop.stop())
    ioloop.start()
    future.result()  # raises exception on connection error


def init_migrations(rollback=False):
    backend = get_backend(
        'postgres://{user}:{password}@{host}/postgres'.format(**DBARGS))
    migrations = read_migrations('api/migrations')
    if rollback:
        backend.rollback_migrations(backend.to_rollback(migrations))
    backend.apply_migrations(backend.to_apply(migrations))


if __name__ == "__main__":
    app = make_app(debug=True)
    tornado.options.parse_command_line()  # this will make sure loggine=debug will actually work
    init_migrations(rollback=True)
    ioloop = tornado.ioloop.IOLoop.current()
    init_db(app, ioloop)
    app.listen(8888)
    ioloop.start()
