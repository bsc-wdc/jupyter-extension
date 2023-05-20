import { Dialog, ToolbarButtonComponent } from '@jupyterlab/apputils';
import React from 'react';

import CollapsibleElement from '../collapsible-element';
import Parameter from '../parameter';
import { editIcon } from '@jupyterlab/ui-components';

function TaskDropdownView({
  parameterWidget,
  onClick
}: TaskDropdownView.IProperties): JSX.Element {
  const parameters: Parameter.ParameterGroupWidget.IParameter[] = [
    { name: 'returns', defaultValue: '', Parameter: Parameter.StringParameter }
  ];
  const advancedParameters: Parameter.ParameterGroupWidget.IParameter[] = [
    {
      name: 'priority',
      defaultValue: false,
      Parameter: Parameter.BooleanParameter
    },
    {
      name: 'is_reduce',
      defaultValue: true,
      Parameter: Parameter.BooleanParameter
    },
    {
      name: 'chunk_size',
      defaultValue: 0,
      Parameter: Parameter.IntegerParameter
    },
    {
      name: 'time_out',
      defaultValue: 0,
      Parameter: Parameter.IntegerParameter
    },
    {
      name: 'on_failure',
      defaultValue: TaskDropdownView.OnFailure.RETRY,
      Parameter: Parameter.EnumerationParameter,
      options: TaskDropdownView.OnFailure
    }
  ];
  parameterWidget.data = { parameters, advancedParameters, toSend: false };
  return (
    <CollapsibleElement label="Task">
      {parameterWidget.render()}
      <ToolbarButtonComponent
        className="ipycompss-button"
        label="Define task"
        icon={editIcon}
        onClick={onClick}
      />
    </CollapsibleElement>
  );
}

namespace TaskDropdownView {
  export interface IProperties {
    parameterWidget: Parameter.ParameterGroupWidget;
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
    const parameters: Parameter.ParameterGroupWidget.IParameter[] =
      functionParameters?.map(
        (parameter: string): Parameter.ParameterGroupWidget.IParameter => ({
          name: parameter,
          defaultValue: ParameterDirection.IN,
          Parameter: Parameter.EnumerationParameter,
          options: ParameterDirection
        })
      ) || [];
    const widget = new Parameter.ParameterGroupWidget();
    widget.data = { parameters, toSend: true };
    return widget;
  };
}

export default TaskDropdownView;
