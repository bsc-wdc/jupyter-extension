import { IJupyterWidgetRegistry } from '@jupyter-widgets/base';
import { JupyterFrontEnd } from '@jupyterlab/application';
import { IConsoleTracker } from '@jupyterlab/console';
import { INotebookTracker } from '@jupyterlab/notebook';
import { toArray } from '@lumino/algorithm';
import { Widget } from '@lumino/widgets';
import React from 'react';

import { getExecutionInfo } from './execution-info';
import { InfoButtonsView } from './view';
import { Model } from './widget-model';
import { View } from './widget-view';
import { INFO_ID } from './widget-view';

export namespace InfoButtons {
  export interface IProperties {
    shell: JupyterFrontEnd.IShell;
    consoleTracker: IConsoleTracker;
    notebookTracker: INotebookTracker;
    widgetRegistry: IJupyterWidgetRegistry;
  }

  export type InfoType =
    | 'info'
    | 'status'
    | 'current_graph'
    | 'complete_graph'
    | 'resources'
    | 'statistics';
}

export const InfoButtons = ({
  shell,
  consoleTracker,
  notebookTracker,
  widgetRegistry
}: InfoButtons.IProperties): JSX.Element => {
  widgetRegistry.registerWidget({
    name: 'ipycompss_lab_extension',
    version: '0.1.0',
    exports: { Model, View: View(shell) }
  });
  return (
    <InfoButtonsView
      onClick={openExecutionInfo(shell, consoleTracker, notebookTracker)}
    />
  );
};

const openExecutionInfo =
  (
    shell: JupyterFrontEnd.IShell,
    consoleTracker: IConsoleTracker,
    notebookTracker: INotebookTracker
  ) =>
  (type: InfoButtons.InfoType) =>
  async (): Promise<void> => {
    if (
      toArray(shell.widgets('main')).some(
        (elem: Widget) => elem.id === INFO_ID + type
      )
    ) {
      return;
    }

    getExecutionInfo(consoleTracker, notebookTracker, type);
  };
