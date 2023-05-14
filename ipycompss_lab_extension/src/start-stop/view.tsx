import { Dialog, ToolbarButtonComponent } from '@jupyterlab/apputils';
import React from 'react';

import {
  BooleanParameter,
  EnumerationParameter,
  IntegerParameter,
  ParameterGroupWidget,
  StringParameter
} from '../parameter';

function StartStopView({
  start,
  stop
}: StartStopView.IProperties): JSX.Element {
  return (
    <>
      <ToolbarButtonComponent
        label="Start"
        enabled={start.enabled}
        onClick={start.onClick}
      />
      <ToolbarButtonComponent
        label="Stop"
        enabled={stop.enabled}
        onClick={stop.onClick}
      />
    </>
  );
}

namespace StartStopView {
  export interface IProperties {
    start: IButtonProperties;
    stop: IButtonProperties;
  }

  export interface IButtonProperties {
    enabled: boolean;
    onClick: () => Promise<void>;
  }

  enum LogLevel {
    TRACE = 'trace',
    DEBUG = 'debug',
    INFO = 'info',
    API = 'api',
    OFF = 'off'
  }

  enum TaskExecution {
    COMPSS = 'compss',
    STORAGE = 'storage'
  }

  enum StreamingMode {
    FILES = 'FILES',
    OBJECTS = 'OBJECTS',
    PSCOS = 'PSCOS',
    ALL = 'ALL',
    NONE = 'NONE'
  }

  enum Communication {
    NIO = 'NIO',
    GAT = 'GAT'
  }

  enum Connector {
    SSH = 'es.bsc.compss.connectors.DefaultSSHConnector',
    NO_SSH = 'es.bsc.compss.connectors.DefaultNoSSHConnector'
  }

  enum Scheduler {
    TASK = 'es.bsc.compss.components.impl.TaskScheduler',
    ORDER_STRICT_FIFO_TS = 'es.bsc.compss.scheduler.orderstrict.fifo.FifoTS',
    FIFO_TS = 'es.bsc.compss.scheduler.lookahead.fifo.FifoTS',
    LIFO_TS = 'es.bsc.compss.scheduler.lookahead.lifo.LifoTS',
    LOCALITY_TS = 'es.bsc.compss.scheduler.lookahead.locality.LocalityTS',
    CONSTRAINTS_FIFO_TS = 'es.bsc.compss.scheduler.lookahead.successors.constraintsfifo.ConstraintsFifoTS',
    MT_CONSTRAINTS_FIFO_TS = 'es.bsc.compss.scheduler.lookahead.mt.successors.constraintsfifo.ConstraintsFifoTS',
    SUCCESSORS_FIFO_TS = 'es.bsc.compss.scheduler.lookahead.successors.fifo.FifoTS',
    MT_SUCCESSORS_FIFO_TS = 'es.bsc.compss.scheduler.lookahead.mt.successors.fifo.FifoTS',
    SUCCESSORS_LIFO_TS = 'es.bsc.compss.scheduler.lookahead.successors.lifo.LifoTS',
    MT_SUCCESSORS_LIFO_TS = 'es.bsc.compss.scheduler.lookahead.mt.successors.lifo.LifoTS',
    SUCCESSORS_LOCALITY_TS = 'es.bsc.compss.scheduler.lookahead.successors.locality.LocalityTS',
    MT_SUCCESSORS_LOCALITY_TS = 'es.bsc.compss.scheduler.lookahead.mt.successors.locality.LocalityTS'
  }

  enum CheckpointPolicy {
    INSTANCIATED_GROUP = 'es.bsc.compss.checkpoint.policies.CheckpointPolicyInstantiatedGroup',
    PERIODIC_TIME = 'es.bsc.compss.checkpoint.policies.CheckpointPolicyPeriodicTime',
    FINISHED_TASKS = 'es.bsc.compss.checkpoint.policies.CheckpointPolicyFinishedTasks',
    NO = 'es.bsc.compss.checkpoint.policies.NoCheckpoint'
  }

  export const dialogBody = (): Dialog.IBodyWidget<
    Map<string, any> | undefined
  > => {
    const parameters: ParameterGroupWidget.IParameter[] = [
      { name: 'graph', defaultValue: false, Parameter: BooleanParameter },
      { name: 'debug', defaultValue: false, Parameter: BooleanParameter },
      { name: 'trace', defaultValue: false, Parameter: BooleanParameter },
      { name: 'monitor', defaultValue: 1000, Parameter: IntegerParameter }
    ];
    const advancedParameters: ParameterGroupWidget.IParameter[] = [
      {
        name: 'log_level',
        defaultValue: LogLevel.OFF,
        Parameter: EnumerationParameter,
        options: LogLevel
      },
      { name: 'o_c', defaultValue: false, Parameter: BooleanParameter },
      { name: 'project_xml', defaultValue: '', Parameter: StringParameter },
      { name: 'resources_xml', defaultValue: '', Parameter: StringParameter },
      { name: 'summary', defaultValue: false, Parameter: BooleanParameter },
      {
        name: 'task_execution',
        defaultValue: TaskExecution.COMPSS,
        Parameter: EnumerationParameter,
        options: TaskExecution
      },
      { name: 'storage_impl', defaultValue: '', Parameter: StringParameter },
      { name: 'storage_conf', defaultValue: '', Parameter: StringParameter },
      {
        name: 'streaming_backend',
        defaultValue: StreamingMode.NONE,
        Parameter: EnumerationParameter,
        options: StreamingMode
      },
      {
        name: 'streaming_master_name',
        defaultValue: '',
        Parameter: StringParameter
      },
      {
        name: 'streaming_master_port',
        defaultValue: '',
        Parameter: StringParameter
      },
      { name: 'task_count', defaultValue: 50, Parameter: IntegerParameter },
      {
        name: 'app_name',
        defaultValue: 'InteractiveMode',
        Parameter: StringParameter
      },
      { name: 'uuid', defaultValue: '', Parameter: StringParameter },
      { name: 'log_dir', defaultValue: '', Parameter: StringParameter },
      {
        name: 'master_working_dir',
        defaultValue: '',
        Parameter: StringParameter
      },
      { name: 'extrae_cfg', defaultValue: '', Parameter: StringParameter },
      {
        name: 'extrae_final_directory',
        defaultValue: '',
        Parameter: StringParameter
      },
      {
        name: 'comm',
        defaultValue: Communication.NIO,
        Parameter: EnumerationParameter,
        options: Communication
      },
      {
        name: 'conn',
        defaultValue: Connector.SSH,
        Parameter: EnumerationParameter,
        options: Connector
      },
      { name: 'master_name', defaultValue: '', Parameter: StringParameter },
      { name: 'master_port', defaultValue: '', Parameter: StringParameter },
      {
        name: 'scheduler',
        defaultValue: Scheduler.LOCALITY_TS,
        Parameter: EnumerationParameter,
        options: Scheduler
      },
      {
        name: 'jvm_workers',
        defaultValue: '-Xms1024m,-Xmx1024m,-Xmn400m',
        Parameter: StringParameter
      },
      {
        name: 'cpu_affinity',
        defaultValue: 'automatic',
        Parameter: StringParameter
      },
      {
        name: 'gpu_affinity',
        defaultValue: 'automatic',
        Parameter: StringParameter
      },
      {
        name: 'fpga_affinity',
        defaultValue: 'automatic',
        Parameter: StringParameter
      },
      { name: 'fpga_reprogram', defaultValue: '', Parameter: StringParameter },
      { name: 'profile_input', defaultValue: '', Parameter: StringParameter },
      { name: 'profile_output', defaultValue: '', Parameter: StringParameter },
      {
        name: 'scheduler_config',
        defaultValue: '',
        Parameter: StringParameter
      },
      {
        name: 'external_adaptation',
        defaultValue: false,
        Parameter: BooleanParameter
      },
      {
        name: 'propagate_virtual_environment',
        defaultValue: true,
        Parameter: BooleanParameter
      },
      { name: 'mpi_worker', defaultValue: false, Parameter: BooleanParameter },
      { name: 'worker_cache', defaultValue: '', Parameter: StringParameter },
      {
        name: 'shutdown_in_node_failure',
        defaultValue: false,
        Parameter: BooleanParameter
      },
      { name: 'io_executors', defaultValue: 0, Parameter: IntegerParameter },
      { name: 'env_script', defaultValue: '', Parameter: StringParameter },
      {
        name: 'tracing_task_dependencies',
        defaultValue: false,
        Parameter: BooleanParameter
      },
      { name: 'trace_label', defaultValue: '', Parameter: StringParameter },
      {
        name: 'extrae_cfg_python',
        defaultValue: '',
        Parameter: StringParameter
      },
      { name: 'wcl', defaultValue: 0, Parameter: IntegerParameter },
      {
        name: 'cache_profiler',
        defaultValue: false,
        Parameter: BooleanParameter
      },
      {
        name: 'data_provenance',
        defaultValue: false,
        Parameter: BooleanParameter
      },
      {
        name: 'checkpoint_policy',
        defaultValue: CheckpointPolicy.NO,
        Parameter: EnumerationParameter,
        options: CheckpointPolicy
      },
      {
        name: 'checkpoint_params',
        defaultValue: '',
        Parameter: StringParameter
      },
      {
        name: 'checkpoint_folder',
        defaultValue: '',
        Parameter: StringParameter
      },
      { name: 'verbose', defaultValue: false, Parameter: BooleanParameter },
      {
        name: 'disable_external',
        defaultValue: false,
        Parameter: BooleanParameter
      }
    ];
    const widget = new ParameterGroupWidget();
    widget.data = { parameters, toSend: true, advancedParameters };
    widget.addClass('ipycompss-popup');
    return widget;
  };
}

export default StartStopView;
