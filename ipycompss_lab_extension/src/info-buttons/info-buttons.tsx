import { IJupyterWidgetRegistry } from '@jupyter-widgets/base';
import { ILabShell } from '@jupyterlab/application';
import { IConsoleTracker } from '@jupyterlab/console';
import { INotebookTracker } from '@jupyterlab/notebook';
import { toArray } from '@lumino/algorithm';
import { Widget } from '@lumino/widgets';
import React, { useContext } from 'react';

import Utils from '../utils';
import ExecutionInfo from './execution-info';
import InfoButtonsView from './view';
import WidgetModel from './widget-model';
import WidgetView from './widget-view';
import Status from '../status';

namespace InfoButtons {
  export interface IProperties {
    shell: ILabShell;
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

const InfoButtons = ({
  shell,
  consoleTracker,
  notebookTracker,
  widgetRegistry
}: InfoButtons.IProperties): JSX.Element => {
  widgetRegistry.registerWidget({
    name: 'ipycompss_lab_extension',
    version: '0.1.0',
    exports: { WidgetModel, WidgetView: WidgetView(shell) }
  });
  const [{ enabled }] = useContext(Status.Context);
  return (
    <InfoButtonsView
      enabled={enabled}
      onClick={openExecutionInfo(shell, consoleTracker, notebookTracker)}
    />
  );
};

const openExecutionInfo =
  (
    shell: ILabShell,
    consoleTracker: IConsoleTracker,
    notebookTracker: INotebookTracker
  ) =>
  (type: InfoButtons.InfoType) =>
  async (): Promise<void> => {
    if (
      toArray(shell.widgets('main')).some(
        (elem: Widget) => elem.id === WidgetView.INFO_ID + type
      )
    ) {
      return;
    }

    const kernel = Utils.getKernel(consoleTracker, notebookTracker);
    ExecutionInfo.getExecutionInfo(kernel, type);
  };

export default InfoButtons;
