"""Base for all parameters"""
from abc import ABC, abstractmethod
from tkinter import Frame
from typing import Any


class ParameterBase(ABC):  # pylint: disable=too-few-public-methods
    """Base class for parameters"""

    def __init__(self, name: str, default: Any) -> None:
        self.name: str = name
        self.default: Any = default

    @abstractmethod
    def make(self, frame: Frame) -> tuple[str, Any]:
        """Create parameter in frame"""
