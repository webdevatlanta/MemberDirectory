import json


def load(filename):
    try:
        with open(filename) as file:
            return json.load(file)
    except:
        print(time.asctime(), "Failed to load config:", filename)
        raise SystemExit("terminating.")
