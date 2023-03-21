import {
  Dialog,
  showDialog,
  ToolbarButtonComponent
} from '@jupyterlab/apputils';
import { INotebookTracker } from '@jupyterlab/notebook';

import React, { useState } from 'react';
import { watchNewNotebooks } from './watcher';

let enabled: number;
let setEnabled: React.Dispatch<React.SetStateAction<number>>;

export const StartButton = ({
  tracker
}: {
  tracker: INotebookTracker;
}): JSX.Element => {
  const startPycompss = async (): Promise<void> => {
    const result = await showDialog({
      title: 'IPyCOMPSs configuration',
      buttons: [Dialog.okButton({ label: 'Start IPyCOMPSs' })]
    });
    if (result.button.accept) {
      tracker.currentWidget?.sessionContext.session?.kernel?.requestExecute({
        code: `
          import pycompss.interactive as ipycompss
          
          ipycompss.start()
                  
          del ipycompss
        `,
        silent: true
      });
    }
  };

  tracker.widgetAdded.connect(watchNewNotebooks);
  [enabled, setEnabled] = useState(0);
  return (
    <ToolbarButtonComponent
      label="Start"
      enabled={Boolean(enabled)}
      onClick={startPycompss}
    />
  );
};

export const addEnabled = (amount: number): void => {
  enabled += amount;
  setEnabled(enabled);
};
