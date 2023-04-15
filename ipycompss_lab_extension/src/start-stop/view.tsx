import { Dialog, ToolbarButtonComponent } from '@jupyterlab/apputils';
import React from 'react';

import {
  BooleanParameter,
  EnumerationParameter,
  IntegerParameter,
  ParameterGroup,
  ParameterGroupWidget,
  StringParameter
} from '../parameter';

export namespace StartStopView {
  export interface IProperties {
    start: IButtonProperties;
    stop: IButtonProperties;
  }

  export interface IButtonProperties {
    enabled: boolean;
    onClick: () => Promise<void>;
  }
}

export const StartStopView = ({
  start,
  stop
}: StartStopView.IProperties): JSX.Element => (
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

export const dialogBody = (): Dialog.IBodyWidget<
  Map<string, any> | undefined
> => {
  const parameters: ParameterGroup.IParameter[] = [
    { name: 'graph', defaultValue: false, Parameter: BooleanParameter },
    { name: 'debug', defaultValue: false, Parameter: BooleanParameter },
    { name: 'trace', defaultValue: false, Parameter: BooleanParameter },
    { name: 'monitor', defaultValue: 1000, Parameter: IntegerParameter }
  ];
  const advancedParameters: ParameterGroup.IParameter[] = [
    {
      name: 'log_level',
      defaultValue: 'off',
      Parameter: EnumerationParameter,
      options: ['trace', 'debug', 'info', 'api', 'off']
    },
    { name: 'o_c', defaultValue: false, Parameter: BooleanParameter },
    // { name: 'project_xml', defaultValue: '', Parameter: PathParameter, path_type: PathType.FILE },
    // { name: 'resources_xml', defaultValue: '', Parameter: PathParameter, path_type: PathType.FILE },
    { name: 'summary', defaultValue: false, Parameter: BooleanParameter },
    {
      name: 'task_execution',
      defaultValue: 'compss',
      Parameter: EnumerationParameter,
      options: ['compss', 'storage']
    },
    // PathParameter("storage_impl", "", path_type = PathType.FILE),
    // PathParameter("storage_conf", "", path_type = PathType.FILE),
    {
      name: 'streaming_backend',
      defaultValue: 'NONE',
      Parameter: EnumerationParameter,
      options: ['FILES', 'OBJECTS', 'PSCOS', 'ALL', 'NONE']
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
    // PathParameter("log_dir", "", path_type = PathType.FOLDER),
    // PathParameter("master_working_dir", "", path_type = PathType.FOLDER),
    // PathParameter("extrae_cfg", "", path_type = PathType.FILE),
    // PathParameter("extrae_final_directory", "", path_type = PathType.FOLDER),
    {
      name: 'comm',
      defaultValue: 'NIO',
      Parameter: EnumerationParameter,
      options: ['NIO', 'GAT']
    },
    {
      name: 'conn',
      defaultValue: 'es.bsc.compss.connectors.DefaultSSHConnector',
      Parameter: EnumerationParameter,
      options: [
        'es.bsc.compss.connectors.DefaultSSHConnector',
        'es.bsc.compss.connectors.DefaultNoSSHConnector'
      ]
    },
    { name: 'master_name', defaultValue: '', Parameter: StringParameter },
    { name: 'master_port', defaultValue: '', Parameter: StringParameter },
    {
      name: 'scheduler',
      defaultValue: 'es.bsc.compss.scheduler.lookahead.locality.LocalityTS',
      Parameter: EnumerationParameter,
      options: [
        'es.bsc.compss.components.impl.TaskScheduler',
        'es.bsc.compss.scheduler.orderstrict.fifo.FifoTS',
        'es.bsc.compss.scheduler.lookahead.fifo.FifoTS',
        'es.bsc.compss.scheduler.lookahead.lifo.LifoTS',
        'es.bsc.compss.scheduler.lookahead.locality.LocalityTS',
        'es.bsc.compss.scheduler.lookahead.successors.constraintsfifo.ConstraintsFifoTS',
        'es.bsc.compss.scheduler.lookahead.mt.successors.constraintsfifo.ConstraintsFifoTS',
        'es.bsc.compss.scheduler.lookahead.successors.fifo.FifoTS',
        'es.bsc.compss.scheduler.lookahead.mt.successors.fifo.FifoTS',
        'es.bsc.compss.scheduler.lookahead.successors.lifo.LifoTS',
        'es.bsc.compss.scheduler.lookahead.mt.successors.lifo.LifoTS',
        'es.bsc.compss.scheduler.lookahead.successors.locality.LocalityTS',
        'es.bsc.compss.scheduler.lookahead.mt.successors.locality.LocalityTS'
      ]
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
    // PathParameter("profile_input", "", path_type = PathType.FILE),
    // PathParameter("profile_output", "", path_type = PathType.FILE),
    // PathParameter("scheduler_config", "", path_type = PathType.FILE),
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
    // PathParameter("env_script", "", path_type = PathType.FILE),
    {
      name: 'tracing_task_dependencies',
      defaultValue: false,
      Parameter: BooleanParameter
    },
    { name: 'trace_label', defaultValue: '', Parameter: StringParameter },
    // PathParameter("extrae_cfg_python", "", path_type = PathType.FILE),
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
      defaultValue: 'es.bsc.compss.checkpoint.policies.NoCheckpoint',
      Parameter: EnumerationParameter,
      options: [
        'es.bsc.compss.checkpoint.policies.CheckpointPolicyInstantiatedGroup',
        'es.bsc.compss.checkpoint.policies.CheckpointPolicyPeriodicTime',
        'es.bsc.compss.checkpoint.policies.CheckpointPolicyFinishedTasks',
        'es.bsc.compss.checkpoint.policies.NoCheckpoint'
      ]
    },
    { name: 'checkpoint_params', defaultValue: '', Parameter: StringParameter },
    // PathParameter("checkpoint_folder", "", path_type = PathType.FOLDER),
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
