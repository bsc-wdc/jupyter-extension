import { IJupyterWidgetRegistry } from '@jupyter-widgets/base';
import { ILayoutRestorer, JupyterFrontEnd } from '@jupyterlab/application';
import { MainAreaWidget, ReactWidget } from '@jupyterlab/apputils';
import { IConsoleTracker } from '@jupyterlab/console';
import { INotebookTracker } from '@jupyterlab/notebook';
import React from 'react';

import '../style/index.css';
import { DocumentationButton } from './documentation-button';
import { compss_icon } from './icon';
import InfoButtons from './info-buttons';
import StartStop from './start-stop';
import TaskDropdown from './task-dropdown';

const LEFT_PANEL_ID = 'pycompss-left-menu';

export const activate = (
  app: JupyterFrontEnd,
  notebookTracker: INotebookTracker,
  consoleTracker: IConsoleTracker,
  widgetRegistry: IJupyterWidgetRegistry,
  restorer?: ILayoutRestorer
): void => {
  const content = ReactWidget.create(
    <div className="ipycompss-pycompss-sidebar">
      <div className="jp-stack-panel-header">IPyCOMPSs</div>
      <div className="ipycompss-stack-panel">
        <StartStop
          consoleTracker={consoleTracker}
          notebookTracker={notebookTracker}
        />
        <TaskDropdown tracker={notebookTracker} />
        <DocumentationButton shell={app.shell} />
        <InfoButtons
          shell={app.shell}
          consoleTracker={consoleTracker}
          notebookTracker={notebookTracker}
          widgetRegistry={widgetRegistry}
        />
      </div>
    </div>
  );
  const widget = new MainAreaWidget({ content });
  widget.id = LEFT_PANEL_ID;
  widget.title.icon = compss_icon;
  app.shell.add(widget, 'left', { rank: 510 });

  restorer?.add(widget, LEFT_PANEL_ID);
};
