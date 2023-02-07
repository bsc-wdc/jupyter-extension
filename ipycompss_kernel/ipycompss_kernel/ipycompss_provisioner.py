from jupyter_client.provisioning import LocalProvisioner

class IPyCOMPSsProvisioner(LocalProvisioner):
    def get_shutdown_wait_time(self, recommended: float = 5.0) -> float:
        return recommended

