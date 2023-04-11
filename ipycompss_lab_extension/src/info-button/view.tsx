import { ToolbarButtonComponent } from '@jupyterlab/apputils';
import React from 'react';

export namespace InfoButtonView {
  export interface IProperties {
    onClick: () => Promise<void>;
  }
}

export const InfoButtonView = ({
  onClick
}: InfoButtonView.IProperties): JSX.Element => (
  <ToolbarButtonComponent label="Open Info panel" onClick={onClick} />
);
