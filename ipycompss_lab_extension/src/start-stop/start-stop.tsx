import { Dialog, showDialog } from '@jupyterlab/apputils';
import React from 'react';

import Status from '../status';
import Utils from '../utils';
import StartStopManager from './manager';
import StartStopView from './view';

namespace StartStop {
  export interface IProperties {
    trackers: Utils.ITrackers;
  }
}

const StartStop = ({ trackers }: StartStop.IProperties): JSX.Element => {
  const [{ enabled, started }, setState] = React.useContext(Status.Context);
  return (
    <StartStopView
      start={{
        enabled: enabled && !started,
        onClick: showStartDialog(trackers, setState)
      }}
      stop={{
        enabled: enabled && started,
        onClick: stop(trackers, setState)
      }}
    />
  );
};

const showStartDialog =
  (
    trackers: Utils.ITrackers,
    setState: React.Dispatch<React.SetStateAction<Status.IState>>
  ) =>
  async (): Promise<void> => {
    const kernel = Utils.getKernel(trackers);
    StartStopManager.init(kernel, setState).onFailure(
      Status.updateState,
      () =>
        void showDialog({
          title: 'IPyCOMPSs configuration',
          body: StartStopView.dialogBody(),
          buttons: [Dialog.okButton({ label: 'Start IPyCOMPSs' })]
        }).then(start(trackers, setState))
    );
  };

const start =
  (
    trackers: Utils.ITrackers,
    setState: React.Dispatch<React.SetStateAction<Status.IState>>
  ) =>
  (result: Dialog.IResult<Map<string, any> | undefined>): void => {
    const kernel = Utils.getKernel(trackers);
    result.button.accept &&
      result.value &&
      StartStopManager.startPycompss(kernel, result.value, setState);
  };

const stop =
  (
    trackers: Utils.ITrackers,
    setState: React.Dispatch<React.SetStateAction<Status.IState>>
  ) =>
  async (): Promise<void> => {
    const kernel = Utils.getKernel(trackers);
    StartStopManager.stopPycompss(kernel, setState);
  };

export default StartStop;
