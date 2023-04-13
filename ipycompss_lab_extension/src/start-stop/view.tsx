import { Dialog, ToolbarButtonComponent } from '@jupyterlab/apputils';
import React from 'react';
import { ParameterGroup, ParameterGroupWidget } from '../parameter/group';
import { BooleanParameter, IntegerParameter } from '../parameter';

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

export const dialogBody = (): Dialog.IBodyWidget<
  Map<string, string | null> | undefined
> => {
  const parametersData: ParameterGroup.IParameter[] = [
    { name: 'graph', defaultValue: false, Parameter: BooleanParameter },
    { name: 'debug', defaultValue: false, Parameter: BooleanParameter },
    { name: 'trace', defaultValue: false, Parameter: BooleanParameter },
    { name: 'monitor', defaultValue: 1000, Parameter: IntegerParameter }
  ];
  const parameters = new ParameterGroupWidget();
  parameters.data = parametersData;
  parameters.toSend = true;
  return parameters;
};
