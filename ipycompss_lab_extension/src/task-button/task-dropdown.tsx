import { ToolbarButtonComponent } from '@jupyterlab/apputils';
import { CodeEditor } from '@jupyterlab/codeeditor';
import { INotebookTracker } from '@jupyterlab/notebook';
import { InputGroup } from '@jupyterlab/ui-components';
import React, { useState } from 'react';

import { CollapsibleElement } from '../collapsible-element';
import { getCurrentFunctionLineInfo } from './line-info';

export namespace TaskDropdown {
  export interface IProperties {
    tracker: INotebookTracker;
  }
}

export const TaskDropdown = ({
  tracker
}: TaskDropdown.IProperties): JSX.Element => {
  const [values, setValues] = useState({ returns: '' });
  const parameters: any[] = [
    <div key={0} className="ipycompss-parameter">
      Returns
      <InputGroup
        onChange={(event: React.FormEvent<HTMLInputElement>) => {
          setValues({
            ...values,
            returns: (event.target as HTMLInputElement).value
          });
        }}
      />
    </div>
  ];
  return (
    <>
      <CollapsibleElement label="Task">
        {parameters}
        <ToolbarButtonComponent
          label="Define task"
          onClick={createTask(tracker, values)}
        />
      </CollapsibleElement>
    </>
  );
};

const createTask =
  (tracker: INotebookTracker, values: any) => async (): Promise<void> => {
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
    editor.replaceSelection?.(
      `@task(${Object.entries(values).map(
        ([key, value]: [string, any]): string =>
          value ? `${key}=${value}` : ''
      )})`
    );
  };
