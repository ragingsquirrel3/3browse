build:
	pip install -r requirements.txt
	npm install
	npm run build

run:
	python src/app.py

process-data:
	python src/lib/process_coordinates.py
