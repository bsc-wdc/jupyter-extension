"""IPyCOMPSs provisioner implementation"""
from jupyter_client.provisioning import LocalProvisioner


class IPyCOMPSsProvisioner(LocalProvisioner):
    """IPyCOMPSs provisioner"""

    def get_shutdown_wait_time(self, recommended: float = 30.0) -> float:
        """Returns the time needed for a complete shutdown"""
        return max(recommended, 30.0)
