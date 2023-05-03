"""Aspect for logging"""
from typing import Any, Callable

from IPython.utils.capture import capture_output

from .ipycompss_kernel import IPyCOMPSsKernel


def around_call(
    klass: type, original_function: str
) -> Callable[[Callable[..., Any]], None]:
    """Decorator to set aspects"""

    def set_new_function(aspect: Callable[..., Any]) -> None:
        new_function = aspect(getattr(klass, original_function))
        setattr(klass, original_function, new_function)

    return set_new_function


@around_call(IPyCOMPSsKernel, "_execute")
def log(function: Callable[..., Any]) -> Callable[..., Any]:
    """Logging aspect"""

    def logged_function(self: IPyCOMPSsKernel, *args: Any, **kwargs: Any) -> Any:
        result = None
        with capture_output() as capture:
            result = function(self, *args, **kwargs)
        if capture.stdout:
            self.log.info(capture.stdout)
        if capture.stderr:
            self.log.warn(capture.stderr)
        return result

    return logged_function
