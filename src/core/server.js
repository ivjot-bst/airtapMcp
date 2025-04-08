/**
 * Core server functionality for Airtap MCP
 */

const express = require('express');
const http = require('http'); // Node.js HTTP module
const WebSocket = require('ws');
const bodyParser = require('body-parser');
const { verifyTokenMiddleware } = require('../utils/auth');
const { registerApiRoutes } = require('../api/routes');
const { registerTools } = require('./tools');
const { handleMcpConnection } = require('./mcp-handler');

/**
 * Starts the MCP server
 * @param {number} port - Port number to run the server on
 * @param {string} apiToken - API token for authentication
 * @param {object} logger - Winston logger instance
 * @returns {Promise} - Promise that resolves when server is started
 */
async function startServer(port, apiToken, logger) {
  // Create Express app
  const app = express();
  
  // Set up middleware
  app.use(bodyParser.json());
  app.use(verifyTokenMiddleware);
  
  // Register API routes
  registerApiRoutes(app, logger);
  
  // Create HTTP server
  const server = http.createServer(app);
  
  // Set up WebSocket server for MCP protocol
  const wss = new WebSocket.Server({ server });
  
  // Register available tools
  const tools = registerTools(apiToken, logger);
  
  // Handle WebSocket connections
  wss.on('connection', (ws) => {
    logger.info('New MCP client connected');
    handleMcpConnection(ws, tools, logger);
  });
  
  // Start server
  return new Promise((resolve) => {
    server.listen(port, () => {
      logger.info(`Airtap MCP server running on port ${port}`);
      resolve(server);
    });
  });
}

module.exports = {
  startServer
};
