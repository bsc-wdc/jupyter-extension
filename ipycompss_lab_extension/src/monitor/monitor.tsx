import { IConsoleTracker } from '@jupyterlab/console';
import { INotebookTracker } from '@jupyterlab/notebook';
import React from 'react';

import Status from '../status';
import Utils from '../utils';
import MonitorManager from './manager';
import MonitorView from './view';

namespace Monitor {
  export type ActionType = 'start' | 'open' | 'stop';

  export interface IProperties {
    consoleTracker: IConsoleTracker;
    notebookTracker: INotebookTracker;
  }
}

const Monitor = ({
  consoleTracker,
  notebookTracker
}: Monitor.IProperties): JSX.Element => {
  const [{ enabled, cluster, monitorStarted }, setState] = React.useContext(
    Status.Context
  );
  return (
    <MonitorView
      start={{ enabled: enabled && !cluster && !monitorStarted }}
      open={{ enabled: enabled && !cluster && monitorStarted }}
      stop={{ enabled: enabled && !cluster && monitorStarted }}
      onClick={onClick(consoleTracker, notebookTracker, setState)}
    />
  );
};

const onClick =
  (
    consoleTracker: IConsoleTracker,
    notebookTracker: INotebookTracker,
    setState: React.Dispatch<React.SetStateAction<Status.IState>>
  ) =>
  (action: Monitor.ActionType) =>
  async (): Promise<void> => {
    const kernel = Utils.getKernel(consoleTracker, notebookTracker);
    MonitorManager.executeAction(kernel, action);
    Status.updateState(kernel, setState);
  };

export default Monitor;
