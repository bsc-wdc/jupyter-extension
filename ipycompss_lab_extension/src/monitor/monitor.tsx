import { IConsoleTracker } from '@jupyterlab/console';
import { INotebookTracker } from '@jupyterlab/notebook';
import React from 'react';

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
  return <MonitorView onClick={onClick(consoleTracker, notebookTracker)} />;
};

const onClick =
  (consoleTracker: IConsoleTracker, notebookTracker: INotebookTracker) =>
  (action: Monitor.ActionType) =>
  async (): Promise<void> => {
    const kernel = Utils.getKernel(consoleTracker, notebookTracker);
    MonitorManager.executeAction(kernel, action);
  };

export default Monitor;
