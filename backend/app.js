import express from 'express';
import http from "http";
import { WebSocketServer } from 'ws';
import pty from 'node-pty';
import os from 'os';
import fs from 'fs';
import path from 'path';

const app = express();
const PORT = 3000;

const httpServer = http.createServer(app);

let code = []; // Array to store code from code editor

app.get("/", (req, res) => {
    res.send("Hello, first time spinning in Docker.");
});

const wss = new WebSocketServer({ server: httpServer });

// Platform-specific shell configuration
const shellConfig = {
    linux: {
        shell: 'bash',
        args: ['--login'],
        env: { ...process.env, TERM: 'xterm-256color' }
    },
    darwin: {
        shell: 'bash',
        args: ['--login'],
        env: { ...process.env, TERM: 'xterm-256color' }
    },
    win32: {
        shell: 'powershell.exe',
        args: [],
        env: process.env
    }
};

// Get platform-specific configuration
const getPlatformConfig = () => {
    const platform = os.platform();
    return shellConfig[platform] || shellConfig.linux;
};

wss.on('connection', (ws) => {
    console.log('Client connected');

    try {
        const config = getPlatformConfig();

        // Create pty process with platform-specific config
        const ptyProcess = pty.spawn(config.shell, config.args, {
            name: 'xterm-256color',
            cols: 80,
            rows: 30,
            cwd: process.env.HOME || process.env.USERPROFILE,
            env: config.env
        });

        // Send terminal output to WebSocket
        ptyProcess.onData((data) => {
            ws.send(JSON.stringify({ type: 'terminal', data }));
        });

        // Handle WebSocket messages from client
        ws.on('message', (message) => {
            try {
                const data = JSON.parse(message);
        
                if (data.type === "code-editor") {
                    code.push(data.data); // Save code from the editor
                } else if (data.type === "terminal") {
                    if (data.data.startsWith("node ")) {
                        const fileName = data.data.split("node ")[1].trim(); // Extract file name
                        const codeToWrite = code[code.length - 1]; // Get the latest code
        
                        // Write the file using Node.js `fs` module
                        const filePath = path.join(process.env.HOME || process.env.USERPROFILE, fileName);
                        console.log({filePath})
        
                        fs.writeFile(filePath, codeToWrite, 'utf8', (err) => {
                            if (err) {
                                console.error(`Error writing file ${fileName}:`, err);
                                ws.send(JSON.stringify({
                                    type: 'error',
                                    data: `Failed to write file: ${err.message}`
                                }));
                                return;
                            }
        
                            console.log(`File ${fileName} written successfully`);
        
                            // Execute the file after writing it
                            ptyProcess.write(data.data + "\r");
                        });
                    } else {
                        ptyProcess.write(data.data + "\r");
                    }
                }
            } catch (err) {
                console.error('Error processing message:', err);
            }
        });
        

        // Clean up on WebSocket close
        ws.on('close', () => {
            console.log('Client disconnected');
            ptyProcess.kill();
        });

        ws.send(JSON.stringify({ type: 'system', data: 'connected' }));
    } catch (err) {
        console.error('Error creating terminal:', err);
        ws.send(JSON.stringify({
            type: 'error',
            data: 'Failed to create terminal session'
        }));
    }
});

// Start server
httpServer.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
