import { RawData, WebSocketServer } from 'ws';
import Controller from '../controllers';
import convertMessage from '../utils/convert-message';

const wsServer = new WebSocketServer({ port: 3000 });

wsServer.on('connection', (ws) => {
  const controller = new Controller();
  ws.on('error', console.error);

  ws.on('message', (message: RawData) => {
    try {
      const convertedMessage = convertMessage(message);

      controller.implementMessage(convertedMessage, ws);
    } catch (error) {
      console.log('error');
    }
  });

  ws.on('open', (message: RawData) => {
    console.log('Open', message);
  });

  ws.on('close', (message) => {
    console.log('Close', message);
  });
});
