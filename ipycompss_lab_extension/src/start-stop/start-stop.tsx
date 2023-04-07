import { Dialog, showDialog } from '@jupyterlab/apputils';
import { INotebookTracker } from '@jupyterlab/notebook';
import React, { useState } from 'react';

import { withNullable } from '../utils';
import { Messaging } from './messaging';
import { StartStopView } from './start-stop-view';
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
    if (!result.button.accept) {
      return;
    }

    withNullable(Messaging.sendStartRequest)(kernel, { arguments: {} }).onReply(
      ({ success }: Messaging.ISuccessResponseDto): void =>
        setState(({ enabled, started }) => ({ enabled, started: success }))
    );
  };

const shutdown = (tracker: INotebookTracker) => async (): Promise<void> => {
  const kernel = tracker.currentWidget?.sessionContext.session?.kernel;
  withNullable(Messaging.sendStopRequest)(kernel).onReply(
    ({ success }: Messaging.ISuccessResponseDto) =>
      setState(({ enabled, started }) => ({ enabled, started: !success }))
  );
};
