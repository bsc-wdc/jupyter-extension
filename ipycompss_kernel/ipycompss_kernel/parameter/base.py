'''Base for all parameters'''
from abc import ABC, abstractmethod
from typing import Any


class ParameterBase(ABC):
    '''Base class for parameters'''

    def __init__(self, name: str, default: Any) -> None:
        self.name: str = name
        self.default: Any = default

    @abstractmethod
    def make(self, frame) -> tuple[str, Any]:
        '''Create parameter in frame'''
