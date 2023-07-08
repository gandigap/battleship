import { Server, RawData, WebSocketServer } from 'ws';
import convertMessage from '../utils/convert-message';
import Controller from '../controllers';

export default class WsServer {
  private port: number;

  private server: Server;

  private controller: Controller;

  constructor(port: number) {
    this.port = port;
    this.server = new WebSocketServer({ port });
    this.controller = new Controller(this.transfer.bind(this));
  }

  transfer(message: string) {
    this.server.clients.forEach((client) => {
      client.send(message);
    });
  }

  start() {
    this.server.on('connection', (ws) => {
      ws.on('error', console.error);

      ws.on('message', (message: RawData) => {
        try {
          const convertedMessage = convertMessage(message);

          this.controller.implementMessage(convertedMessage, ws);
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

      ws.on('listening', () => {
        console.log(`WebSocker server on the ${this.port} port!`);
      });
    });
  }
}
