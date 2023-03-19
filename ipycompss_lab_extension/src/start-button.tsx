import {
  Dialog,
  showDialog,
  ToolbarButtonComponent
} from '@jupyterlab/apputils';

import React, { useState } from 'react';
import { tracker } from './activate';

let enabled: number;
let setEnabled: React.Dispatch<React.SetStateAction<number>>;

export const StartButton = (): JSX.Element => {
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

const startPycompss = async (): Promise<void> => {
  const result = await showDialog({
    title: 'IPyCOMPSs configuration',
    buttons: [Dialog.okButton({ label: 'Start IPyCOMPSs' })]
    // checkbox: {
    //   label: 'Example',
    //   caption: 'Just that',
    //   className: '',
    //   checked: true
    // }
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
