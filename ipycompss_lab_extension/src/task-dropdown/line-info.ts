import { CodeEditor } from '@jupyterlab/codeeditor';

namespace LineInfo {
  export interface ILineInfo {
    keyword: string;
    indentation: number;
    lineNumber: number;
    block: boolean;
  }

  export const getCurrentFunctionLineInfo = (
    position: CodeEditor.IPosition,
    text: string
  ): ILineInfo | undefined => {
    const lines: (ILineInfo | undefined)[] = text
      .split('\n')
      .map((line: string, i: number): [string, number] => [line, i])
      .filter(
        ([line, i]: [string, number]): boolean =>
          i === position.line || (i < position.line && line.includes(':'))
      )
      .map(toLineInfo)
      .filter(
        (line: ILineInfo | undefined) =>
          line?.lineNumber === position.line || line?.block
      );

    let currentLine = lines.pop();
    if (currentLine?.keyword === 'def') {
      return currentLine;
    }

    let i = lines.length - 1;
    while (i >= 0) {
      const line = lines[i];
      if (line && currentLine && line.indentation < currentLine.indentation) {
        if (line.keyword === 'def') {
          return lines[i];
        } else {
          currentLine = line;
        }
      }
      --i;
    }
  };

  const toLineInfo = ([line, lineNumber]: [string, number]):
    | ILineInfo
    | undefined => {
    const { indent, keyword } =
      line?.match(/^(?<indent>\s*)(?<keyword>\w+)/)?.groups || {};

    return {
      keyword,
      indentation: indent.length,
      lineNumber,
      block: /:$/.test(line || '')
    };
  };
}

export default LineInfo;
