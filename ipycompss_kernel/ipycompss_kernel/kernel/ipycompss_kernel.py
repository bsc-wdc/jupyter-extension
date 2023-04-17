"""IPyCOMPSs kernel implementation"""
from typing import Any

from ipykernel.ipkernel import IPythonKernel
from IPython.utils.capture import capture_output

from .info import Info
from .start_stop import StartStop


class IPyCOMPSsKernel(IPythonKernel):
    """IPyCOMPSs Kernel class"""

    def __init__(self, **kwargs: Any) -> None:
        """Initialise kernel"""
        super().__init__(**kwargs)
        self._start_stop = StartStop(self)
        self._info = Info()

    def start(self) -> None:
        """Start the kernel"""
        super().start()
        self._start_stop.start()
        self._info.start()

    def do_shutdown(self, restart: bool) -> dict[str, str]:
        """Shutdown kernel"""

        self._start_stop.do_shutdown()
        return super().do_shutdown(restart)

    def execute(self, expression: str) -> dict[str, Any]:
        """Execute the expression in the kernel"""
        result = {}
        with capture_output() as capture:
            try:
                self.do_execute(  # pylint: disable=no-member
                    expression, silent=True
                ).send(None)
            except StopIteration as execution:
                result = execution.value
            self.log.debug(capture.stdout)
            self.log.warn(capture.stderr)
        return result
