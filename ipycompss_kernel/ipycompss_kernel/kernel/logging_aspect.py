"""Aspect for logging"""
from logging import Logger
from typing import Any, Callable

from IPython.utils.capture import capture_output
from traitlets import Instance

from . import IPyCOMPSsKernel


def on_call(
    klass: type, original_function: str
) -> Callable[[Callable[..., Any]], None]:
    """Decorator to set aspects"""

    def set_new_function(aspect: Callable[..., Any]) -> None:
        new_function = aspect(getattr(klass, original_function))
        setattr(klass, original_function, new_function)

    return set_new_function


@on_call(IPyCOMPSsKernel, "do_execute")
def log(function: Callable[..., Any]):
    """Logging aspect"""

    async def logged_function(self: IPyCOMPSsKernel, *args: Any, **kwargs: Any) -> Any:
        result = None
        with capture_output() as capture:
            result = await function(self, *args, **kwargs)

        self.log.warn(capture.stdout)
        self.log.warn(capture.stderr)
        return result

    return logged_function
