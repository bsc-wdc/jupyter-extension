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
    enabled: boolean;
    action: Monitor.ActionType;
  }

  export interface IProperties {
    start: boolean;
    open: boolean;
    stop: boolean;
    onClick: (type: Monitor.ActionType) => () => Promise<void>;
  }
}

const MonitorView = ({
  start,
  open,
  stop,
  onClick
}: MonitorView.IProperties): JSX.Element => {
  const buttons: MonitorView.IButton[] = [
    { label: 'Start', icon: runIcon, enabled: start, action: 'start' },
    { label: 'Open', icon: launchIcon, enabled: open, action: 'open' },
    { label: 'Stop', icon: stopIcon, enabled: stop, action: 'stop' }
  ];
  return (
    <CollapsibleElement label="Monitor">
      {buttons.map(({ label, icon, enabled, action }: MonitorView.IButton) => (
        <ToolbarButtonComponent
          className="ipycompss-button"
          icon={icon}
          label={label}
          enabled={enabled}
          onClick={onClick(action)}
        />
      ))}
    </CollapsibleElement>
  );
};

export default MonitorView;
