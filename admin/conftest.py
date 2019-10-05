# This is necessary if using pytest with pytest-watch
# See this issue: https://github.com/pytest-dev/pytest/issues/4699

# If this file is absent, the tests can be run using "python -m pytest", but "python -m pytest_watch" will fail to find imports.
# See this issue: https://github.com/joeyespo/pytest-watch/issues/106
