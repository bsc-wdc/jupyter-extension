from typing import Any

from ipycompss_kernel.bool_parameter import BooleanParameter
from ipycompss_kernel.int_parameter import IntegerParameter


class ParameterFactory():
    type_dictionary: dict[type] = {bool: BooleanParameter, int: IntegerParameter}
    basic_parameters: list[tuple[str, type, Any]] = [
        ('graph', bool, False), ('debug', bool, False),
        ('trace', bool, False), ('monitor', int, 1000)
    ]
    advanced_parameters: list[tuple[str, type, Any]] = [
        # ('log_level', Enum('LogLevel', ['trace', 'debug', 'info', 'api', 'off'])),  # BASIC
        ('o_c', bool, False),
        # ('project_xml', Path), ('resources_xml', Path),
        ('summary', bool, False),
        # ('task_execution', Enum('TaskExecution', ['compss', 'storage'])),
        # ('storage_impl', Path), ('storage_conf', Path),
        # ('streaming_backend', Enum('StreamingMode', ['FILES', 'OBJECTS', 'PSCOS', 'ALL', None])),
        # ('streaming_master_name', str), ('streaming_master_port', str),
        ('task_count', int, 50),
        # ('app_name', str), ('uuid', str), ('log_dir', Path), ('master_working_dir', Path),
        # ('extrae_cfg', str), #??
        # ('extrae_final_directory', Path), ('comm', Enum('Comm', ['NIO', 'GAT'])),
        # ('conn', Enum('Conn', ['es.bsc.compss.connectors.DefaultSSHConnector', 'es.bsc.compss.connectors.DefaultNoSSHConnector'])),
        # ('master_name', str), ('master_port', str),
        # ('scheduler', Enum('Scheduler', ['es.bsc.compss.components.impl.TaskScheduler',
        #     'es.bsc.compss.scheduler.orderstrict.fifo.FifoTS',
        #     'es.bsc.compss.scheduler.lookahead.fifo.FifoTS',
        #     'es.bsc.compss.scheduler.lookahead.lifo.LifoTS',
        #     'es.bsc.compss.scheduler.lookahead.locality.LocalityTS', 
        #     'es.bsc.compss.scheduler.lookahead.successors.constraintsfifo.ConstraintsFifoTS',
        #     'es.bsc.compss.scheduler.lookahead.mt.successors.constraintsfifo.ConstraintsFifoTS',
        #     'es.bsc.compss.scheduler.lookahead.successors.fifo.FifoTS',
        #     'es.bsc.compss.scheduler.lookahead.mt.successors.fifo.FifoTS',
        #     'es.bsc.compss.scheduler.lookahead.successors.lifo.LifoTS',
        #     'es.bsc.compss.scheduler.lookahead.mt.successors.lifo.LifoTS',
        #     'es.bsc.compss.scheduler.lookahead.successors.locality.LocalityTS',
        #     'es.bsc.compss.scheduler.lookahead.mt.successors.locality.LocalityTS'])),
        # ('jvm_workers', str), ##?
        # ('cpu_affinity', str), ##?
        # ('gpu_affinity', str),
        # ('fpga_affinity', str),
        # ('fpga_reprogram', str), #?##
        # ('profile_input', Path), ('profile_output', Path), ('scheduler_config', Path),
        ('external_adaptation', bool, False), ('propagate_virtual_environment', bool, True),
        ('mpi_worker', bool, False),
        # ('worker_cache', Union[bool, str]), #?
        ('shutdown_in_node_failure', bool, False), ('io_executors', int, 0),
        # ('env_script', Path),
        ('tracing_task_dependencies', bool, False),
        # ('trace_label', str),
        # ('extrae_cfg_python', str), ##?
        ('wcl', int, 0), ('cache_profiler', bool, False), ('data_provenance', bool, False),
        # ('checkpoint_policy', Enum('Checkpoint', [
        #     'es.bsc.compss.checkpoint.policies.CheckpointPolicyInstantiatedGroup',
        #     'es.bsc.compss.checkpoint.policies.CheckpointPolicyPeriodicTime',
        #     'es.bsc.compss.checkpoint.policies.CheckpointPolicyFinishedTasks',
        #     'es.bsc.compss.checkpoint.policies.NoCheckpoint'
        # ])), ('checkpoint_params', str), ('checkpoint_folder', str), #?
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
