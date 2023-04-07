import { Checkbox } from '@jupyterlab/ui-components';
import React from 'react';

import { onChange, Parameter } from './base';

export const BooleanParameter = ({
  common: { name, values },
  defaultValue
}: Parameter.IProperties<boolean>): JSX.Element => (
  <Parameter name={name} values={values}>
    <Checkbox
      defaultChecked={defaultValue}
      onChange={onChange<string, React.FormEvent<HTMLInputElement>>(
        name,
        values,
        defaultValue.toString().capitalise(),
        getValue
      )}
    />
  </Parameter>
);

const getValue = (event: React.FormEvent<HTMLInputElement>): string =>
  (event.target as HTMLInputElement)['checked'].toString().capitalise();
