"""IPyCOMPSs kernel implementation"""
from typing import Any

from ipykernel.ipkernel import IPythonKernel

from .info import info
from .monitor import monitor
from .start_stop import start_stop


class IPyCOMPSsKernel(IPythonKernel):
    """IPyCOMPSs Kernel class"""

    def start(self) -> None:
        """Start the kernel"""
        super().start()
        start_stop.start(self._execute)
        monitor.start(self._execute)
        info.start()

    def do_shutdown(self, restart: bool) -> dict[str, Any]:
        """Shutdown kernel"""

        start_stop.do_shutdown(self._execute)
        monitor.do_shutdown(self._execute)
        return super().do_shutdown(restart)

    def _execute(self, expression: str) -> dict[str, Any]:
        """Execute the expression in the kernel"""
        result = {}
        try:
            self.do_execute(expression, silent=True).send(  # pylint: disable=no-member
                None
            )
        except StopIteration as execution:
            result = execution.value
        return result
