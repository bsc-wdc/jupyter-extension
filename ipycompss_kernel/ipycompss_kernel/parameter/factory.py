"""Factory for parameters"""
from enum import Enum

from .base import ParameterBase
from .bool import BooleanParameter
from .enum import EnumerationParameter
from .int import IntegerParameter
from .path import PathParameter, PathType
from .str import StringParameter

LogLevel = Enum("LogLevel", ["trace", "debug", "info", "api", "off"])
TaskExecution = Enum("TaskExecution", ["compss", "storage"])
StreamingMode = Enum("StreamingMode", ["FILES", "OBJECTS", "PSCOS", "ALL", "NONE"])
Communication = Enum("Communication", ["NIO", "GAT"])
Connector = Enum(
    "Connector",
    [
        "es.bsc.compss.connectors.DefaultSSHConnector",
        "es.bsc.compss.connectors.DefaultNoSSHConnector",
    ],
)
Scheduler = Enum(
    "Scheduler",
    [
        "es.bsc.compss.components.impl.TaskScheduler",
        "es.bsc.compss.scheduler.orderstrict.fifo.FifoTS",
        "es.bsc.compss.scheduler.lookahead.fifo.FifoTS",
        "es.bsc.compss.scheduler.lookahead.lifo.LifoTS",
        "es.bsc.compss.scheduler.lookahead.locality.LocalityTS",
        (
            "es.bsc.compss.scheduler.lookahead."
            "successors.constraintsfifo.ConstraintsFifoTS"
        ),
        (
            "es.bsc.compss.scheduler.lookahead."
            "mt.successors.constraintsfifo.ConstraintsFifoTS"
        ),
        "es.bsc.compss.scheduler.lookahead.successors.fifo.FifoTS",
        "es.bsc.compss.scheduler.lookahead.mt.successors.fifo.FifoTS",
        "es.bsc.compss.scheduler.lookahead.successors.lifo.LifoTS",
        "es.bsc.compss.scheduler.lookahead.mt.successors.lifo.LifoTS",
        "es.bsc.compss.scheduler.lookahead.successors.locality.LocalityTS",
        "es.bsc.compss.scheduler.lookahead.mt.successors.locality.LocalityTS",
    ],
)
CheckpointPolicy = Enum(
    "CheckpointPolicy",
    [
        "es.bsc.compss.checkpoint.policies.CheckpointPolicyInstantiatedGroup",
        "es.bsc.compss.checkpoint.policies.CheckpointPolicyPeriodicTime",
        "es.bsc.compss.checkpoint.policies.CheckpointPolicyFinishedTasks",
        "es.bsc.compss.checkpoint.policies.NoCheckpoint",
    ],
)


class ParameterFactory:
    """Class that creates all parameters"""

    basic_parameters: list[ParameterBase] = [
        BooleanParameter("graph", False),
        BooleanParameter("debug", False),
        BooleanParameter("trace", False),
        IntegerParameter("monitor", 1000),
    ]
    advanced_parameters: list[ParameterBase] = [
        EnumerationParameter("log_level", LogLevel.off),
        BooleanParameter("o_c", False),
        PathParameter("project_xml", "", path_type=PathType.FILE),
        PathParameter("resources_xml", "", path_type=PathType.FILE),
        BooleanParameter("summary", False),
        EnumerationParameter("task_execution", TaskExecution.compss),
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
        EnumerationParameter(
            "conn", Connector["es.bsc.compss.connectors.DefaultSSHConnector"]
        ),
        StringParameter("master_name", ""),
        StringParameter("master_port", ""),
        EnumerationParameter(
            "scheduler",
            Scheduler["es.bsc.compss.scheduler.lookahead.locality.LocalityTS"],
        ),
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
        EnumerationParameter(
            "checkpoint_policy",
            CheckpointPolicy["es.bsc.compss.checkpoint.policies.NoCheckpoint"],
        ),
        StringParameter("checkpoint_params", ""),
        PathParameter("checkpoint_folder", "", path_type=PathType.FOLDER),
        BooleanParameter("verbose", False),
        BooleanParameter("disable_external", False),
    ]

    @staticmethod
    def create_parameters(advanced: bool = False) -> list[ParameterBase]:
        """Create all basic or advanced parameters that PyCOMPSs allows"""
        parameters: list[ParameterBase] = ParameterFactory.basic_parameters
        if advanced:
            parameters = ParameterFactory.advanced_parameters

        return parameters
