import { ToolbarButtonComponent } from '@jupyterlab/apputils';
import { tabIcon } from '@jupyterlab/ui-components';
import React from 'react';

import CollapsibleElement from '../collapsible-element';
import InfoButtons from './info-buttons';

namespace InfoButtonsView {
  export interface IButton {
    label: string;
    type: InfoButtons.InfoType;
  }

  export interface IProperties {
    enabled: boolean;
    onClick: (type: InfoButtons.InfoType) => () => Promise<void>;
  }
}

const InfoButtonsView = ({
  enabled,
  onClick
}: InfoButtonsView.IProperties): JSX.Element => {
  const buttons: InfoButtonsView.IButton[] = [
    { label: 'See tasks info', type: 'info' },
    { label: 'See tasks status', type: 'status' },
    { label: 'See current task graph', type: 'current_graph' },
    { label: 'See complete task graph', type: 'complete_graph' },
    { label: 'See resources status', type: 'resources' },
    { label: 'See statistics', type: 'statistics' }
  ];
  return (
    <CollapsibleElement label="Execution Info">
      {buttons.map(({ label, type }: InfoButtonsView.IButton) => (
        <ToolbarButtonComponent
          className="ipycompss-button"
          label={label}
          icon={tabIcon}
          enabled={enabled}
          onClick={onClick(type)}
        />
      ))}
    </CollapsibleElement>
  );
};

export default InfoButtonsView;
