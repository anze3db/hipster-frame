import tornado.ioloop
import tornado.web
from instagram import InstagramHandler


class MainHandler(tornado.web.RequestHandler):
    def get(self):
        self.write("Hello, world")


def make_app(debug=False):
    return tornado.web.Application([
        (r"/", MainHandler),
        (r"/instagram/(?P<action>[\w]+)/?", InstagramHandler)
    ], debug=debug)

if __name__ == "__main__":
    app = make_app(debug=True)
    app.listen(8888)
    tornado.log.enable_pretty_logging()
    tornado.ioloop.IOLoop.current().start()
