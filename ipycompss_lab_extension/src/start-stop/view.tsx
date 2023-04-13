import { Dialog, ToolbarButtonComponent } from '@jupyterlab/apputils';
import React from 'react';

import { BooleanParameter, EnumerationParameter, IntegerParameter, ParameterGroup, ParameterGroupWidget } from '../parameter';

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
  Map<string, string | null> | undefined
> => {
  const parametersData: ParameterGroup.IParameter[] = [
    { name: 'graph', defaultValue: false, Parameter: BooleanParameter },
    { name: 'debug', defaultValue: false, Parameter: BooleanParameter },
    { name: 'trace', defaultValue: false, Parameter: BooleanParameter },
    { name: 'monitor', defaultValue: 1000, Parameter: IntegerParameter }
  ];
  const advancedParametersData: ParameterGroup.IParameter[] = [
    { name: 'log_level', defaultValue: 'off', Parameter: EnumerationParameter, options: ['trace', 'debug', 'info', 'api', 'off'] },
    { name: 'o_c', defaultValue: false, Parameter: BooleanParameter },
    // { name: 'project_xml', defaultValue: '', Parameter: PathParameter, path_type: PathType.FILE },
    // { name: 'resources_xml', defaultValue: '', Parameter: PathParameter, path_type: PathType.FILE },
    { name: 'summary', defaultValue: false, Parameter: BooleanParameter },
    { name: 'task_execution', defaultValue: 'compss', Parameter: EnumerationParameter, options: ['compss', 'storage'] },
    // PathParameter("storage_impl", "", path_type = PathType.FILE),
    // PathParameter("storage_conf", "", path_type = PathType.FILE),
    // EnumerationParameter("streaming_backend", StreamingMode.NONE),
    // StringParameter("streaming_master_name", ""),
    // StringParameter("streaming_master_port", ""),
    // IntegerParameter("task_count", 50),
    // StringParameter("app_name", "InteractiveMode"),
    // StringParameter("uuid", ""),
    // PathParameter("log_dir", "", path_type = PathType.FOLDER),
    // PathParameter("master_working_dir", "", path_type = PathType.FOLDER),
    // PathParameter("extrae_cfg", "", path_type = PathType.FILE),
    // PathParameter("extrae_final_directory", "", path_type = PathType.FOLDER),
    // EnumerationParameter("comm", Communication.NIO),
    // EnumerationParameter("conn", Connector.SSH),
    // StringParameter("master_name", ""),
    // StringParameter("master_port", ""),
    // EnumerationParameter("scheduler", Scheduler.LOCALITY_TS),
    // StringParameter("jvm_workers", "-Xms1024m,-Xmx1024m,-Xmn400m"),
    // StringParameter("cpu_affinity", "automatic"),
    // StringParameter("gpu_affinity", "automatic"),
    // StringParameter("fpga_affinity", "automatic"),
    // StringParameter("fpga_reprogram", ""),
    // PathParameter("profile_input", "", path_type = PathType.FILE),
    // PathParameter("profile_output", "", path_type = PathType.FILE),
    // PathParameter("scheduler_config", "", path_type = PathType.FILE),
    // BooleanParameter("external_adaptation", False),
    // BooleanParameter("propagate_virtual_environment", True),
    // BooleanParameter("mpi_worker", False),
    // StringParameter("worker_cache", ""),
    // BooleanParameter("shutdown_in_node_failure", False),
    // IntegerParameter("io_executors", 0),
    // PathParameter("env_script", "", path_type = PathType.FILE),
    // BooleanParameter("tracing_task_dependencies", False),
    // StringParameter("trace_label", ""),
    // PathParameter("extrae_cfg_python", "", path_type = PathType.FILE),
    // IntegerParameter("wcl", 0),
    // BooleanParameter("cache_profiler", False),
    // BooleanParameter("data_provenance", False),
    // EnumerationParameter("checkpoint_policy", CheckpointPolicy.NO),
    // StringParameter("checkpoint_params", ""),
    // PathParameter("checkpoint_folder", "", path_type = PathType.FOLDER),
    // BooleanParameter("verbose", False),
    // BooleanParameter("disable_external", False)
  ]
  const parameters = new ParameterGroupWidget();
  parameters.data = parametersData;
  parameters.toSend = true;
  return parameters;
};
