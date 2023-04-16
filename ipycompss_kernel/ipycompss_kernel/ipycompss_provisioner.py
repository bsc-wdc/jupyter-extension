"""IPyCOMPSs provisioner implementation"""
import os

from jupyter_client.provisioning import LocalProvisioner

TIME_VAR = "IPYCOMPSS_SHUTDOWN_TIME"

class IPyCOMPSsProvisioner(LocalProvisioner):
    """IPyCOMPSs provisioner"""

    def __init__(self, **kwargs) -> None:
        """Initialise provisioner"""
        super().__init__(**kwargs)

        self.shutdown_time = (
            float(os.environ[TIME_VAR]) if TIME_VAR in os.environ else 30.0
        )

    def get_shutdown_wait_time(self, recommended: float = 30.0) -> float:
        """Returns the time needed for a complete shutdown"""
        return max(recommended, self.shutdown_time)
