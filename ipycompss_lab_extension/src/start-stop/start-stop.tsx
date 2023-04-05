import React, { useState } from 'react';
import { INotebookTracker } from '@jupyterlab/notebook';

import { StartButton } from './start-button';
import { StopButton } from './stop-button';
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
  let state;
  [state, setState] = useState({
    enabled: false,
    started: false
  } as StartStop.IState);
  return (
    <>
      <StartButton tracker={tracker} state={state} />
      <StopButton tracker={tracker} state={state} />
    </>
  );
};
