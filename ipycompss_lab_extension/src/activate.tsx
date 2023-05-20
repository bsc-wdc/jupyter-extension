import { IJupyterWidgetRegistry } from '@jupyter-widgets/base';
import {
  ILabShell,
  ILayoutRestorer,
  JupyterFrontEnd
} from '@jupyterlab/application';
import { MainAreaWidget, ReactWidget } from '@jupyterlab/apputils';
import { IConsoleTracker } from '@jupyterlab/console';
import { INotebookTracker } from '@jupyterlab/notebook';
import React from 'react';

import '../style/index.css';
import DocumentationButton from './documentation-button';
import Icon from './icon';
import InfoButtons from './info-buttons';
import Monitor from './monitor/monitor';
import StartStop from './start-stop';
import TaskDropdown from './task-dropdown';

const LEFT_PANEL_ID = 'pycompss-left-menu';

const activate = (
  app: JupyterFrontEnd,
  shell: ILabShell,
  notebookTracker: INotebookTracker,
  consoleTracker: IConsoleTracker,
  widgetRegistry: IJupyterWidgetRegistry,
  restorer?: ILayoutRestorer
): void => {
  const content = ReactWidget.create(
    <div className="ipycompss-base">
      <div className="jp-stack-panel-header">IPyCOMPSs</div>
      <div className="ipycompss-stack-panel">
        <StartStop
          consoleTracker={consoleTracker}
          notebookTracker={notebookTracker}
        />
        <Monitor
          consoleTracker={consoleTracker}
          notebookTracker={notebookTracker}
        />
        <TaskDropdown tracker={notebookTracker} />
        <DocumentationButton shell={shell} restorer={restorer} />
        <InfoButtons
          shell={shell}
          consoleTracker={consoleTracker}
          notebookTracker={notebookTracker}
          widgetRegistry={widgetRegistry}
        />
        <Icon.bsc_icon.react className="ipycompss-footer" />
      </div>
    </div>
  );
  const widget = new MainAreaWidget({ content });
  widget.id = LEFT_PANEL_ID;
  widget.title.icon = Icon.compss_icon;
  app.shell.add(widget, 'left', { rank: 510 });

  restorer?.add(widget, LEFT_PANEL_ID);
};

export default activate;
