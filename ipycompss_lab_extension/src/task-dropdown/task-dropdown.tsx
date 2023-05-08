import { CodeEditor } from '@jupyterlab/codeeditor';
import { INotebookTracker } from '@jupyterlab/notebook';
import React from 'react';

import { ParameterGroupWidget } from '../parameter';
import LineInfo from './line-info';
import TaskDropdownView from './view';
import { Dialog, showDialog } from '@jupyterlab/apputils';

namespace TaskDropdown {
  export interface IProperties {
    tracker: INotebookTracker;
  }
}

const TaskDropdown = ({ tracker }: TaskDropdown.IProperties): JSX.Element => {
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

    const functionParameters =
      editor &&
      LineInfo.getCurrentFunctionParameters(
        editor?.getTokens(),
        (offset: number) => editor.getPositionAt(offset)?.line,
        lineInfo
      );

    const linePosition: CodeEditor.IPosition | undefined = lineInfo && {
      column: lineInfo.indentation,
      line: lineInfo.lineNumber
    };
    linePosition && editor?.setCursorPosition(linePosition);
    editor?.newIndentedLine();

    const staticValues = parameters.getValue();
    if (functionParameters?.length) {
      void showDialog({
        title: 'Task parameters',
        body: TaskDropdownView.dialogBody(functionParameters),
        buttons: [Dialog.okButton({ label: 'Define task' })]
      }).then(defineTaskWithParameters(editor, linePosition, staticValues));
    } else {
      defineTask(editor, linePosition, staticValues);
    }
  };

const defineTaskWithParameters =
  (
    editor: CodeEditor.IEditor | undefined,
    linePosition: CodeEditor.IPosition | undefined,
    staticValues: Map<string, any> | undefined
  ) =>
  (result: Dialog.IResult<Map<string, any> | undefined>): void => {
    const values =
      staticValues &&
      result.value &&
      new Map([...result.value, ...staticValues]);
    result.button.accept && defineTask(editor, linePosition, values);
  };

const defineTask = (
  editor: CodeEditor.IEditor | undefined,
  linePosition: CodeEditor.IPosition | undefined,
  values: Map<string, any> | null | undefined
) => {
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

export default TaskDropdown;
