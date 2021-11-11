#!/usr/bin/npx ts-node
/* eslint @typescript-eslint/no-var-requires: [off] */
const cluster_log = require('debug')('xpower-ui:cluster');
const server_log = require('debug')('xpower-ui:server');

import app from '../app';
import http from 'http';
import process from 'process';
import throng from 'throng';

/**
 * Get port from environment and store in express:
 */
const port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

/**
 * Determine how many processes to cluster & start:
 */
const count = process.env.WEB_CONCURRENCY || '1';
throng({ worker, count: parseInt(count) || 1 });

/**
* Entry point for each newly clustered process:
*/
function worker() {
  const server = http.createServer(app);
  server.listen(port);
  server.on('error', (e) => onError(server, e));
  server.on('listening', () => onListening(server));
  cluster_log(`worker ${process.pid} started`);
}

/**
 * Normalize a port into a number, string or false:
 */
function normalizePort(
  value: string
) {
  const port = parseInt(value, 10);
  if (isNaN(port)) {
    return value; // named pipe
  }
  if (port >= 0) {
    return port; // port number
  }
  return false;
}

/**
 * Listener for HTTP server's 'error' event:
 */
function onError(
  server: http.Server, e: NodeJS.ErrnoException
) {
  if (e.syscall !== 'listen') {
    throw e;
  }
  const bind = typeof port === 'string'
    ? `Pipe ${port}` : `Port ${port}`;
  switch (e.code) {
    case 'EACCES':
      server_log(`${bind} requires elevated privileges`);
      process.exit(1);
      break;
    case 'EADDRINUSE':
      server_log(`${bind} is already in use`);
      process.exit(1);
      break;
    default:
      throw e;
  }
}

/**
 * Listener for HTTP server's 'listening' event:
 */
function onListening(
  server: http.Server
) {
  const address = server.address();
  if (address) {
    const bind = typeof address === 'string'
      ? `pipe ${address}` : `port ${address.port}`;
    server_log(`listening on ${bind}`);
  }
}
