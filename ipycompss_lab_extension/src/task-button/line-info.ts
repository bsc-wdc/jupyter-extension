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
  const lines: ILineInfo[] = editor
    .getTokens()
    .filter(
      (token: CodeEditor.IToken): boolean =>
        token.offset === offset ||
        (token.offset < offset && token.value === ':')
    )
    .map(toLineInfo(editor))
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

const toLineInfo =
  (editor: CodeEditor.IEditor) =>
  (token: CodeEditor.IToken): ILineInfo => {
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
