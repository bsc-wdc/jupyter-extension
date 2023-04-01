import { ToolbarButtonComponent } from '@jupyterlab/apputils';
import { CodeEditor } from '@jupyterlab/codeeditor';
import { INotebookTracker } from '@jupyterlab/notebook';
import React, { useRef } from 'react';

import { CollapsibleElement } from '../collapsible-element';
import {
  BooleanParameter,
  EnumerationParameter,
  IntegerParameter,
  StringParameter
} from '../parameter';
import { getCurrentFunctionLineInfo } from './line-info';

export namespace TaskDropdown {
  export interface IProperties {
    tracker: INotebookTracker;
  }
}

export const TaskDropdown = ({
  tracker
}: TaskDropdown.IProperties): JSX.Element => {
  const values = useRef(new Map<string, string | null>());
  const parameters: any[] = [
    <StringParameter
      key={0}
      common={{ name: 'returns', values }}
      defaultValue=""
    />,
    <BooleanParameter
      key={1}
      common={{ name: 'priority', values }}
      defaultValue={false}
    />,
    <BooleanParameter
      key={2}
      common={{ name: 'is_reduce', values }}
      defaultValue={true}
    />,
    <IntegerParameter
      key={3}
      common={{ name: 'chunk_size', values }}
      defaultValue={0}
    />,
    <IntegerParameter
      key={4}
      common={{ name: 'time_out', values }}
      defaultValue={0}
    />,
    <EnumerationParameter
      key={5}
      properties={{
        common: { name: 'on_failure', values },
        defaultValue: '"RETRY"'
      }}
      options={['"RETRY"', '"CANCEL_SUCCESSORS"', '"FAIL"', '"IGNORE"']}
    />
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
  (
    tracker: INotebookTracker,
    values: React.MutableRefObject<Map<string, string | null>>
  ) =>
  async (): Promise<void> => {
    const editor: CodeEditor.IEditor | undefined = tracker.activeCell?.editor;
    if (editor === undefined) {
      return;
    }

    const lineInfo = getCurrentFunctionLineInfo(editor);
    if (lineInfo === undefined) {
      return;
    }

    const linePosition: CodeEditor.IPosition = {
      column: lineInfo?.indentation,
      line: lineInfo?.lineNumber
    };
    editor.setCursorPosition(linePosition);
    editor.newIndentedLine();
    editor.model.value.insert(
      editor.getOffsetAt(linePosition),
      `@task(${Array.from(values.current)
        .filter(([_, value]: [string, any]) => value !== null)
        .map(([key, value]: [string, any]) => `${key}=${value}`)
        .join(', ')})`
    );
  };
