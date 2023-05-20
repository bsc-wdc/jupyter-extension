import { ToolbarButtonComponent } from '@jupyterlab/apputils';
import {
  LabIcon,
  launchIcon,
  runIcon,
  stopIcon
} from '@jupyterlab/ui-components';
import React from 'react';

import CollapsibleElement from '../collapsible-element';
import Monitor from './monitor';

namespace MonitorView {
  export interface IButton {
    label: string;
    icon: LabIcon;
    state: IEnabled;
    action: Monitor.ActionType;
  }

  export interface IProperties {
    start: IEnabled;
    open: IEnabled;
    stop: IEnabled;
    onClick: (type: Monitor.ActionType) => () => Promise<void>;
  }

  export interface IEnabled {
    enabled: boolean;
  }
}

const MonitorView = ({
  start,
  open,
  stop,
  onClick
}: MonitorView.IProperties): JSX.Element => {
  const buttons: MonitorView.IButton[] = [
    { label: 'Start', icon: runIcon, state: start, action: 'start' },
    { label: 'Open', icon: launchIcon, state: open, action: 'open' },
    { label: 'Stop', icon: stopIcon, state: stop, action: 'stop' }
  ];
  return (
    <CollapsibleElement label="Monitor">
      {buttons.map(({ label, icon, state, action }: MonitorView.IButton) => (
        <ToolbarButtonComponent
          className="ipycompss-button"
          icon={icon}
          label={label}
          enabled={state.enabled}
          onClick={onClick(action)}
        />
      ))}
    </CollapsibleElement>
  );
};

export default MonitorView;
