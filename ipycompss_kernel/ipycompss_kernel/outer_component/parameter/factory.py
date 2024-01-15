"""Factory for parameters"""
import sys
from enum import Enum
from tkinter import Frame, Tk
from types import ModuleType
from typing import TYPE_CHECKING, Any, TypedDict, Union, List

from . import bool as boolean_parameter
from . import enum as enumeration_parameter
from . import int as integer_parameter
from . import path as path_parameter
from . import str as string_parameter
from .path import PathType

if TYPE_CHECKING and sys.version_info >= (3, 11):
    from typing import NotRequired  # pylint: disable=no-name-in-module


class LogLevel(Enum):
    """Log level type"""

    TRACE = "trace"
    DEBUG = "debug"
    INFO = "info"
    API = "api"
    OFF = "off"


class TaskExecution(Enum):
    """Task execution type"""

    COMPSS = "compss"
    STORAGE = "storage"


class StreamingMode(Enum):
    """Streaming mode type"""

    FILES = "FILES"
    OBJECTS = "OBJECTS"
    PSCOS = "PSCOS"
    ALL = "ALL"
    NONE = "NONE"


class Communication(Enum):
    """Communication type"""

    NIO = "NIO"
    GAT = "GAT"


class Connector(Enum):
    """Connector class type"""

    SSH = "es.bsc.compss.connectors.DefaultSSHConnector"
    NO_SSH = "es.bsc.compss.connectors.DefaultNoSSHConnector"


class Scheduler(Enum):
    """Scheduler class type"""

    TASK = "es.bsc.compss.components.impl.TaskScheduler"
    ORDER_STRICT_FIFO_TS = "es.bsc.compss.scheduler.orderstrict.fifo.FifoTS"
    FIFO_TS = "es.bsc.compss.scheduler.lookahead.fifo.FifoTS"
    LIFO_TS = "es.bsc.compss.scheduler.lookahead.lifo.LifoTS"
    LOCALITY_TS = "es.bsc.compss.scheduler.lookahead.locality.LocalityTS"
    CONSTRAINTS_FIFO_TS = (
        "es.bsc.compss.scheduler.lookahead.successors.constraintsfifo.ConstraintsFifoTS",
    )
    MT_CONSTRAINTS_FIFO_TS = (
        "es.bsc.compss.scheduler.lookahead.mt.successors.constraintsfifo.ConstraintsFifoTS",
    )
    SUCCESSORS_FIFO_TS = "es.bsc.compss.scheduler.lookahead.successors.fifo.FifoTS"
    MT_SUCCESSORS_FIFO_TS = (
        "es.bsc.compss.scheduler.lookahead.mt.successors.fifo.FifoTS"
    )
    SUCCESSORS_LIFO_TS = "es.bsc.compss.scheduler.lookahead.successors.lifo.LifoTS"
    MT_SUCCESSORS_LIFO_TS = (
        "es.bsc.compss.scheduler.lookahead.mt.successors.lifo.LifoTS"
    )
    SUCCESSORS_LOCALITY_TS = (
        "es.bsc.compss.scheduler.lookahead.successors.locality.LocalityTS"
    )
    MT_SUCCESSORS_LOCALITY_TS = (
        "es.bsc.compss.scheduler.lookahead.mt.successors.locality.LocalityTS"
    )


class CheckpointPolicy(Enum):
    """Checkpoint policy class type"""

    INSTANCIATED_GROUP = (
        "es.bsc.compss.checkpoint.policies.CheckpointPolicyInstantiatedGroup"
    )
    PERIODIC_TIME = "es.bsc.compss.checkpoint.policies.CheckpointPolicyPeriodicTime"
    FINISHED_TASKS = "es.bsc.compss.checkpoint.policies.CheckpointPolicyFinishedTasks"
    NO = "es.bsc.compss.checkpoint.policies.NoCheckpoint"


class ParameterInfo(TypedDict):
    """Dictionary representing the parameter to be created"""

    name: str
    default: Any
    type: ModuleType
    path_type: "NotRequired[PathType]"


BASIC_PARAMETERS: List[ParameterInfo] = [
    {"name": "graph", "default": False, "type": boolean_parameter},
    {"name": "debug", "default": False, "type": boolean_parameter},
    {"name": "trace", "default": False, "type": boolean_parameter},
    {"name": "monitor", "default": 1000, "type": integer_parameter},
]
ADVANCED_PARAMETERS: List[ParameterInfo] = [
    {"name": "log_level", "default": LogLevel.OFF, "type": enumeration_parameter},
    {"name": "o_c", "default": False, "type": boolean_parameter},
    {
        "name": "project_xml",
        "default": "",
        "type": path_parameter,
        "path_type": PathType.FILE,
    },
    {
        "name": "resources_xml",
        "default": "",
        "type": path_parameter,
        "path_type": PathType.FILE,
    },
    {"name": "summary", "default": False, "type": boolean_parameter},
    {
        "name": "task_execution",
        "default": TaskExecution.COMPSS,
        "type": enumeration_parameter,
    },
    {
        "name": "storage_impl",
        "default": "",
        "type": path_parameter,
        "path_type": PathType.FILE,
    },
    {
        "name": "storage_conf",
        "default": "",
        "type": path_parameter,
        "path_type": PathType.FILE,
    },
    {
        "name": "streaming_backend",
        "default": StreamingMode.NONE,
        "type": enumeration_parameter,
    },
    {"name": "streaming_master_name", "default": "", "type": string_parameter},
    {"name": "streaming_master_port", "default": "", "type": string_parameter},
    {"name": "task_count", "default": 50, "type": integer_parameter},
    {"name": "app_name", "default": "InteractiveMode", "type": string_parameter},
    {"name": "uuid", "default": "", "type": string_parameter},
    {
        "name": "log_dir",
        "default": "",
        "type": path_parameter,
        "path_type": PathType.FOLDER,
    },
    {
        "name": "master_working_dir",
        "default": "",
        "type": path_parameter,
        "path_type": PathType.FOLDER,
    },
    {
        "name": "extrae_cfg",
        "default": "",
        "type": path_parameter,
        "path_type": PathType.FILE,
    },
    {
        "name": "extrae_final_directory",
        "default": "",
        "type": path_parameter,
        "path_type": PathType.FOLDER,
    },
    {"name": "comm", "default": Communication.NIO, "type": enumeration_parameter},
    {"name": "conn", "default": Connector.SSH, "type": enumeration_parameter},
    {"name": "master_name", "default": "", "type": string_parameter},
    {"name": "master_port", "default": "", "type": string_parameter},
    {
        "name": "scheduler",
        "default": Scheduler.LOCALITY_TS,
        "type": enumeration_parameter,
    },
    {
        "name": "jvm_workers",
        "default": "-Xms1024m,-Xmx1024m,-Xmn400m",
        "type": string_parameter,
    },
    {"name": "cpu_affinity", "default": "automatic", "type": string_parameter},
    {"name": "gpu_affinity", "default": "automatic", "type": string_parameter},
    {"name": "fpga_affinity", "default": "automatic", "type": string_parameter},
    {"name": "fpga_reprogram", "default": "", "type": string_parameter},
    {
        "name": "profile_input",
        "default": "",
        "type": path_parameter,
        "path_type": PathType.FILE,
    },
    {
        "name": "profile_output",
        "default": "",
        "type": path_parameter,
        "path_type": PathType.FILE,
    },
    {
        "name": "scheduler_config",
        "default": "",
        "type": path_parameter,
        "path_type": PathType.FILE,
    },
    {"name": "external_adaptation", "default": False, "type": boolean_parameter},
    {
        "name": "propagate_virtual_environment",
        "default": True,
        "type": boolean_parameter,
    },
    {"name": "mpi_worker", "default": False, "type": boolean_parameter},
    {"name": "worker_cache", "default": "", "type": string_parameter},
    {"name": "shutdown_in_node_failure", "default": False, "type": boolean_parameter},
    {"name": "io_executors", "default": 0, "type": integer_parameter},
    {
        "name": "env_script",
        "default": "",
        "type": path_parameter,
        "path_type": PathType.FILE,
    },
    {"name": "tracing_task_dependencies", "default": False, "type": boolean_parameter},
    {"name": "trace_label", "default": "", "type": string_parameter},
    {
        "name": "extrae_cfg_python",
        "default": "",
        "type": path_parameter,
        "path_type": PathType.FILE,
    },
    {"name": "wcl", "default": 0, "type": integer_parameter},
    {"name": "cache_profiler", "default": False, "type": boolean_parameter},
    {"name": "data_provenance", "default": False, "type": boolean_parameter},
    {
        "name": "checkpoint_policy",
        "default": CheckpointPolicy.NO,
        "type": enumeration_parameter,
    },
    {"name": "checkpoint_params", "default": "", "type": string_parameter},
    {
        "name": "checkpoint_folder",
        "default": "",
        "type": path_parameter,
        "path_type": PathType.FOLDER,
    },
    {"name": "verbose", "default": False, "type": boolean_parameter},
    {"name": "disable_external", "default": False, "type": boolean_parameter},
]


def create_parameters(
    frame: Union[Tk, Frame], advanced: bool = False
) -> dict[str, Any]:
    """Create all basic or advanced parameters that PyCOMPSs allows"""
    parameters: list[ParameterInfo] = BASIC_PARAMETERS
    if advanced:
        parameters = ADVANCED_PARAMETERS

    return dict(
        [
            parameter["type"].create(
                parameter["name"],
                parameter["default"],
                frame,
                *([parameter["path_type"]] if "path_type" in parameter else []),
            )
            for parameter in parameters
        ]
    )
