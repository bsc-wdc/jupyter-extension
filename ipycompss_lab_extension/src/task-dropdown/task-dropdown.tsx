import { CodeEditor } from '@jupyterlab/codeeditor';
import { INotebookTracker } from '@jupyterlab/notebook';
import React from 'react';

import { ParameterGroupWidget } from '../parameter';
import { getCurrentFunctionLineInfo } from './line-info';
import { TaskDropdownView } from './view';

export namespace TaskDropdown {
  export interface IProperties {
    tracker: INotebookTracker;
  }
}

export const TaskDropdown = ({
  tracker
}: TaskDropdown.IProperties): JSX.Element => {
  const widget: ParameterGroupWidget = new ParameterGroupWidget();
  return (
    <TaskDropdownView
      parameters={widget}
      onClick={createTask(tracker, widget)}
    />
  );
};

const createTask =
  (tracker: INotebookTracker, parameters: ParameterGroupWidget) =>
    async (): Promise<void> => {
      const values = parameters.getValue();
      const editor: CodeEditor.IEditor | undefined = tracker.activeCell?.editor;
      const lineInfo = editor && getCurrentFunctionLineInfo(editor);

      const linePosition: CodeEditor.IPosition | undefined = lineInfo && {
        column: lineInfo.indentation,
        line: lineInfo.lineNumber
      };
      linePosition && editor?.setCursorPosition(linePosition);
      editor?.newIndentedLine();
      linePosition &&
        editor?.model.value.insert(
          editor.getOffsetAt(linePosition),
          `@task(${values &&
          Array.from(values)
            .filter(([_, value]: [string, any]) => value !== null)
            .map(([key, value]: [string, any]) => `${key}=${value}`)
            .join(', ')
          })`
        );
    };
