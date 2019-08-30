from dataclasses import dataclass


@dataclass
class Storage():
    token: str = None


def new_store():
    return Storage()
