dependencies:
	python3 -m venv .
	( \
	   source ./bin/activate; \
	   pip install -r requirements.txt; \
	)

start:
	@( \
	   source ./bin/activate; \
	   python3 server; \
	)

test:
	@( \
	   source ./bin/activate; \
	   python3 -m unittest tests/test.py; \
	)
