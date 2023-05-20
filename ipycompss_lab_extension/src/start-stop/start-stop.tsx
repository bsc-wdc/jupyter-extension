import { Dialog, showDialog } from '@jupyterlab/apputils';
import { IConsoleTracker } from '@jupyterlab/console';
import { INotebookTracker } from '@jupyterlab/notebook';
import React from 'react';

import StatusManager from '../status';
import Utils from '../utils';
import StartStopManager from './manager';
import StartStopView from './view';
import Status from '../status';

namespace StartStop {
  export interface IProperties {
    consoleTracker: IConsoleTracker;
    notebookTracker: INotebookTracker;
  }
}

const StartStop = ({
  consoleTracker,
  notebookTracker
}: StartStop.IProperties): JSX.Element => {
  const [{ enabled, started }, setState] = React.useContext(Status.Context);
  return (
    <StartStopView
      start={{
        enabled: enabled && !started,
        onClick: showStartDialog(consoleTracker, notebookTracker, setState)
      }}
      stop={{
        enabled: enabled && started,
        onClick: stop(consoleTracker, notebookTracker, setState)
      }}
    />
  );
};

const showStartDialog =
  (
    consoleTracker: IConsoleTracker,
    notebookTracker: INotebookTracker,
    setState: React.Dispatch<React.SetStateAction<StatusManager.IState>>
  ) =>
  async (): Promise<void> => {
    const kernel = Utils.getKernel(consoleTracker, notebookTracker);
    StartStopManager.init(kernel, setState).onFailure(
      () =>
        void showDialog({
          title: 'IPyCOMPSs configuration',
          body: StartStopView.dialogBody(),
          buttons: [Dialog.okButton({ label: 'Start IPyCOMPSs' })]
        }).then(start(consoleTracker, notebookTracker, setState))
    );
  };

const start =
  (
    consoleTracker: IConsoleTracker,
    notebookTracker: INotebookTracker,
    setState: React.Dispatch<React.SetStateAction<StatusManager.IState>>
  ) =>
  (result: Dialog.IResult<Map<string, any> | undefined>): void => {
    const kernel = Utils.getKernel(consoleTracker, notebookTracker);
    result.button.accept &&
      result.value &&
      StartStopManager.startPycompss(kernel, result.value, setState);
  };

const stop =
  (
    consoleTracker: IConsoleTracker,
    notebookTracker: INotebookTracker,
    setState: React.Dispatch<React.SetStateAction<StatusManager.IState>>
  ) =>
  async (): Promise<void> => {
    const kernel = Utils.getKernel(consoleTracker, notebookTracker);
    StartStopManager.stopPycompss(kernel, setState);
  };

export default StartStop;
