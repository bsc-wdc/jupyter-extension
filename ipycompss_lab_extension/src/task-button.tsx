import { ToolbarButtonComponent } from '@jupyterlab/apputils';
import { CodeEditor } from '@jupyterlab/codeeditor';

import React from 'react';
import { tracker } from './activate';

export const TaskButton = (): JSX.Element => {
  return <ToolbarButtonComponent label="Define task" onClick={createTask} />;
};

const createTask = async (): Promise<void> => {
  const editor: CodeEditor.IEditor | undefined = tracker.activeCell?.editor;
  if (editor === undefined) {
    return;
  }

  const position = editor.getCursorPosition();
  const offset = editor.getOffsetAt(position);
  const token: CodeEditor.IToken | undefined = editor
    .getTokens()
    .reverse()
    .find(
      (token: CodeEditor.IToken): boolean =>
        token.offset <= offset && token.value === 'def'
    );
  if (token === undefined) {
    return;
  }

  const tokenPosition = editor.getPositionAt(token.offset);
  if (tokenPosition === undefined) {
    return;
  }

  editor.setCursorPosition(tokenPosition);
  editor.newIndentedLine();
  editor.setSelection({ end: tokenPosition, start: tokenPosition });
  editor.replaceSelection?.('@task()');
};
