import { NumericInput } from '@blueprintjs/core';
import React from 'react';

import { onChange, Parameter } from './base';

export const IntegerParameter = ({
  common: { name, values },
  defaultValue
}: Parameter.IProperties<number>): JSX.Element => (
  <Parameter name={name} values={values}>
    <NumericInput
      defaultValue={defaultValue}
      onValueChange={onChange<number, number>(
        name,
        values,
        defaultValue,
        getValue
      )}
    />
  </Parameter>
);

const getValue = (value: number): string => value.toString();
