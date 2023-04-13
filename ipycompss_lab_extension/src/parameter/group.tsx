import { Dialog, ReactWidget } from '@jupyterlab/apputils';
import React, { useRef } from 'react';

import { ParameterGroupView } from './group-view';

export namespace ParameterGroup {
  export interface IProperties {
    parameters: IParameter[];
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
  private _parameters: ParameterGroup.IParameter[] | undefined;
  private _values:
    | React.MutableRefObject<Map<string, string | null>>
    | undefined;
  private _toSend: boolean | undefined;

  private readonly ParameterGroup = ({
    parameters
  }: ParameterGroup.IProperties) => {
    this._values = useRef(new Map<string, string | null>());
    return (
      <ParameterGroupView
        parameters={parameters}
        values={this._values}
        toSend={!!this._toSend}
      />
    );
  };

  set data(data: ParameterGroup.IParameter[]) {
    this._parameters = data;
  }

  set toSend(toSend: boolean) {
    this._toSend = toSend;
  }

  render(): JSX.Element {
    return (
      <>
        {this._parameters && (
          <this.ParameterGroup parameters={this._parameters} />
        )}
      </>
    );
  }

  getValue(): Map<string, string | null> | undefined {
    return this._values?.current;
  }
}
