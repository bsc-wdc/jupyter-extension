import { ToolbarButtonComponent } from '@jupyterlab/apputils';
import React from 'react';

import InfoButtons from './info-buttons';

namespace InfoButtonsView {
  export interface IButton {
    label: string;
    type: InfoButtons.InfoType;
  }

  export interface IProperties {
    onClick: (type: InfoButtons.InfoType) => () => Promise<void>;
  }
}

const InfoButtonsView = ({
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
    <>
      {buttons.map(({ label, type }: InfoButtonsView.IButton) => (
        <ToolbarButtonComponent label={label} onClick={onClick(type)} />
      ))}
    </>
  );
};

export default InfoButtonsView;
