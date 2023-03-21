import { ToolbarButtonComponent } from '@jupyterlab/apputils';
import { CodeEditor } from '@jupyterlab/codeeditor';
import { INotebookTracker } from '@jupyterlab/notebook';

import React from 'react';

interface ILineInfo {
  keyword: string;
  indentation: number;
  lineNumber: number;
  block: boolean;
}

export const TaskButton = ({
  tracker
}: {
  tracker: INotebookTracker;
}): JSX.Element => {
  const createTask = async (): Promise<void> => {
    const editor: CodeEditor.IEditor | undefined = tracker.activeCell?.editor;
    if (editor === undefined) {
      return;
    }

    const toLineInfo = (token: CodeEditor.IToken): ILineInfo => {
      const position = editor.getPositionAt(token.offset)!;
      const line = editor.getLine(position.line)!;
      const [{}, indent, keyword] = line.match(/^(\s*)(\w+)/)!;

      return {
        keyword: keyword,
        indentation: indent.length,
        lineNumber: position.line,
        block: /:$/.test(line)
      };
    };

    const getCurrentFunctionLineInfo = (): ILineInfo | undefined => {
      const position = editor.getCursorPosition();
      const offset = editor.getTokenForPosition(position).offset;
      const lines: ILineInfo[] = editor
        .getTokens()
        .filter(
          (token: CodeEditor.IToken): boolean =>
            token.offset === offset ||
            (token.offset < offset && token.value === ':')
        )
        .map(toLineInfo)
        .filter(
          (line: ILineInfo, index: number, array: ILineInfo[]) =>
            index === array.length - 1 || line.block
        );

      let line = lines.pop();
      if (line === undefined) {
        return;
      } else if (line.keyword === 'def') {
        return line;
      }

      let i = lines.length - 1;
      while (i >= 0) {
        if (lines[i].indentation < line.indentation) {
          if (lines[i].keyword === 'def') {
            return lines[i];
          } else {
            line = lines[i];
          }
        }
        --i;
      }
      return;
    };

    const lineInfo = getCurrentFunctionLineInfo();
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

  return <ToolbarButtonComponent label="Define task" onClick={createTask} />;
};
