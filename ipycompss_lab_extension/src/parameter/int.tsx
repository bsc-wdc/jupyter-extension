import { NumericInput } from '@blueprintjs/core';
import React from 'react';

import { onChange, Parameter } from './base';

export const IntegerParameter = ({
  common: { name },
  state,
  defaultValue
}: Parameter.IProperties<number>): JSX.Element => (
  <Parameter name={name}>
    <NumericInput
      defaultValue={defaultValue}
      onValueChange={onChange<number, number>(
        name,
        state,
        defaultValue,
        getValue
      )}
    />
  </Parameter>
);

const getValue = (value: number) => value;
