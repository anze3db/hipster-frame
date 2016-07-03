from flask import Flask
import instagram

app = Flask(__name__)

instagram.setup(app)


@app.route("/")
def hello():
    return "Hello World"

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0")
