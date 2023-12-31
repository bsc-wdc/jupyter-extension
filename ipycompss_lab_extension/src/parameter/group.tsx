import { Dialog, ReactWidget } from '@jupyterlab/apputils';
import React from 'react';

import ParameterGroupView from './group-view';

namespace ParameterGroupWidget {
  export interface IProperties {
    parameters: IParameter[];
    toSend: boolean;
    advancedParameters?: IParameter[];
  }

  export interface IParameter {
    name: string;
    defaultValue: any;
    Parameter: (properties: any) => JSX.Element;
    options?: { [key: string]: string };
  }
}

class ParameterGroupWidget
  extends ReactWidget
  implements Dialog.IBodyWidget<Map<string, any> | undefined>
{
  private _parameters: ParameterGroupWidget.IParameter[] | undefined;
  private _advancedParameters: ParameterGroupWidget.IParameter[] | undefined;
  private _values: React.MutableRefObject<Map<string, any>> | undefined;
  private _toSend: boolean | undefined;

  private readonly ParameterGroup = ({
    parameters,
    toSend,
    advancedParameters
  }: ParameterGroupWidget.IProperties): JSX.Element => {
    this._values = React.useRef(new Map<string, any>());
    return (
      <ParameterGroupView
        parameters={parameters}
        values={this._values}
        toSend={toSend}
        advancedParameters={advancedParameters}
      />
    );
  };

  set data({
    parameters,
    toSend,
    advancedParameters
  }: ParameterGroupWidget.IProperties) {
    this._parameters = parameters;
    this._toSend = toSend;
    this._advancedParameters = advancedParameters;
  }

  render(): JSX.Element {
    return (
      <>
        {this._parameters && this._toSend !== undefined && (
          <this.ParameterGroup
            parameters={this._parameters}
            toSend={this._toSend}
            advancedParameters={this._advancedParameters}
          />
        )}
      </>
    );
  }

  getValue(): Map<string, any> | undefined {
    return this._values?.current;
  }
}

export default ParameterGroupWidget;
