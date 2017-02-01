import os
from flask import Flask, render_template, request, redirect, send_from_directory, url_for, jsonify
from flask_webpack import Webpack
import requests
import json
import random

# init app
app = Flask(__name__)
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

@app.route('/data')
def data():
    SPREAD = 3
    DEFAULT_POS_I = 0
    a = request.args
    chrom = a.get('chrom') if a.get('chrom') else random.randint(1, 23)
    x = a.get('x') if a.get('x') else DEFAULT_POS_I
    y = a.get('y') if a.get('y') else DEFAULT_POS_I
    z = a.get('z') if a.get('z') else DEFAULT_POS_I
    random_chrom = random.randint(1, 23)
    url = 'http://1kgenome.exascale.info/3d?m=normal&chr=' + str(chrom) + '&xstart=1&xend=3&zstart=1&zend=3&ystart=1&yend=3'
    response = requests.get(url)
    data = json.loads(response.text[1:-1])
    original = data['data']
    formatted = []
    for strand in original:
      formatted = formatted + strand[1]
    return jsonify(formatted)

# make static assets available
@app.route('/public/<path:path>')
def send_static(path):
    return send_from_directory('../public', path)

if __name__ == '__main__':
  port = int(os.environ.get('PORT', 5000))
  app.run(host='0.0.0.0', port=port, debug=True)
