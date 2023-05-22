"""Kernel start and stop methods"""
import re
import subprocess
from typing import Callable

from ... import utils
from . import messaging as status_messaging
from .messaging import StatusDto

SC_VAR = "COMPSS_RUNNING_IN_SC"


def start() -> None:
    """Register status callback"""
    cluster = utils.read_boolean_env_var(SC_VAR)
    status_messaging.on_status(_get_status(cluster))


def _get_status(cluster: bool) -> Callable[[], StatusDto]:
    """Send status comm to the frontend"""

    def callback() -> StatusDto:
        processes = subprocess.run(
            ["ps", "aux", "ww"], stdout=subprocess.PIPE, check=False
        )
        started = re.search(
            r"java.*compss-engine\.jar", processes.stdout.decode("utf-8")
        )
        monitor_started = re.search(
            r"-Dcatalina.home=[^ ]*COMPSs/Tools/monitor/apache-tomcat",
            processes.stdout.decode("utf-8"),
        )
        return {
            "cluster": cluster,
            "started": started is not None,
            "monitor_started": monitor_started is not None,
        }

    return callback
