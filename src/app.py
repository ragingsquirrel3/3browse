import os
from flask import Flask, render_template, request, redirect, send_from_directory, url_for, jsonify
from flask_webpack import Webpack
import requests
import redis
import json
import random
from flask_compress import Compress

# redis config
try:
  REDIS_SERVER = int(os.environ.get('REDIS_URL', 5000))
  r = redis.StrictRedis(host='localhost', port=6379, db=0)
except Exception, e:
  print 'error connecting to redis'

# init app
app = Flask(__name__)
Compress(app)
# configure with webpack
webpack = Webpack()
params = {
    'DEBUG': True,
    'WEBPACK_MANIFEST_PATH': './build/manifest.json'
}
app.config.update(params)
webpack.init_app(app)

@app.route('/', methods=['GET'])
def index():
  return render_template('index.html')

# make static assets available
@app.route('/public/<path:path>')
def send_static(path):
    return send_from_directory('../public', path)

# cache a la https://stackoverflow.com/questions/23112316/using-flask-how-do-i-modify-the-cache-control-header-for-all-output
@app.after_request
def add_header(response):
    # 12 hours
    response.cache_control.max_age = 43200
    return response

if __name__ == '__main__':
  port = int(os.environ.get('PORT', 5000))
  app.run(host='0.0.0.0', port=port, debug=True)
