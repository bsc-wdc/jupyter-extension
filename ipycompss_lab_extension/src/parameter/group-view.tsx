import React from 'react';

import CollapsibleElement from '../collapsible-element';
import ParameterGroupWidget from './group';

namespace ParameterGroupView {
  export interface IProperties {
    parameters: ParameterGroupWidget.IParameter[];
    values: React.MutableRefObject<Map<string, any>>;
    toSend: boolean;
    advancedParameters?: ParameterGroupWidget.IParameter[];
  }
}

const ParameterGroupView = ({
  parameters,
  values,
  toSend,
  advancedParameters
}: ParameterGroupView.IProperties): JSX.Element => {
  return (
    <>
      {parameters.map(toParameter(values, toSend))}
      {advancedParameters && (
        <CollapsibleElement label="Advanced">
          {advancedParameters.map(toParameter(values, toSend))}
        </CollapsibleElement>
      )}
    </>
  );
};

const toParameter =
  (values: React.MutableRefObject<Map<string, any>>, toSend: boolean) =>
  (
    { name, defaultValue, options, Parameter }: ParameterGroupWidget.IParameter,
    i: number
  ): JSX.Element =>
    (
      <Parameter
        key={i}
        name={name}
        values={values}
        defaultValue={defaultValue}
        toSend={toSend}
        options={options}
      />
    );

export default ParameterGroupView;
