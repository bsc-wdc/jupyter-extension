import { JupyterFrontEnd } from '@jupyterlab/application';

import {
  Dialog,
  ReactWidget,
  showDialog,
  ToolbarButtonComponent
} from '@jupyterlab/apputils';

import { IChangedArgs } from '@jupyterlab/coreutils';

import { INotebookTracker, NotebookPanel } from '@jupyterlab/notebook';

import { Kernel } from '@jupyterlab/services';
import { LabIcon } from '@jupyterlab/ui-components';
import React, { useState } from 'react';

import '../style/index.css';
import compss_svg from '../resources/compss.svg';
import { ICommOpenMsg } from '@jupyterlab/services/lib/kernel/messages';

const compss_icon = new LabIcon({
  name: 'ipycompss_lab_extension:compss',
  svgstr: compss_svg
});

let tracker: INotebookTracker;
let setEnabled: React.Dispatch<React.SetStateAction<number>>;

export const activate = (
  app: JupyterFrontEnd,
  notebookTracker: INotebookTracker
): void => {
  tracker = notebookTracker;

  const title = 'IPyCOMPSs';
  const jsx = (
    <div className="ipycompss-pycompss-sidebar">
      <div className="jp-stack-panel-header">{title}</div>
      <Button />
    </div>
  );

  const widget = ReactWidget.create(jsx);
  widget.id = 'pycompss-left-menu';
  widget.title.icon = compss_icon;
  widget.addClass('ipycompss-pycompss-sidebar');

  app.shell.add(widget, 'left', { rank: 550 });

  tracker.widgetAdded.connect(watchNewNotebooks);
};

const Button = () => {
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

const watchNewNotebooks = ({ }, notebook: NotebookPanel) => {
  notebook.context.sessionContext.kernelChanged.connect(watchKernelChanges);
};

const watchKernelChanges = (
  { },
  change: IChangedArgs<
    Kernel.IKernelConnection | null,
    Kernel.IKernelConnection | null
  >
) => {
  change.newValue?.registerCommTarget('ipycompss_init_target', setStartState);
};

const setStartState = ({ }, msg: ICommOpenMsg) => {
  setEnabled(Number(Boolean(msg.content.data.cluster)));
};
