import { ToolbarButtonComponent } from '@jupyterlab/apputils';
import React from 'react';

export namespace StartStopView {
  export interface IProperties {
    start: IButtonProperties;
    stop: IButtonProperties;
  }
  export interface IButtonProperties {
    enabled: boolean;
    onClick: () => Promise<void>;
  }
}

export const StartStopView = ({
  start,
  stop
}: StartStopView.IProperties): JSX.Element => (
  <>
    <ToolbarButtonComponent
      label="Start"
      enabled={start.enabled}
      onClick={start.onClick}
    />
    <ToolbarButtonComponent
      label="Stop"
      enabled={stop.enabled}
      onClick={stop.onClick}
    />
  </>
);
