from jupyter_client.provisioning import LocalProvisioner


class IPyCOMPSsProvisioner(LocalProvisioner):
    def get_shutdown_wait_time(self, recommended: float = 30.0) -> float:
        return max(recommended, 30.0)
