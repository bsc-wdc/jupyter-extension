import { IJupyterWidgetRegistry } from '@jupyter-widgets/base';
import { ILabShell } from '@jupyterlab/application';
import { toArray } from '@lumino/algorithm';
import { Widget } from '@lumino/widgets';
import React, { useContext } from 'react';

import Status from '../status';
import Utils from '../utils';
import ExecutionInfo from './execution-info';
import InfoButtonsView from './view';
import WidgetModel from './widget-model';
import WidgetView from './widget-view';

namespace InfoButtons {
  export interface IProperties {
    shell: ILabShell;
    trackers: Utils.ITrackers;
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
  trackers,
  widgetRegistry
}: InfoButtons.IProperties): JSX.Element => {
  widgetRegistry.registerWidget({
    name: 'ipycompss_lab_extension',
    version: '1.0.0',
    exports: { WidgetModel, WidgetView: WidgetView(shell) }
  });
  const [{ enabled }] = useContext(Status.Context);
  return (
    <InfoButtonsView
      enabled={enabled}
      onClick={openExecutionInfo(shell, trackers)}
    />
  );
};

const openExecutionInfo =
  (shell: ILabShell, trackers: Utils.ITrackers) =>
  (type: InfoButtons.InfoType) =>
  async (): Promise<void> => {
    if (
      toArray(shell.widgets('main')).some(
        (elem: Widget) => elem.id === WidgetView.INFO_ID + type
      )
    ) {
      return;
    }

    const kernel = Utils.getKernel(trackers);
    ExecutionInfo.getExecutionInfo(kernel, type);
  };

export default InfoButtons;
