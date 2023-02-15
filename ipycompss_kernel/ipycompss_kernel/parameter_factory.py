from enum import Enum
from pathlib import Path
from typing import Any

from ipycompss_kernel.bool_parameter import BooleanParameter
from ipycompss_kernel.enum_parameter import EnumerationParameter
from ipycompss_kernel.int_parameter import IntegerParameter
from ipycompss_kernel.str_parameter import StringParameter
from ipycompss_kernel.path_parameter import PathParameter

LogLevel = Enum('LogLevel', ['trace', 'debug', 'info', 'api', 'off'])
TaskExecution = Enum('TaskExecution', ['compss', 'storage'])
StreamingMode = Enum(
    'StreamingMode', ['FILES', 'OBJECTS', 'PSCOS', 'ALL', 'NONE'])
Communication = Enum('Communication', ['NIO', 'GAT'])
Connector = Enum('Connector', [
    'es.bsc.compss.connectors.DefaultSSHConnector',
    'es.bsc.compss.connectors.DefaultNoSSHConnector'
])
Scheduler = Enum('Scheduler', [
    'es.bsc.compss.components.impl.TaskScheduler',
    'es.bsc.compss.scheduler.orderstrict.fifo.FifoTS',
    'es.bsc.compss.scheduler.lookahead.fifo.FifoTS',
    'es.bsc.compss.scheduler.lookahead.lifo.LifoTS',
    'es.bsc.compss.scheduler.lookahead.locality.LocalityTS',
    ('es.bsc.compss.scheduler.lookahead.'
     'successors.constraintsfifo.ConstraintsFifoTS'),
    ('es.bsc.compss.scheduler.lookahead.'
     'mt.successors.constraintsfifo.ConstraintsFifoTS'),
    'es.bsc.compss.scheduler.lookahead.successors.fifo.FifoTS',
    'es.bsc.compss.scheduler.lookahead.mt.successors.fifo.FifoTS',
    'es.bsc.compss.scheduler.lookahead.successors.lifo.LifoTS',
    'es.bsc.compss.scheduler.lookahead.mt.successors.lifo.LifoTS',
    'es.bsc.compss.scheduler.lookahead.successors.locality.LocalityTS',
    'es.bsc.compss.scheduler.lookahead.mt.successors.locality.LocalityTS'
])
CheckpointPolicy = Enum('CheckpointPolicy', [
    'es.bsc.compss.checkpoint.policies.CheckpointPolicyInstantiatedGroup',
    'es.bsc.compss.checkpoint.policies.CheckpointPolicyPeriodicTime',
    'es.bsc.compss.checkpoint.policies.CheckpointPolicyFinishedTasks',
    'es.bsc.compss.checkpoint.policies.NoCheckpoint'
])


class ParameterFactory():
    type_dictionary: dict[type] = {
        bool: BooleanParameter, int: IntegerParameter,
        **dict.fromkeys([
            LogLevel, TaskExecution, StreamingMode, Communication, Connector,
            Scheduler, CheckpointPolicy
        ], EnumerationParameter), Path: PathParameter, str: StringParameter
    }
    basic_parameters: list[tuple[str, type, Any]] = [
        ('graph', bool, False), ('debug', bool, False),
        ('trace', bool, False), ('monitor', int, 1000)
    ]
    advanced_parameters: list[tuple[str, type, Any]] = [
        # BASIC
        ('log_level', LogLevel, LogLevel.off), ('o_c', bool, False),
        ('project_xml', Path, ''), ('resources_xml', Path, ''),
        ('summary', bool, False),
        ('task_execution', TaskExecution, TaskExecution.compss),
        ('storage_impl', Path, ''), ('storage_conf', Path, ''),
        ('streaming_backend', StreamingMode, StreamingMode.NONE),
        ('streaming_master_name', str, ''),
        ('streaming_master_port', str, ''), ('task_count', int, 50),
        ('app_name', str, 'InteractiveMode'), ('uuid', str, ''),
        ('log_dir', Path, ''), ('master_working_dir', Path, ''),
        ('extrae_cfg', Path, ''), ('extrae_final_directory', Path, ''),
        ('comm', Communication, Communication.NIO),
        ('conn', Connector,
         Connector['es.bsc.compss.connectors.DefaultSSHConnector']),
        ('master_name', str, ''), ('master_port', str, ''),
        ('scheduler', Scheduler,
         Scheduler['es.bsc.compss.scheduler.lookahead.locality.LocalityTS']),
        ('jvm_workers', str, ''), ('cpu_affinity', str, ''),
        ('gpu_affinity', str, ''), ('fpga_affinity', str, ''),
        ('fpga_reprogram', str, ''), ('profile_input', Path, ''),
        ('profile_output', Path, ''), ('scheduler_config', Path, ''),
        ('external_adaptation', bool, False),
        ('propagate_virtual_environment', bool, True),
        ('mpi_worker', bool, False),
        # ('worker_cache', Union[bool, str]), #?
        ('shutdown_in_node_failure', bool, False), ('io_executors', int, 0),
        ('env_script', Path, ''), ('tracing_task_dependencies', bool, False),
        ('trace_label', str, ''), ('extrae_cfg_python', Path, ''),
        ('wcl', int, 0), ('cache_profiler', bool, False),
        ('data_provenance', bool, False),
        ('checkpoint_policy', CheckpointPolicy,
         CheckpointPolicy['es.bsc.compss.checkpoint.policies.NoCheckpoint']),
        ('checkpoint_params', str, ''), ('checkpoint_folder', Path, ''),
        ('verbose', bool, False), ('disable_external', bool, False)
    ]

    def create_parameters(self, advanced: bool = False) -> list:
        parameters_to_create: list[tuple[str, type, Any]] = (
            ParameterFactory.basic_parameters
        )
        if advanced:
            parameters_to_create = ParameterFactory.advanced_parameters

        parameters: list = []
        for name, type, default in parameters_to_create:
            parameter = ParameterFactory.type_dictionary[type](name, default)
            parameters.append(parameter)
        return parameters
