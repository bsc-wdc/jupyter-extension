import { JupyterFrontEnd } from '@jupyterlab/application';
import { ReactWidget } from '@jupyterlab/apputils';
import { INotebookTracker } from '@jupyterlab/notebook';
import { LabIcon } from '@jupyterlab/ui-components';
import React from 'react';

import '../style/index.css';
import compss_svg from '../resources/compss.svg';
import { StartButton } from './start-button';
import { watchNewNotebooks } from './watcher';

const compss_icon = new LabIcon({
  name: 'ipycompss_lab_extension:compss',
  svgstr: compss_svg
});

export let tracker: INotebookTracker;

export const activate = (
  app: JupyterFrontEnd,
  notebookTracker: INotebookTracker
): void => {
  tracker = notebookTracker;

  const title = 'IPyCOMPSs';
  const jsx = (
    <div className="ipycompss-pycompss-sidebar">
      <div className="jp-stack-panel-header">{title}</div>
      <StartButton />
    </div>
  );

  const widget = ReactWidget.create(jsx);
  widget.id = 'pycompss-left-menu';
  widget.title.icon = compss_icon;
  widget.addClass('ipycompss-pycompss-sidebar');

  app.shell.add(widget, 'left', { rank: 550 });

  tracker.widgetAdded.connect(watchNewNotebooks);
};
