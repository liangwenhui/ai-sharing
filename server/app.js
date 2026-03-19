import fs from 'node:fs/promises';
import path from 'node:path';
import http from 'node:http';
import { fileURLToPath } from 'node:url';
import { createServer as createViteServer } from 'vite';
import { resolvePreviewAssetPath } from './preview-assets.js';
import { createTerminalSession } from './terminal-session.js';
import {
  createHandshakeAcceptValue,
  decodeFrames,
  encodeTextFrame,
  parseClientMessage
} from './websocket-protocol.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const distDir = path.join(rootDir, 'dist');
const isPreview = process.argv.includes('--preview');
const port = Number(process.env.PORT || (isPreview ? 4173 : 5173));

function getContentType(filePath) {
  const extension = path.extname(filePath).toLowerCase();

  switch (extension) {
    case '.css':
      return 'text/css; charset=utf-8';
    case '.html':
      return 'text/html; charset=utf-8';
    case '.js':
      return 'application/javascript; charset=utf-8';
    case '.json':
      return 'application/json; charset=utf-8';
    case '.svg':
      return 'image/svg+xml';
    default:
      return 'application/octet-stream';
  }
}

async function handlePreviewRequest(request, response) {
  const url = new URL(request.url ?? '/', 'http://localhost');
  const assetPath = resolvePreviewAssetPath({
    distDir,
    requestPath: url.pathname
  });

  try {
    const content = await fs.readFile(assetPath);
    response.writeHead(200, { 'Content-Type': getContentType(assetPath) });
    response.end(content);
  } catch (error) {
    if (error.code === 'ENOENT') {
      response.writeHead(404);
      response.end('Not found');
      return;
    }

    response.writeHead(500);
    response.end(error.message);
  }
}

function attachTerminalBridge(server) {
  server.on('upgrade', (request, socket, head) => {
    const url = new URL(request.url ?? '/', 'http://localhost');

    if (url.pathname !== '/ws/live-terminal') {
      socket.destroy();
      return;
    }

    const websocketKey = request.headers['sec-websocket-key'];

    if (typeof websocketKey !== 'string') {
      socket.destroy();
      return;
    }

    const headers = [
      'HTTP/1.1 101 Switching Protocols',
      'Upgrade: websocket',
      'Connection: Upgrade',
      `Sec-WebSocket-Accept: ${createHandshakeAcceptValue(websocketKey)}`,
      '\r\n'
    ];

    socket.write(headers.join('\r\n'));

    const session = createTerminalSession({ rootDir });
    let buffer = Buffer.alloc(0);

    function sendMessage(payload) {
      if (!socket.destroyed) {
        socket.write(encodeTextFrame(JSON.stringify(payload)));
      }
    }

    const detachOutput = session.onOutput((data) => {
      sendMessage({ type: 'output', data });
    });

    const detachStatus = session.onStatus((status) => {
      sendMessage({ type: 'status', status });
    });

    const detachClose = session.onClose(() => {
      detachOutput();
      detachStatus();
      detachClose();
      if (!socket.destroyed) {
        socket.end();
      }
    });

    function handleFrame(frame) {
      if (frame.opcode === 0x8) {
        session.close();
        socket.end();
        return;
      }

      if (frame.opcode !== 0x1) {
        return;
      }

      try {
        const message = parseClientMessage(frame.payload.toString('utf8'));

        if (message.type === 'input') {
          session.sendInput(message.data);
          return;
        }

        if (message.type === 'resize') {
          session.resize(message.cols, message.rows);
          return;
        }

        if (message.type === 'shutdown') {
          session.close();
          socket.end();
        }
      } catch (error) {
        sendMessage({ type: 'output', data: `\r\n[Bridge error] ${error.message}\r\n` });
      }
    }

    socket.on('data', (chunk) => {
      buffer = Buffer.concat([buffer, chunk]);
      const decoded = decodeFrames(buffer);
      buffer = decoded.remainder;
      decoded.frames.forEach(handleFrame);
    });

    socket.on('close', () => {
      detachOutput();
      detachStatus();
      detachClose();
      session.close();
    });

    socket.on('error', () => {
      session.close();
    });

    if (head.length > 0) {
      buffer = Buffer.concat([buffer, head]);
      const decoded = decodeFrames(buffer);
      buffer = decoded.remainder;
      decoded.frames.forEach(handleFrame);
    }
  });
}

async function start() {
  let viteServer = null;

  const server = http.createServer(async (request, response) => {
    if (isPreview) {
      await handlePreviewRequest(request, response);
      return;
    }

    viteServer.middlewares(request, response, () => {
      response.writeHead(404);
      response.end('Not found');
    });
  });

  attachTerminalBridge(server);

  if (!isPreview) {
    viteServer = await createViteServer({
      root: rootDir,
      server: {
        middlewareMode: true
      },
      appType: 'spa'
    });
  }

  server.listen(port, () => {
    const modeLabel = isPreview ? 'preview' : 'dev';
    console.log(`Live terminal ${modeLabel} server running at http://localhost:${port}`);
  });
}

start().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
