build:
	pip install -r requirements.txt
	npm install
	npm run build

run:
	python src/app.py

setup-dev:
	source venv/bin/active
	npm run build
	npm start
