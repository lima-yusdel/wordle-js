const express = require('express');
const http = require('http');
const WebSocket = require('ws');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const PORT = process.env.PORT || 3000;

app.use(express.static('public'));

wss.on('connection', (ws) => {
    console.log('Client connected');

    // Handle incoming messages from clients
    ws.on('message', (message) => {
        // Broadcast the message to all clients
        wss.clients.forEach((client) => {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
                client.send(message);
            }
        });
    });
});

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
