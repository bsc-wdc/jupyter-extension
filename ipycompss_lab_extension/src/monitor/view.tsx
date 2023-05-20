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
    action: Monitor.ActionType;
  }

  export interface IProperties {
    onClick: (type: Monitor.ActionType) => () => Promise<void>;
  }
}

const MonitorView = ({ onClick }: MonitorView.IProperties): JSX.Element => {
  const buttons: MonitorView.IButton[] = [
    { label: 'Start', icon: runIcon, action: 'start' },
    { label: 'Open', icon: launchIcon, action: 'open' },
    { label: 'Stop', icon: stopIcon, action: 'stop' }
  ];
  return (
    <CollapsibleElement label="Monitor">
      {buttons.map(({ label, icon, action }: MonitorView.IButton) => (
        <ToolbarButtonComponent
          className="ipycompss-button"
          icon={icon}
          label={label}
          onClick={onClick(action)}
        />
      ))}
    </CollapsibleElement>
  );
};

export default MonitorView;
