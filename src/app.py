import os

from flask import Flask, render_template, request, redirect, send_from_directory, url_for

app = Flask(__name__)

@app.route('/', methods=['GET'])
def index():
  return render_template('index.html')

# make static assets available
@app.route('/public/<path:path>')
def send_static(path):
    return send_from_directory('../public', path)

if __name__ == '__main__':
  port = int(os.environ.get('PORT', 5000))
  app.run(host='0.0.0.0', port=port, debug=True)
