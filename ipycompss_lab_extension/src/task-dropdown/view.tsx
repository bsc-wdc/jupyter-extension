import { Dialog, ToolbarButtonComponent } from '@jupyterlab/apputils';
import React from 'react';

import CollapsibleElement from '../collapsible-element';
import {
  BooleanParameter,
  EnumerationParameter,
  IntegerParameter,
  ParameterGroupWidget,
  StringParameter
} from '../parameter';

function TaskDropdownView({
  parameterWidget,
  onClick
}: TaskDropdownView.IProperties): JSX.Element {
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
}

namespace TaskDropdownView {
  export interface IProperties {
    parameterWidget: ParameterGroupWidget;
    onClick: () => Promise<void>;
  }

  export const dialogBody = (
    functionParameters: string[] | undefined
  ): Dialog.IBodyWidget<Map<string, any> | undefined> => {
    const parameters: ParameterGroupWidget.IParameter[] =
      functionParameters?.map(
        (parameter: string): ParameterGroupWidget.IParameter => ({
          name: parameter,
          defaultValue: 'IN',
          Parameter: EnumerationParameter,
          options: [
            'IN',
            'IN_DELETE',
            'INOUT',
            'OUT',
            'CONCURRENT',
            'COMMUTATIVE',
            'FILE_IN',
            'FILE_INOUT',
            'FILE_OUT',
            'FILE_CONCURRENT',
            'FILE_COMMUTATIVE',
            'DIRECTORY_IN',
            'DIRECTORY_INOUT',
            'DIRECTORY_OUT',
            'COLLECTION_IN',
            'COLLECTION_IN_DELETE',
            'COLLECTION_INOUT',
            'COLLECTION_OUT',
            'COLLECTION_FILE_IN',
            'COLLECTION_FILE_INOUT',
            'COLLECTION_FILE_OUT',
            'DICTIONARY_IN',
            'DICTIONARY_IN_DELETE',
            'DICTIONARY_INOUT',
            'STREAM_IN',
            'STREAM_OUT',
            'STDIN',
            'STDOUT',
            'STDERR'
          ]
        })
      ) || [];
    const widget = new ParameterGroupWidget();
    widget.data = { parameters, toSend: true };
    widget.addClass('ipycompss-popup');
    return widget;
  };
}

export default TaskDropdownView;
