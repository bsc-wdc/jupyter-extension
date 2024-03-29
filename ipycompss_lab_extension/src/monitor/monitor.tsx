import React from 'react';

import Status from '../status';
import Utils from '../utils';
import MonitorManager from './manager';
import MonitorView from './view';

namespace Monitor {
  export type ActionType = 'start' | 'open' | 'stop';

  export interface IProperties {
    trackers: Utils.ITrackers;
  }
}

const Monitor = ({ trackers }: Monitor.IProperties): JSX.Element => {
  const [{ enabled, cluster, monitorStarted }, setState] = React.useContext(
    Status.Context
  );
  return (
    <MonitorView
      start={enabled && !cluster && !monitorStarted}
      open={enabled && !cluster && monitorStarted}
      stop={enabled && !cluster && monitorStarted}
      onClick={onClick(trackers, setState)}
    />
  );
};

const onClick =
  (
    trackers: Utils.ITrackers,
    setState: React.Dispatch<React.SetStateAction<Status.IState>>
  ) =>
  (action: Monitor.ActionType) =>
  async (): Promise<void> => {
    if (action == 'open') {
      window.open('http://localhost:8080/compss-monitor', '_blank')?.focus();
    }else{
      const kernel = Utils.getKernel(trackers);
      MonitorManager.executeAction(kernel, action);
      Status.updateState(kernel, setState);
    }
  };

export default Monitor;
