/**
 * MCP Protocol Handler
 * Handles MCP protocol connections and message processing
 */

const { v4: uuidv4 } = require('uuid');

/**
 * Handles MCP WebSocket connections
 * @param {WebSocket} ws - WebSocket connection
 * @param {Object} tools - Available tools object
 * @param {Object} logger - Winston logger instance
 */
function handleMcpConnection(ws, tools, logger) {
  ws.id = uuidv4();
  logger.debug(`New connection established: ${ws.id}`);
  
  // Set up session data
  const session = {
    id: ws.id,
    activeTasks: new Map(),
    activeRequests: new Map()
  };

  // Handle incoming messages
  ws.on('message', async (message) => {
    try {
      const data = JSON.parse(message);
      logger.debug(`Received message from client ${ws.id}: ${JSON.stringify(data)}`);
      
      // Handle different message types
      switch (data.type) {
        case 'ping':
          handlePing(ws);
          break;
          
        case 'list_tools':
          handleListTools(ws, tools);
          break;
          
        case 'run_tool':
          await handleRunTool(ws, tools, data, session, logger);
          break;
          
        case 'cancel_request':
          handleCancelRequest(ws, data, session, logger);
          break;
          
        default:
          sendError(ws, `Unknown message type: ${data.type}`, data.id);
      }
    } catch (error) {
      logger.error(`Error processing message: ${error.message}`);
      sendError(ws, `Error processing message: ${error.message}`);
    }
  });

  // Handle connection close
  ws.on('close', () => {
    logger.info(`Client disconnected: ${ws.id}`);
    // Clean up any resources associated with this connection
    cleanupSession(session, logger);
  });

  // Handle errors
  ws.on('error', (error) => {
    logger.error(`WebSocket error for client ${ws.id}: ${error.message}`);
  });

  // Send initial welcome message with server info
  sendServerInfo(ws);
}

/**
 * Handle ping messages
 * @param {WebSocket} ws - WebSocket connection
 */
function handlePing(ws) {
  ws.send(JSON.stringify({
    type: 'pong',
    timestamp: Date.now()
  }));
}

/**
 * Send server information to client
 * @param {WebSocket} ws - WebSocket connection
 */
function sendServerInfo(ws) {
  ws.send(JSON.stringify({
    type: 'server_info',
    server: 'airtap-mcp',
    version: '1.0.0',
    protocol: 'mcp-v1'
  }));
}

/**
 * Handle list_tools request
 * @param {WebSocket} ws - WebSocket connection
 * @param {Object} tools - Available tools object
 */
function handleListTools(ws, tools) {
  const toolsList = Object.keys(tools).map(name => ({
    name,
    description: tools[name].description,
    parameters: tools[name].parameters
  }));
  
  ws.send(JSON.stringify({
    type: 'tools_list',
    tools: toolsList
  }));
}

/**
 * Handle tool execution request
 * @param {WebSocket} ws - WebSocket connection
 * @param {Object} tools - Available tools object
 * @param {Object} data - Request data
 * @param {Object} session - Session data
 * @param {Object} logger - Winston logger instance
 */
async function handleRunTool(ws, tools, data, session, logger) {
  const { id, tool, params } = data;
  
  if (!id) {
    return sendError(ws, 'Missing request ID', null);
  }
  
  if (!tool) {
    return sendError(ws, 'Missing tool name', id);
  }
  
  if (!tools[tool]) {
    return sendError(ws, `Unknown tool: ${tool}`, id);
  }
  
  // Track active request
  session.activeRequests.set(id, { tool, params, timestamp: Date.now() });
  
  try {
    // Send acknowledge message
    ws.send(JSON.stringify({
      type: 'request_received',
      id,
      tool
    }));
    
    // Execute tool
    logger.debug(`Executing tool ${tool} with params: ${JSON.stringify(params)}`);
    
    const result = await tools[tool].handler(params, session);
    
    // Send success response
    ws.send(JSON.stringify({
      type: 'tool_response',
      id,
      tool,
      status: 'success',
      result
    }));
    
  } catch (error) {
    logger.error(`Error executing tool ${tool}: ${error.message}`);
    sendError(ws, error.message, id);
  } finally {
    // Remove from active requests
    session.activeRequests.delete(id);
  }
}

/**
 * Handle cancel request
 * @param {WebSocket} ws - WebSocket connection
 * @param {Object} data - Request data
 * @param {Object} session - Session data
 * @param {Object} logger - Winston logger instance
 */
function handleCancelRequest(ws, data, session, logger) {
  const { id } = data;
  
  if (!id) {
    return sendError(ws, 'Missing request ID', null);
  }
  
  const request = session.activeRequests.get(id);
  if (!request) {
    return sendError(ws, `Request with ID ${id} not found`, id);
  }
  
  // Mark as cancelled - actual cancellation depends on the tool implementation
  logger.info(`Request ${id} cancelled by client`);
  
  ws.send(JSON.stringify({
    type: 'request_cancelled',
    id
  }));
  
  session.activeRequests.delete(id);
}

/**
 * Send error message to client
 * @param {WebSocket} ws - WebSocket connection
 * @param {string} message - Error message
 * @param {string} id - Request ID
 */
function sendError(ws, message, id) {
  ws.send(JSON.stringify({
    type: 'error',
    id,
    message
  }));
}

/**
 * Clean up session resources
 * @param {Object} session - Session data
 * @param {Object} logger - Winston logger instance
 */
function cleanupSession(session, logger) {
  // Cancel any active tasks
  for (const [taskId, task] of session.activeTasks.entries()) {
    logger.debug(`Cleaning up task ${taskId} due to client disconnect`);
    // Implement task cleanup logic here
  }
  
  session.activeTasks.clear();
  session.activeRequests.clear();
}

module.exports = {
  handleMcpConnection
};
