from flask import Flask, render_template
from dotenv import load_dotenv
import os

load_dotenv()
app = Flask(__name__, template_folder="templates", static_folder="static")

API_URL = os.getenv("FASTAPI_URL", "http://localhost:8000")


@app.route("/")
def landing():
    return render_template("landing.html")


@app.route("/chat")
def chat():
    return render_template("chat.html", api_url=API_URL)


if __name__ == "__main__":
    app.run(debug=True, port=5000)
