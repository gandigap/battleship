import WsServer from './src/ws_server/index';
import { httpServer } from './src/http_server/index';

const WS_PORT = 3000;
const HTTP_PORT = 8181;

console.log(`Start static http server on the ${HTTP_PORT} port!`);
httpServer.listen(HTTP_PORT);

const wsServer = new WsServer(WS_PORT);
wsServer.start();
