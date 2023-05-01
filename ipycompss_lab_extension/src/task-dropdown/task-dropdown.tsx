import { CodeEditor } from '@jupyterlab/codeeditor';
import { INotebookTracker } from '@jupyterlab/notebook';
import React from 'react';

import { ParameterGroupWidget } from '../parameter';
import { LineInfo } from './line-info';
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
      parameterWidget={widget}
      onClick={createTask(tracker, widget)}
    />
  );
};

const createTask =
  (tracker: INotebookTracker, parameters: ParameterGroupWidget) =>
  async (): Promise<void> => {
    const editor: CodeEditor.IEditor | undefined = tracker.activeCell?.editor;
    const position = editor?.getCursorPosition();
    const text = editor?.model.value.text;
    if (text === undefined) {
      return;
    }
    const lineInfo =
      position && LineInfo.getCurrentFunctionLineInfo(position, text);

    const linePosition: CodeEditor.IPosition | undefined = lineInfo && {
      column: lineInfo.indentation,
      line: lineInfo.lineNumber
    };
    linePosition && editor?.setCursorPosition(linePosition);
    editor?.newIndentedLine();

    const values = parameters.getValue();
    linePosition &&
      editor?.model.value.insert(
        editor.getOffsetAt(linePosition),
        `@task(${
          values &&
          Array.from(values)
            .filter(([_, value]: [string, any]) => value.default === undefined)
            .map(([key, value]: [string, any]) => `${key}=${value}`)
            .join(', ')
        })`
      );
  };
