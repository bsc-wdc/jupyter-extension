"""IPyCOMPSs provisioner implementation"""
from typing import Any

from jupyter_client.provisioning import LocalProvisioner

from . import utils

TIME_VAR = "COMPSS_SHUTDOWN_TIME"


class IPyCOMPSsProvisioner(LocalProvisioner):
    """IPyCOMPSs provisioner"""

    def __init__(self, **kwargs: Any) -> None:
        """Initialise provisioner"""
        super().__init__(**kwargs)

        self.shutdown_time = utils.read_float_env_var(TIME_VAR, 30.0)

    def get_shutdown_wait_time(self, recommended: float = 30.0) -> float:
        """Returns the time needed for a complete shutdown"""
        return max(recommended, self.shutdown_time)
