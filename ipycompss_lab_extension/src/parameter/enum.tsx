import { Select } from '@jupyterlab/ui-components';
import React from 'react';

import { onChange, Parameter } from './base';

export const EnumerationParameter = ({
  common: { name },
  state,
  defaultValue
}: Parameter.IProperties<number>): JSX.Element => {
  return (
    <Parameter name={name}>
      {/* <Select

        items={[]}
        itemRenderer={{}}
        onItemSelect={onChange<number, number>(
          name,
          state,
          defaultValue,
          getValue
        )} /> */}
    </Parameter>
  );
};

const getValue = (value: number) => value;
