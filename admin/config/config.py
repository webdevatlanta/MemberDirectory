import time
import json


def load(filename):
    try:
        with open(filename) as file:
            return json.load(file)
    except json.JSONDecodeError as err:
        print(time.asctime(), "Failed to decode config JSON:", filename, err)
        raise SystemExit("terminating.")
