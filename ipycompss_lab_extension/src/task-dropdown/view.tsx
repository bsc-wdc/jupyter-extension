import { ToolbarButtonComponent } from '@jupyterlab/apputils';
import React from 'react';

import CollapsibleElement from '../collapsible-element';
import {
  BooleanParameter,
  EnumerationParameter,
  IntegerParameter,
  ParameterGroupWidget,
  StringParameter
} from '../parameter';

namespace TaskDropdownView {
  export interface IProperties {
    parameterWidget: ParameterGroupWidget;
    onClick: () => Promise<void>;
  }
}

const TaskDropdownView = ({
  parameterWidget,
  onClick
}: TaskDropdownView.IProperties): JSX.Element => {
  const parameters: ParameterGroupWidget.IParameter[] = [
    { name: 'returns', defaultValue: '', Parameter: StringParameter },
    { name: 'priority', defaultValue: false, Parameter: BooleanParameter },
    { name: 'is_reduce', defaultValue: true, Parameter: BooleanParameter },
    { name: 'chunk_size', defaultValue: 0, Parameter: IntegerParameter },
    { name: 'time_out', defaultValue: 0, Parameter: IntegerParameter },
    {
      name: 'on_failure',
      defaultValue: 'RETRY',
      Parameter: EnumerationParameter,
      options: ['RETRY', 'CANCEL_SUCCESSORS', 'FAIL', 'IGNORE']
    }
  ];
  parameterWidget.data = { parameters, toSend: false };
  return (
    <CollapsibleElement label="Task">
      {parameterWidget.render()}
      <ToolbarButtonComponent label="Define task" onClick={onClick} />
    </CollapsibleElement>
  );
};

export default TaskDropdownView;
