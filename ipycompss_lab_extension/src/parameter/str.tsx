import { InputGroup } from '@jupyterlab/ui-components';
import React from 'react';

import { onChange, Parameter } from './base';

export const StringParameter = ({
  name,
  values,
  defaultValue
}: Parameter.IProperties<string>): JSX.Element => (
  <Parameter name={name} values={values}>
    <InputGroup
      defaultValue={defaultValue}
      onChange={onChange<string, React.FormEvent<HTMLInputElement>>(
        name,
        values,
        defaultValue,
        getValue
      )}
    />
  </Parameter>
);

const getValue = (event: React.FormEvent<HTMLInputElement>): string =>
  (event.target as HTMLInputElement)['value'];
