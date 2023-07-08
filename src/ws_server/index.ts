import { WebSocketServer } from 'ws';

const wsServer = new WebSocketServer({ port: 3000 });
console.log('Start WS SERVER');
wsServer.on('connection', (ws) => {
  console.log('Connection');
  ws.on('error', console.error);
  ws.on('message', (message: any) => {
    const stringMessage = JSON.parse(message);
    console.log('stringMessage', stringMessage, message);
  });

  ws.on('open', (message: any) => {
    console.log('Open', message);
  });

  ws.on('close', (message) => {
    console.log('Close', message);
  });
});
