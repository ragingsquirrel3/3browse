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
    SPREAD = 1
    DEFAULT_POS_I = 2
    a = request.args
    chrom = a.get('chrom') if a.get('chrom') else random.randint(1, 23)
    x = float(a.get('x')) if float(a.get('x')) else DEFAULT_POS_I
    y = float(a.get('y')) if float(a.get('y')) else DEFAULT_POS_I
    z = float(a.get('z')) if float(a.get('z')) else DEFAULT_POS_I
    print x - SPREAD
    xstart = x - SPREAD
    xend = x + SPREAD
    ystart = y - SPREAD
    yend = y + SPREAD
    zstart = z - SPREAD
    zend = z + SPREAD
    random_chrom = random.randint(1, 23)
    url = 'http://1kgenome.exascale.info/3d?m=normal&chr=' + str(chrom) + '&xstart=' + str(xstart) + '&xend=' + str(xend) + '&ystart=' + str(ystart) + '&yend=' + str(yend) + '&zstart=' + str(zstart) + '&zend=' + str(zend)
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
