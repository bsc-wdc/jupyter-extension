'''IPyCOMPSs provisioner implementation'''
import os

from jupyter_client.provisioning import LocalProvisioner


class IPyCOMPSsProvisioner(LocalProvisioner):
    '''IPyCOMPSs provisioner'''

    def __init__(self, **kwargs) -> None:
        '''Initialise provisioner'''
        super().__init__(**kwargs)

        self.shutdown_time: float = 30.0
        if 'IPYCOMPSS_SHUTDOWN_TIME' in os.environ:
            self.shutdown_time = float(os.environ['IPYCOMPSS_SHUTDOWN_TIME'])

    def get_shutdown_wait_time(self, recommended: float = 30.0) -> float:
        '''Returns the time needed for a complete shutdown'''
        return max(recommended, self.shutdown_time)
