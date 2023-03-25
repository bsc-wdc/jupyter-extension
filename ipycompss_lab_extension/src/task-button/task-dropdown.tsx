import { ToolbarButtonComponent } from '@jupyterlab/apputils';
import { CodeEditor } from '@jupyterlab/codeeditor';
import { INotebookTracker } from '@jupyterlab/notebook';
import React, { useState } from 'react';

import { CollapsibleElement } from '../collapsible-element';
import { BooleanParameter } from '../parameter/bool';
import { IntegerParameter } from '../parameter/int';
import { StringParameter } from '../parameter/str';
import { getCurrentFunctionLineInfo } from './line-info';

export namespace TaskDropdown {
  export interface IProperties {
    tracker: INotebookTracker;
  }
}

export const TaskDropdown = ({
  tracker
}: TaskDropdown.IProperties): JSX.Element => {
  const state = useState(new Map<string, any>());
  const parameters: any[] = [
    <StringParameter
      key={0}
      common={{ name: 'returns' }}
      state={state}
      defaultValue=""
    />,
    <BooleanParameter
      key={1}
      common={{ name: 'priority' }}
      state={state}
      defaultValue={false}
    />,
    <BooleanParameter
      key={2}
      common={{ name: 'is_reduce' }}
      state={state}
      defaultValue={true}
    />,
    <IntegerParameter
      key={3}
      common={{ name: 'chunk_size' }}
      state={state}
      defaultValue={0}
    />,
    <IntegerParameter
      key={4}
      common={{ name: 'time_out' }}
      state={state}
      defaultValue={0}
    />
  ];
  return (
    <>
      <CollapsibleElement label="Task">
        {parameters}
        <ToolbarButtonComponent
          label="Define task"
          onClick={createTask(tracker, state[0])}
        />
      </CollapsibleElement>
    </>
  );
};

const createTask =
  (tracker: INotebookTracker, values: Map<string, any>) =>
  async (): Promise<void> => {
    const editor: CodeEditor.IEditor | undefined = tracker.activeCell?.editor;
    if (editor === undefined) {
      return;
    }

    const lineInfo = getCurrentFunctionLineInfo(editor);
    if (lineInfo === undefined) {
      return;
    }

    const linePosition: CodeEditor.IPosition = {
      column: lineInfo.indentation,
      line: lineInfo.lineNumber
    };
    editor.setCursorPosition(linePosition);
    editor.newIndentedLine();
    editor.setSelection({ end: linePosition, start: linePosition });
    editor.replaceSelection?.(
      `@task(${Array.from(values)
        .map(([key, value]: [string, any]) => `${key}=${value}`)
        .join(', ')})`
    );
  };
