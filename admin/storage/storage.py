from dataclasses import dataclass


@dataclass
class Storage:
    token: str = None


def new_store():
    return Storage()


def clear(self):
    self.token = None
