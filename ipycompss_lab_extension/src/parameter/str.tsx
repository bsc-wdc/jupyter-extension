import { InputGroup } from '@jupyterlab/ui-components';
import React from 'react';

import Parameter from './base';

const StringParameter = ({
  name,
  values,
  defaultValue
}: Parameter.IProperties<string>): JSX.Element => (
  <Parameter name={name} values={values} defaultValue={defaultValue}>
    <InputGroup
      defaultValue={defaultValue}
      onChange={Parameter.onChange<string, React.FormEvent<HTMLInputElement>>(
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

export default StringParameter;
