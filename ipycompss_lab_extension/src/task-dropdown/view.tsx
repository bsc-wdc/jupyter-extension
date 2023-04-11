import { ToolbarButtonComponent } from '@jupyterlab/apputils';
import React from 'react';

import { CollapsibleElement } from '../collapsible-element';
import {
  BooleanParameter,
  EnumerationParameter,
  IntegerParameter,
  StringParameter
} from '../parameter';

export namespace TaskDropdownView {
  export interface IProperties {
    values: React.MutableRefObject<Map<string, string | null>>;
    onClick: () => Promise<void>;
  }
}

export const TaskDropdownView = ({
  values,
  onClick
}: TaskDropdownView.IProperties): JSX.Element => {
  const parameters: any[] = [
    <StringParameter
      key={0}
      common={{ name: 'returns', values }}
      defaultValue=""
    />,
    <BooleanParameter
      key={1}
      common={{ name: 'priority', values }}
      defaultValue={false}
    />,
    <BooleanParameter
      key={2}
      common={{ name: 'is_reduce', values }}
      defaultValue={true}
    />,
    <IntegerParameter
      key={3}
      common={{ name: 'chunk_size', values }}
      defaultValue={0}
    />,
    <IntegerParameter
      key={4}
      common={{ name: 'time_out', values }}
      defaultValue={0}
    />,
    <EnumerationParameter
      key={5}
      properties={{
        common: { name: 'on_failure', values },
        defaultValue: '"RETRY"'
      }}
      options={['"RETRY"', '"CANCEL_SUCCESSORS"', '"FAIL"', '"IGNORE"']}
    />
  ];
  return (
    <>
      <CollapsibleElement label="Task">
        {parameters}
        <ToolbarButtonComponent label="Define task" onClick={onClick} />
      </CollapsibleElement>
    </>
  );
};
