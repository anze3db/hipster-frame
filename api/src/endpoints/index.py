"""Index Handler"""

import tornado.web


class IndexHandler(tornado.web.RequestHandler):  # pylint: disable=W0223
    """Main Handler"""
    def get(self):  # pylint: disable=W0221
        if self.get_secure_cookie("auth"):
            self.write("Authorized <a href='/instagram/logout'>Logout</a>")
        else:
            self.write("<a href='/instagram/authorize'>Authorize</a>")
