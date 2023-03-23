import { ILayoutRestorer, JupyterFrontEnd } from '@jupyterlab/application';
import { ReactWidget } from '@jupyterlab/apputils';
import { INotebookTracker } from '@jupyterlab/notebook';
import { LabIcon } from '@jupyterlab/ui-components';
import React from 'react';

import '../style/index.css';
import compss_svg from '../resources/compss.svg';
import { StartButton } from './start-button/start-button';
import { TaskButton } from './task-button/task-button';
import { TabButton } from './tab-button';

const compss_icon = new LabIcon({
  name: 'ipycompss_lab_extension:compss',
  svgstr: compss_svg
});

export const activate = (
  app: JupyterFrontEnd,
  tracker: INotebookTracker,
  restorer?: ILayoutRestorer
): void => {
  const title = 'IPyCOMPSs';
  const jsx = (
    <div className="ipycompss-pycompss-sidebar">
      <div className="jp-stack-panel-header">{title}</div>
      <StartButton tracker={tracker} />
      <TaskButton tracker={tracker} />
      <TabButton shell={app.shell} />
    </div>
  );

  const widget = ReactWidget.create(jsx);
  widget.id = 'pycompss-left-menu';
  widget.title.icon = compss_icon;
  widget.addClass('ipycompss-pycompss-sidebar');
  app.shell.add(widget, 'left', { rank: 525 });

  if (restorer !== undefined) {
    restorer.add(widget, 'pycompss-left-menu');
  }
};
