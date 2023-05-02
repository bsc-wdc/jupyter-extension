import { NumericInput } from '@blueprintjs/core';
import React from 'react';

import Parameter from './base';

const IntegerParameter = ({
  name,
  values,
  defaultValue,
  toSend
}: Parameter.IProperties<number>): JSX.Element => (
  <Parameter name={name} values={values} defaultValue={defaultValue}>
    <NumericInput
      defaultValue={defaultValue}
      onValueChange={Parameter.onChange<number, number>(
        name,
        values,
        ...((toSend
          ? [defaultValue, getValueToSend]
          : [defaultValue.toString(), getValue]) as [
          number | string,
          (value: number) => number | string
        ])
      )}
    />
  </Parameter>
);

const getValue = (value: number): string => getValueToSend(value).toString();

const getValueToSend = (value: number): number => value;

export default IntegerParameter;
