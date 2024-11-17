import React, { useEffect, useRef, useState } from 'react';
import { Terminal } from 'xterm';
import 'xterm/css/xterm.css';
import { Code } from '../helper/Code';

const NewTerminal = () => {
  const term = useRef(null);
  const terminalRef = useRef();
  const socket = new WebSocket("ws://localhost:3000");
  const [command, setCommand] = useState("");
  const cursorPosition = useRef(0);
   const savedData = localStorage.getItem('fileExplorerData');

  useEffect(() => {
    if (!term.current) {
      // Configure terminal options
      term.current = new Terminal({
        cursorBlink: true,
        theme: {
          background: '#00000', // Set your desired background color here
          foreground: '#47f71c'  // Optionally set the text color
        },
        rows:30,
        cols:100,
        fontFamily: 'monospace', // Set font family
        fontSize: 16, // Font size in pixels
        fontWeight: 'semi-bold', // Font weight for regular text
        fontWeightBold: 'semi-bold', // Font weight for bold text
        scrollback: 1000
        
        
      });

      // console.log({ socket });
      // console.log({ command });

      socket.onmessage = (event) => {
        const parsedData = JSON.parse(event.data);
        console.log(parsedData);
      
        // Check if the data is not "connected" and doesn't contain "ls"
        if (
          parsedData.data !== "connected" 
          && !parsedData.data.includes('ls')
          && !parsedData.data.includes('cd')
          && !parsedData.data.includes('rm -r')
        ) {
          console.log("connected");
          term.current.write(parsedData.data);
          term.current.write('\r\n$ ');
          cursorPosition.current = term.current.buffer.active.cursorX;
        }
      };

    //  if(parsedData.type === "code-editor"){
    //   term.current.write(parsedData.data);
    //   term.current.write('\r\n$ ');
    //   cursorPosition.current = term.current.buffer.active.cursorX;
    //  }
      

      term.current.open(terminalRef.current);
      term.current.write('~/$ ');
      cursorPosition.current = term.current.buffer.active.cursorX;

      // Handling command enter or written by user using key
      term.current.onKey(({ key, domEvent }) => {
        const currentCursorX = term.current.buffer.active.cursorX;

        if (domEvent.key === "Enter") {
          setCommand((prevCommand) => {
            console.log("Sending Command", prevCommand);
            const data = JSON.stringify({type:"terminal",data:prevCommand})
            socket.send(data);
            return '';
          });
          term.current.write('\r\n');
          cursorPosition.current = term.current.buffer.active.cursorX;
        } else if (domEvent.key === "Backspace") {
         // console.log("backspace clicked..")
          // Only allow backspace if we're not at the prompt position
          //console.log({currentCursorX,cursorPosition:cursorPosition.current})
          if (true) {
            setCommand((prevCommand) => {
              if (prevCommand.length > 0) {
                console.log({ Editing: prevCommand });
                term.current.write('\b \b');
                return prevCommand.slice(0, -1);
              }
              return prevCommand;
            });
          }
        } else {
          // Only allow typing if it's not a control key
          if (!domEvent.ctrlKey && !domEvent.altKey && key.length === 1) {
            setCommand((prev) => {
              console.log({ Appending: command });
              term.current.write(key);
              return prev + key;
            });
          }
        }
      });
    }

    // Add style to hide scrollbar
   
  }, [command, socket]);

  return (
    <div className='border-t border-white'>

      <div
        ref={terminalRef}
        
      />
    </div>
  );
};

export default NewTerminal;