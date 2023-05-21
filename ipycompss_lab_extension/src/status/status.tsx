import { IConsoleTracker } from '@jupyterlab/console';
import { INotebookTracker } from '@jupyterlab/notebook';
import { Kernel } from '@jupyterlab/services';

import React, { ReactNode } from 'react';
import StatusManager from './manager';

const defaultState = {
  enabled: false,
  cluster: false,
  started: false,
  monitorStarted: false
};

function Status({
  consoleTracker,
  notebookTracker,
  children
}: Status.IProperties): JSX.Element {
  const [state, setState] = React.useState(defaultState);
  React.useEffect(
    registerCallback(consoleTracker, notebookTracker, setState),
    []
  );
  return (
    <Status.Context.Provider value={[state, setState]}>
      {children}
    </Status.Context.Provider>
  );
}

const registerCallback =
  (
    consoleTracker: IConsoleTracker,
    notebookTracker: INotebookTracker,
    setState: React.Dispatch<React.SetStateAction<Status.IState>>
  ) =>
  (): void => {
    [consoleTracker, notebookTracker].map(
      (tracker: IConsoleTracker | INotebookTracker) =>
        tracker.currentChanged.connect(
          StatusManager.watchCurrentChanges(setState)
        )
    );
  };

namespace Status {
  export interface IState {
    enabled: boolean;
    cluster: boolean;
    started: boolean;
    monitorStarted: boolean;
  }

  export interface IProperties {
    consoleTracker: IConsoleTracker;
    notebookTracker: INotebookTracker;
    children: ReactNode;
  }

  export const Context: React.Context<
    [IState, React.Dispatch<React.SetStateAction<IState>>]
  > = React.createContext([
    defaultState,
    _ => {
      return;
    }
  ]);

  export const updateState = (
    kernel: Kernel.IKernelConnection | null | undefined,
    setState: React.Dispatch<React.SetStateAction<Status.IState>>
  ): void => {
    StatusManager.updateState(kernel, setState);
  };
}

export default Status;
