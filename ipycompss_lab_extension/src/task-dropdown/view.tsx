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
      defaultValue: TaskDropdownView.OnFailure.RETRY,
      Parameter: EnumerationParameter,
      options: TaskDropdownView.OnFailure
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

  export enum OnFailure {
    RETRY = 'RETRY',
    CANCEL_SUCCESSORS = 'CANCEL_SUCCESSORS',
    FAIL = 'FAIL',
    IGNORE = 'IGNORE'
  }

  enum ParameterDirection {
    IN = 'IN',
    IN_DELETE = 'IN_DELETE',
    INOUT = 'INOUT',
    OUT = 'OUT',
    CONCURRENT = 'CONCURRENT',
    COMMUTATIVE = 'COMMUTATIVE',
    FILE_IN = 'FILE_IN',
    FILE_INOUT = 'FILE_INOUT',
    FILE_OUT = 'FILE_OUT',
    FILE_CONCURRENT = 'FILE_CONCURRENT',
    FILE_COMMUTATIVE = 'FILE_COMMUTATIVE',
    DIRECTORY_IN = 'DIRECTORY_IN',
    DIRECTORY_INOUT = 'DIRECTORY_INOUT',
    DIRECTORY_OUT = 'DIRECTORY_OUT',
    COLLECTION_IN = 'COLLECTION_IN',
    COLLECTION_IN_DELETE = 'COLLECTION_IN_DELETE',
    COLLECTION_INOUT = 'COLLECTION_INOUT',
    COLLECTION_OUT = 'COLLECTION_OUT',
    COLLECTION_FILE_IN = 'COLLECTION_FILE_IN',
    COLLECTION_FILE_INOUT = 'COLLECTION_FILE_INOUT',
    COLLECTION_FILE_OUT = 'COLLECTION_FILE_OUT',
    DICTIONARY_IN = 'DICTIONARY_IN',
    DICTIONARY_IN_DELETE = 'DICTIONARY_IN_DELETE',
    DICTIONARY_INOUT = 'DICTIONARY_INOUT',
    STREAM_IN = 'STREAM_IN',
    STREAM_OUT = 'STREAM_OUT',
    STDIN = 'STDIN',
    STDOUT = 'STDOUT',
    STDERR = 'STDERR'
  }

  export const dialogBody = (
    functionParameters: string[] | undefined
  ): Dialog.IBodyWidget<Map<string, any> | undefined> => {
    const parameters: ParameterGroupWidget.IParameter[] =
      functionParameters?.map(
        (parameter: string): ParameterGroupWidget.IParameter => ({
          name: parameter,
          defaultValue: ParameterDirection.IN,
          Parameter: EnumerationParameter,
          options: ParameterDirection
        })
      ) || [];
    const widget = new ParameterGroupWidget();
    widget.data = { parameters, toSend: true };
    widget.addClass('ipycompss-popup');
    return widget;
  };
}

export default TaskDropdownView;
