import { Dialog, showDialog } from '@jupyterlab/apputils';
import { INotebookTracker } from '@jupyterlab/notebook';
import React, { useState } from 'react';

import { StartStopMessaging } from './messaging';
import { StartStopView } from './view';
import { watchNotebookChanges } from './watcher';

export namespace StartStop {
  export interface IState {
    enabled: boolean;
    started: boolean;
  }

  export interface IProperties {
    tracker: INotebookTracker;
  }
}

export let setState: (
  callbackValue:
    | StartStop.IState
    | (({ enabled, started }: StartStop.IState) => StartStop.IState)
) => void;

export const StartStop = ({ tracker }: StartStop.IProperties): JSX.Element => {
  tracker.currentChanged.connect(watchNotebookChanges);
  let enabled, started;
  [{ enabled, started }, setState] = useState({
    enabled: false,
    started: false
  } as StartStop.IState);
  return (
    <StartStopView
      start={{
        enabled: enabled && !started,
        onClick: showStartDialog(tracker)
      }}
      stop={{ enabled: enabled && started, onClick: shutdown(tracker) }}
    />
  );
};

const showStartDialog =
  (tracker: INotebookTracker) => async (): Promise<void> =>
    void showDialog({
      title: 'IPyCOMPSs configuration',
      buttons: [Dialog.okButton({ label: 'Start IPyCOMPSs' })]
    }).then(startPycompss(tracker));

const startPycompss =
  (tracker: INotebookTracker) =>
  (result: Dialog.IResult<unknown>): void => {
    const kernel = tracker.currentWidget?.sessionContext.session?.kernel;
    result.button.accept &&
      StartStopMessaging.sendStartRequest(kernel, {
        arguments: {}
      }).onReply(({ success }: StartStopMessaging.ISuccessResponseDto): void =>
        setState(({ enabled }) => ({ enabled, started: success }))
      );
  };

const shutdown = (tracker: INotebookTracker) => async (): Promise<void> => {
  const kernel = tracker.currentWidget?.sessionContext.session?.kernel;
  StartStopMessaging.sendStopRequest(kernel).onReply(
    ({ success }: StartStopMessaging.ISuccessResponseDto) =>
      setState(({ enabled }) => ({ enabled, started: !success }))
  );
};
