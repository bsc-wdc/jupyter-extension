import { ToolbarButtonComponent } from '@jupyterlab/apputils';
import React from 'react';

import CollapsibleElement from '../collapsible-element';
import Monitor from './monitor';

namespace MonitorView {
  export interface IButton {
    label: string;
    action: Monitor.ActionType;
  }

  export interface IProperties {
    onClick: (type: Monitor.ActionType) => () => Promise<void>;
  }
}

const MonitorView = ({ onClick }: MonitorView.IProperties): JSX.Element => {
  const buttons: MonitorView.IButton[] = [
    { label: 'Start', action: 'start' },
    { label: 'Open', action: 'open' },
    { label: 'Stop', action: 'stop' }
  ];
  return (
    <CollapsibleElement label="Monitor">
      {buttons.map(({ label, action }: MonitorView.IButton) => (
        <ToolbarButtonComponent label={label} onClick={onClick(action)} />
      ))}
    </CollapsibleElement>
  );
};

export default MonitorView;
