import { ILayoutRestorer, JupyterFrontEnd } from '@jupyterlab/application';
import { MainAreaWidget, ReactWidget } from '@jupyterlab/apputils';
import { INotebookTracker } from '@jupyterlab/notebook';
import { LabIcon } from '@jupyterlab/ui-components';
import React from 'react';

import '../style/index.css';
import compss_svg from '../resources/compss.svg';
import { StartButton } from './start-button/start-button';
import { TaskDropdown } from './task-dropdown/task-dropdown';
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
      <div className="ipycompss-stack-panel">
        <StartButton tracker={tracker} />
        <TaskDropdown tracker={tracker} />
        <TabButton shell={app.shell} />
      </div>
    </div>
  );

  const content = ReactWidget.create(jsx);
  const widget = new MainAreaWidget({ content });
  widget.id = 'pycompss-left-menu';
  widget.title.icon = compss_icon;
  app.shell.add(widget, 'left', { rank: 525 });

  restorer?.add(widget, 'pycompss-left-menu');
};
