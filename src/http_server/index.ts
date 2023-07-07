import fs from 'fs';
import { createServer } from 'http';
import path from 'path';

export const httpServer = createServer((req, res) => {
  const dirname = path.resolve(path.dirname(''));
  const filePath = dirname + (req.url === '/' ? '/front/index.html' : `/front${req.url}`);
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404);
      res.end(JSON.stringify(err));
      return;
    }
    res.writeHead(200);
    res.end(data);
  });
});

export default httpServer;
