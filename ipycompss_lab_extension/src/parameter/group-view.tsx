import React from 'react';

import { ParameterGroup } from './group';

export namespace ParameterGroupView {
  export interface IProperties {
    parameters: ParameterGroup.IParameter[];
    values: React.MutableRefObject<Map<string, any>>;
    toSend: boolean;
  }
}

export const ParameterGroupView = ({
  parameters,
  values,
  toSend
}: ParameterGroupView.IProperties): JSX.Element => {
  return (
    <>
      {parameters.map(
        (
          { name, defaultValue, options, Parameter }: ParameterGroup.IParameter,
          i: number
        ): JSX.Element => (
          <Parameter
            key={i}
            name={name}
            values={values}
            defaultValue={defaultValue}
            toSend={toSend}
            options={options}
          />
        )
      )}
    </>
  );
};
