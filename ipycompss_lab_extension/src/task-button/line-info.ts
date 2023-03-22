import { CodeEditor } from '@jupyterlab/codeeditor';

export interface ILineInfo {
  keyword: string;
  indentation: number;
  lineNumber: number;
  block: boolean;
}

export const getCurrentFunctionLineInfo = (
  editor: CodeEditor.IEditor
): ILineInfo | undefined => {
  const position = editor.getCursorPosition();
  const offset = editor.getTokenForPosition(position).offset;
  const lines: (ILineInfo | undefined)[] = editor
    .getTokens()
    .filter(
      (token: CodeEditor.IToken): boolean =>
        token.offset === offset ||
        (token.offset < offset && token.value === ':')
    )
    .map(toLineInfo(editor))
    .filter(
      (
        line: ILineInfo | undefined,
        index: number,
        array: (ILineInfo | undefined)[]
      ) => index === array.length - 1 || line?.block
    );

  let currentLine = lines.pop();
  if (currentLine === undefined) {
    return;
  } else if (currentLine.keyword === 'def') {
    return currentLine;
  }

  let i = lines.length - 1;
  while (i >= 0) {
    const line = lines[i];
    if (line !== undefined && line.indentation < currentLine.indentation) {
      if (line.keyword === 'def') {
        return lines[i];
      } else {
        currentLine = line;
      }
    }
    --i;
  }
  return;
};

const toLineInfo =
  (editor: CodeEditor.IEditor) =>
  (token: CodeEditor.IToken): ILineInfo | undefined => {
    const position = editor.getPositionAt(token.offset);
    if (position === undefined) {
      return undefined;
    }
    const line = editor.getLine(position.line);
    if (line === undefined) {
      return undefined;
    }
    const [{}, indent, keyword] = line.match(/^(\s*)(\w+)/) || [];

    return {
      keyword: keyword,
      indentation: indent.length,
      lineNumber: position.line,
      block: /:$/.test(line)
    };
  };
