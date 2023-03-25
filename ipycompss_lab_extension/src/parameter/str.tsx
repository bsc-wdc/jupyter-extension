import { InputGroup } from '@jupyterlab/ui-components';
import React from 'react';

import { onChange, Parameter } from './base';

export const StringParameter = ({
  common: { name },
  state,
  defaultValue
}: Parameter.IProperties<string>): JSX.Element => (
  <Parameter name={name}>
    <InputGroup
      defaultValue={defaultValue}
      onChange={onChange<string, React.FormEvent<HTMLInputElement>>(
        name,
        state,
        defaultValue,
        getValue
      )}
    />
  </Parameter>
);

const getValue = (event: React.FormEvent<HTMLInputElement>): string =>
  (event.target as HTMLInputElement)['value'];
