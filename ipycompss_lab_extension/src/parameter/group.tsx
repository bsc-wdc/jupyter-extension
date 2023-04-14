import { Dialog, ReactWidget } from '@jupyterlab/apputils';
import React, { useRef } from 'react';

import { ParameterGroupView } from './group-view';

export namespace ParameterGroupWidget {
  export interface IProperties {
    parameters: IParameter[];
    toSend: boolean;
    advancedParameters?: IParameter[];
  }

  export interface IParameter {
    name: string;
    defaultValue: any;
    Parameter: (properties: any) => JSX.Element;
    options?: string[];
  }
}

export class ParameterGroupWidget
  extends ReactWidget
  implements Dialog.IBodyWidget<Map<string, string | null> | undefined>
{
  private _parameters: ParameterGroupWidget.IParameter[] | undefined;
  private _advancedParameters: ParameterGroupWidget.IParameter[] | undefined;
  private _values:
    | React.MutableRefObject<Map<string, string | null>>
    | undefined;
  private _toSend: boolean | undefined;

  private readonly ParameterGroup = ({
    parameters,
    toSend,
    advancedParameters
  }: ParameterGroupWidget.IProperties) => {
    this._values = useRef(new Map<string, string | null>());
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

  getValue(): Map<string, string | null> | undefined {
    return this._values?.current;
  }
}
