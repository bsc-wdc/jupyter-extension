import { CodeEditor } from '@jupyterlab/codeeditor';
import { INotebookTracker } from '@jupyterlab/notebook';
import React, { useRef } from 'react';

import { withNullable } from '../utils';
import { getCurrentFunctionLineInfo } from './line-info';
import { TaskDropdownView } from './task-dropdown-view';

export namespace TaskDropdown {
  export interface IProperties {
    tracker: INotebookTracker;
  }
}

export const TaskDropdown = ({
  tracker
}: TaskDropdown.IProperties): JSX.Element => {
  const values = useRef(new Map<string, string | null>());
  return (
    <TaskDropdownView values={values} onClick={createTask(tracker, values)} />
  );
};

const createTask =
  (
    tracker: INotebookTracker,
    values: React.MutableRefObject<Map<string, string | null>>
  ) =>
  async (): Promise<void> => {
    const editor: CodeEditor.IEditor | undefined = tracker.activeCell?.editor;
    const lineInfo = withNullable(getCurrentFunctionLineInfo)(editor);
    if (lineInfo === undefined) {
      return;
    }

    const linePosition: CodeEditor.IPosition = {
      column: lineInfo.indentation,
      line: lineInfo.lineNumber
    };
    editor?.setCursorPosition(linePosition);
    editor?.newIndentedLine();
    editor?.model.value.insert(
      editor.getOffsetAt(linePosition),
      `@task(${Array.from(values.current)
        .filter(([_, value]: [string, any]) => value !== null)
        .map(([key, value]: [string, any]) => `${key}=${value}`)
        .join(', ')})`
    );
  };
