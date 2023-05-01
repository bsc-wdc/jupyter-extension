"""Factory for parameters"""
from enum import Enum
from tkinter import Frame
from typing import Any

from .base import ParameterBase
from .bool import BooleanParameter
from .enum import EnumerationParameter
from .int import IntegerParameter
from .path import PathParameter, PathType
from .str import StringParameter


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


BASIC_PARAMETERS: list[ParameterBase] = [
    BooleanParameter("graph", False),
    BooleanParameter("debug", False),
    BooleanParameter("trace", False),
    IntegerParameter("monitor", 1000),
]
ADVANCED_PARAMETERS: list[ParameterBase] = [
    EnumerationParameter("log_level", LogLevel.OFF),
    BooleanParameter("o_c", False),
    PathParameter("project_xml", "", path_type=PathType.FILE),
    PathParameter("resources_xml", "", path_type=PathType.FILE),
    BooleanParameter("summary", False),
    EnumerationParameter("task_execution", TaskExecution.COMPSS),
    PathParameter("storage_impl", "", path_type=PathType.FILE),
    PathParameter("storage_conf", "", path_type=PathType.FILE),
    EnumerationParameter("streaming_backend", StreamingMode.NONE),
    StringParameter("streaming_master_name", ""),
    StringParameter("streaming_master_port", ""),
    IntegerParameter("task_count", 50),
    StringParameter("app_name", "InteractiveMode"),
    StringParameter("uuid", ""),
    PathParameter("log_dir", "", path_type=PathType.FOLDER),
    PathParameter("master_working_dir", "", path_type=PathType.FOLDER),
    PathParameter("extrae_cfg", "", path_type=PathType.FILE),
    PathParameter("extrae_final_directory", "", path_type=PathType.FOLDER),
    EnumerationParameter("comm", Communication.NIO),
    EnumerationParameter("conn", Connector.SSH),
    StringParameter("master_name", ""),
    StringParameter("master_port", ""),
    EnumerationParameter("scheduler", Scheduler.LOCALITY_TS),
    StringParameter("jvm_workers", "-Xms1024m,-Xmx1024m,-Xmn400m"),
    StringParameter("cpu_affinity", "automatic"),
    StringParameter("gpu_affinity", "automatic"),
    StringParameter("fpga_affinity", "automatic"),
    StringParameter("fpga_reprogram", ""),
    PathParameter("profile_input", "", path_type=PathType.FILE),
    PathParameter("profile_output", "", path_type=PathType.FILE),
    PathParameter("scheduler_config", "", path_type=PathType.FILE),
    BooleanParameter("external_adaptation", False),
    BooleanParameter("propagate_virtual_environment", True),
    BooleanParameter("mpi_worker", False),
    StringParameter("worker_cache", ""),
    BooleanParameter("shutdown_in_node_failure", False),
    IntegerParameter("io_executors", 0),
    PathParameter("env_script", "", path_type=PathType.FILE),
    BooleanParameter("tracing_task_dependencies", False),
    StringParameter("trace_label", ""),
    PathParameter("extrae_cfg_python", "", path_type=PathType.FILE),
    IntegerParameter("wcl", 0),
    BooleanParameter("cache_profiler", False),
    BooleanParameter("data_provenance", False),
    EnumerationParameter("checkpoint_policy", CheckpointPolicy.NO),
    StringParameter("checkpoint_params", ""),
    PathParameter("checkpoint_folder", "", path_type=PathType.FOLDER),
    BooleanParameter("verbose", False),
    BooleanParameter("disable_external", False),
]


def create_parameters(frame: Frame, advanced: bool = False) -> dict[str, Any]:
    """Create all basic or advanced parameters that PyCOMPSs allows"""
    parameters: list[ParameterBase] = BASIC_PARAMETERS
    if advanced:
        parameters = ADVANCED_PARAMETERS

    return dict([parameter.make(frame) for parameter in parameters])
