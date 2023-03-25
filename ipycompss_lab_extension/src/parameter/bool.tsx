import { Checkbox } from '@jupyterlab/ui-components';
import React from 'react';
import { capitalise } from '../utils';

import { onChange, Parameter } from './base';

export const BooleanParameter = ({
  common: { name },
  state,
  defaultValue
}: Parameter.IProperties<boolean>): JSX.Element => (
  <Parameter name={name}>
    <Checkbox
      defaultChecked={defaultValue}
      onChange={onChange<string, React.FormEvent<HTMLInputElement>>(
        name,
        state,
        capitalise(defaultValue.toString()),
        getValue
      )}
    />
  </Parameter>
);

const getValue = (event: React.FormEvent<HTMLInputElement>): string =>
  capitalise((event.target as HTMLInputElement)['checked'].toString());