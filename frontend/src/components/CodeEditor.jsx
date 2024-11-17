import React from 'react';
import  MonacoEditor  from '@monaco-editor/react';
import { Code } from '../helper/Code';

const CodeEditor = () => {
  const socket = new WebSocket("ws://localhost:3000");
    const defaultCode = `
    //Write your Javascript code here ----
    `;
const handleEditorDidMount = (editor, monaco) => {
  monaco.editor.defineTheme("customTheme", {
      base: "hc-black",
      inherit: true,
      rules: [],
      colors: {
          "editor.lineHighlightBorder": "#00000000",
          "editor.lineHighlightBackground": "#000000",
      },
  });
  monaco.editor.setTheme("customTheme");
};

const handleCodeEditor = (value,event)=>{
  const data = JSON.stringify({ type: 'code-editor', data: value });
    socket.send(data);
}

    return (
        <div style={{ height: '500px', width: '100%' }}>
            <MonacoEditor
                height="100%" // Editor height
                defaultLanguage="javascript" // Language mode
                defaultValue={defaultCode} // Initial code
                onMount={handleEditorDidMount}
                onChange={handleCodeEditor}
            />
        </div>
    );
};

export default CodeEditor;
