import { ToolbarButtonComponent } from '@jupyterlab/apputils';
import React from 'react';

import { CollapsibleElement } from '../collapsible-element';
import {
  BooleanParameter,
  EnumerationParameter,
  IntegerParameter,
  StringParameter
} from '../parameter';
import { ParameterGroup, ParameterGroupWidget } from '../parameter/group';

export namespace TaskDropdownView {
  export interface IProperties {
    parameters: ParameterGroupWidget;
    onClick: () => Promise<void>;
  }
}

export const TaskDropdownView = ({
  parameters,
  onClick
}: TaskDropdownView.IProperties): JSX.Element => {
  const parametersData: ParameterGroup.IParameter[] = [
    { name: 'returns', defaultValue: '', Parameter: StringParameter },
    { name: 'priority', defaultValue: false, Parameter: BooleanParameter },
    { name: 'is_reduce', defaultValue: true, Parameter: BooleanParameter },
    { name: 'chunk_size', defaultValue: 0, Parameter: IntegerParameter },
    { name: 'time_out', defaultValue: 0, Parameter: IntegerParameter },
    {
      name: 'on_failure',
      defaultValue: '"RETRY"',
      Parameter: EnumerationParameter,
      options: ['RETRY', 'CANCEL_SUCCESSORS', 'FAIL', 'IGNORE']
    }
  ];
  parameters.data = parametersData;
  parameters.toSend = false;
  return (
    <CollapsibleElement label="Task">
      {parameters.render()}
      <ToolbarButtonComponent label="Define task" onClick={onClick} />
    </CollapsibleElement>
  );
};
