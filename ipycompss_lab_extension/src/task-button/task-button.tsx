import { ToolbarButtonComponent } from '@jupyterlab/apputils';
import { CodeEditor } from '@jupyterlab/codeeditor';
import { INotebookTracker } from '@jupyterlab/notebook';

import React from 'react';
import { getCurrentFunctionLineInfo } from './line-info';

export const TaskButton = ({
  tracker
}: {
  tracker: INotebookTracker;
}): JSX.Element => {
  return (
    <ToolbarButtonComponent label="Define task" onClick={createTask(tracker)} />
  );
};

const createTask = (tracker: INotebookTracker) => async (): Promise<void> => {
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
  editor.replaceSelection?.('@task()');
};
