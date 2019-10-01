venv: venv/bin/activate

venv/bin/activate: requirements.txt
	test -d venv || python3 -m venv venv
	. venv/bin/activate; pip install -Ur requirements.txt
	touch venv/bin/activate

start: venv
	. venv/bin/activate; python .

test: venv
	. venv/bin/activate; python -m pytest

watch: venv
	. venv/bin/activate; python -m pytest_watch
