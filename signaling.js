const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const { v4: uuid } = require('uuid');
const usersJSON = require("./user.json");
const fs = require("fs");

const users = {};

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

wss.on('connection', (ws) => {
  console.log('Connected');
  // Send a unique user ID to the connected client
  const id = uuid()
  ws.send(JSON.stringify({ key: 'user', user: id }));
  users[id] = ws;
  // Handle incoming messages
  ws.on('message', (message) => {
    // ws.send(JSON.stringify(usersJSON));




    // Read the file file 
    // let us = null;
    // const d = fs.readFileSync("user.json");
    // console.log("JSon", JSON.parse(d));
    // ws.send(JSON.parse(d))
    // Modify the file
    // Save the file






    const data = JSON.parse(message);
    // const data = {type: null}
    // Handle WebRTC signaling
    // switch (data.type) {
    //   case 'offer':
    //     wss.clients.forEach((client) => {
    //       if (client !== ws && client.readyState === WebSocket.OPEN) {
    //         client.send(JSON.stringify({ type: 'offer', offer: data.offer }));
    //       }
    //     });
    //     break;
    //   case 'answer':
    //     wss.clients.forEach((client) => {
    //       if (client !== ws && client.readyState === WebSocket.OPEN) {
    //         client.send(JSON.stringify({ type: 'answer', answer: data.answer }));
    //       }
    //     });
    //     break;
    //   case 'ice-candidate':
    //     wss.clients.forEach((client) => {
    //       if (client !== ws && client.readyState === WebSocket.OPEN) {
    //         client.send(JSON.stringify({ type: 'ice-candidate', candidate: data.candidate }));
    //       }
    //     });
    //     break;
    //   default:
    //     break;
    // }  
    const type = data.type;
    var remotePeer, localPeer, sdp = null;
    switch (type) {
      case 'offer':
        remotePeer = data.remotePeer;
        localPeer = data.localPeer;
        sdp = data.sdp;
        users[remotePeer].send(JSON.stringify({ key: 'offer', localPeer: localPeer, remotePeer: remotePeer, sdp: sdp }));
        break;
      case 'answer':
        remotePeer = data.remotePeer
        localPeer = data.localPeer
        sdp = data.sdp
        users[remotePeer].send(JSON.stringify({ key: 'answer', remotePeer, localPeer, sdp }));
        break;
      case 'create':
        const userData = fs.readFileSync("user.json");
        const formatData = JSON.parse(userData);
        console.log(formatData);
        formatData.users[data.id] = {
          name: data.name,
          offer: "",
          answer: ""
        };
        fs.writeFileSync("user.json",JSON.stringify(formatData));
        break;
      case 'get':
        const userD = fs.readFileSync("user.json");
        const formatD = JSON.parse(userD);
        const ret = formatD.users[data.id];
        ws.send(JSON.stringify(ret));
        break;
    }
  });
});

server.listen(7000, () => {
  console.log('Server listening on *:7000');
});
