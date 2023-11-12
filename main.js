// index.js

const express = require('express');
const http = require('http');
const WebSocket = require('ws');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Middleware to parse JSON in API requests
app.use(express.json());

// Define an API route
app.get('/api/greet', (req, res) => {
  res.json({ message: 'Hello, API!' });
});

// Set up a WebSocket connection event listener
wss.on('connection', (ws) => {
  console.log('WebSocket client connected');

  // Set up a message event listener
  ws.on('message', (message) => {
    console.log(`Received WebSocket message: ${message}`);

    // Broadcast the message to all WebSocket clients
    wss.clients.forEach((client) => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  });

  // Set up a close event listener
  ws.on('close', () => {
    console.log('WebSocket client disconnected');
  });
});

// Serve static files (optional, but useful if you want to serve an HTML file)
app.use(express.static('public'));

// Set the server to listen on port 3000
const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
