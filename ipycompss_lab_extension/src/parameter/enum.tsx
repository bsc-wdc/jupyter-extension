import { MenuItem } from '@blueprintjs/core';
import { Button, Select } from '@jupyterlab/ui-components';
import React from 'react';

import Parameter from './base';

namespace EnumerationParameter {
  export interface IProperties extends Parameter.IProperties<string> {
    options: string[];
  }
}

const EnumerationParameter = ({
  name,
  values,
  defaultValue,
  toSend,
  options
}: EnumerationParameter.IProperties): JSX.Element => {
  const [selectedItem, setSelectedItem] = React.useState(defaultValue);
  return (
    <Parameter name={name} values={values} defaultValue={defaultValue}>
      <Select
        filterable={false}
        items={options}
        itemRenderer={(item: string, { handleClick }): JSX.Element => (
          <MenuItem key={item} text={item} onClick={handleClick} />
        )}
        onItemSelect={item => {
          setSelectedItem(item);
          Parameter.onChange<string, string>(
            name,
            values,
            ...((toSend
              ? [defaultValue, getValueToSend]
              : [`"${defaultValue}"`, getValue]) as [
              string,
              (item: string) => string
            ])
          )(item);
        }}
        popoverProps={{ usePortal: false }}
      >
        <Button text={selectedItem} rightIcon="double-caret-vertical" />
      </Select>
    </Parameter>
  );
};

const getValue = (item: string): string => `"${getValueToSend(item)}"`;

const getValueToSend = (item: string): string => item;

export default EnumerationParameter;
