import {
  Dialog,
  showDialog,
  ToolbarButtonComponent
} from '@jupyterlab/apputils';

import React, { useState } from 'react';
import { tracker } from './activate';

export let setEnabled: React.Dispatch<React.SetStateAction<number>>;

export const StartButton = () => {
  let enabled: number;
  [enabled, setEnabled] = useState(0);
  return (
    <ToolbarButtonComponent
      label="Start"
      enabled={Boolean(enabled)}
      onClick={startPycompss}
    />
  );
};

const startPycompss = async () => {
  const result = await showDialog({
    title: 'IPyCOMPSs configuration',
    buttons: [Dialog.okButton({ label: 'Start IPyCOMPSs' })],
    checkbox: {
      label: 'Example',
      caption: 'Just that',
      className: '',
      checked: true
    }
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
