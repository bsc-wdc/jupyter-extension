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
  const lines: (ILineInfo | undefined)[] = editor.model.value.text
    .split('\n')
    .map((line: string, i: number): [string, number] => [line, i])
    .filter(
      ([line, i]: [string, number]): boolean =>
        i === position.line || (i < position.line && line.includes(':'))
    )
    .map(toLineInfo(editor))
    .filter(
      (line: ILineInfo | undefined) =>
        line?.lineNumber === position.line || line?.block
    );

  let currentLine = lines.pop();
  if (currentLine === undefined) {
    return;
  }
  if (currentLine.keyword === 'def') {
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
};

const toLineInfo =
  (editor: CodeEditor.IEditor) =>
  ([line, lineNumber]: [string, number]): ILineInfo | undefined => {
    const { indent, keyword } =
      line?.match(/^(?<indent>\s*)(?<keyword>\w+)/)?.groups || {};

    return {
      keyword,
      indentation: indent.length,
      lineNumber,
      block: /:$/.test(line || '')
    };
  };
