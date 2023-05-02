import { Checkbox } from '@jupyterlab/ui-components';
import React from 'react';

import Utils from '../utils';
import Parameter from './base';

const BooleanParameter = ({
  name,
  values,
  defaultValue,
  toSend
}: Parameter.IProperties<boolean>): JSX.Element => (
  <Parameter name={name} values={values} defaultValue={defaultValue}>
    <Checkbox
      defaultChecked={defaultValue}
      onChange={Parameter.onChange<boolean, React.FormEvent<HTMLInputElement>>(
        name,
        values,
        ...((toSend
          ? [defaultValue, getValueToSend]
          : [Utils.capitalise(defaultValue.toString()), getValue]) as [
          boolean | string,
          (event: React.FormEvent<HTMLInputElement>) => boolean | string
        ])
      )}
    />
  </Parameter>
);

const getValue = (event: React.FormEvent<HTMLInputElement>): string =>
  Utils.capitalise(getValueToSend(event).toString());

const getValueToSend = (event: React.FormEvent<HTMLInputElement>): boolean =>
  (event.target as HTMLInputElement)['checked'];

export default BooleanParameter;
