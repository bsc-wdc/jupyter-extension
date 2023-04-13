import { Dialog, showDialog } from '@jupyterlab/apputils';
import { INotebookTracker } from '@jupyterlab/notebook';
import React, { useState } from 'react';

import { StartStopMessaging } from './messaging';
import { StartStopView, dialogBody } from './view';
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
      body: dialogBody(),
      buttons: [Dialog.okButton({ label: 'Start IPyCOMPSs' })]
    }).then(startPycompss(tracker));

const startPycompss =
  (tracker: INotebookTracker) =>
  (result: Dialog.IResult<Map<string, string | null> | undefined>): void => {
    const kernel = tracker.currentWidget?.sessionContext.session?.kernel;
    result.button.accept &&
      result.value &&
      StartStopMessaging.sendStartRequest(kernel, {
        arguments: Array.from(result.value).reduce(
          (
            object: { [key: string]: string | null },
            [key, value]: [string, string | null]
          ) => {
            object[key] = value;
            return object;
          },
          {} as { [key: string]: string | null }
        )
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
