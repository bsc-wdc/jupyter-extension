"""Some generic functions that can be used anywhere"""
import os
from typing import Callable, TypeVar


T = TypeVar("T")


def read_boolean_env_var(name: str) -> bool:
    """Read a boolean environmental variable"""
    return _read_env_var(name, lambda value: value.lower() == "true", False)


def read_float_env_var(name: str, default: float) -> float:
    """Read a floating point environmental variable"""
    return _read_env_var(name, float, default)


def _read_env_var(name: str, transform: Callable[[str], T], default: T) -> T:
    """Read an evironmental variable"""
    return transform(os.environ[name]) if name in os.environ else default
