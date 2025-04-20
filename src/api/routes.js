/**
 * API Routes
 * Registers HTTP API routes for the Airtap MCP server
 */

/**
 * Register API routes for Express app
 * @param {object} app - Express app instance
 * @param {object} logger - Winston logger instance
 */
function registerApiRoutes(app, logger) {
  // Health check endpoint
  app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok' });
  });
  
  // Server info endpoint
  app.get('/info', (req, res) => {
    res.status(200).json({
      name: 'airtap-mcp',
      version: '1.0.0',
      description: 'Airtap Model Context Protocol server for Android automation'
    });
  });
  
  // API documentation endpoint
  app.get('/docs', (req, res) => {
    res.status(200).json({
      documentation: 'https://docs.airtap.ai/api-reference',
      githubRepo: 'https://github.com/airtap/airtap-mcp'
    });
  });
  
  // Register task management API routes
  app.use('/api/tasks', require('./tasks'));
  
  // Register device management API routes
  app.use('/api/devices', require('./devices'));
  
  // 404 handler for undefined routes
  app.use((req, res) => {
    logger.debug(`404 for ${req.method} ${req.path}`);
    res.status(404).json({ error: 'Not found' });
  });
  
  // Error handler
  app.use((err, req, res, next) => {
    logger.error(`API error: ${err.message}`);
    res.status(500).json({ error: 'Internal server error' });
  });
}

module.exports = {
  registerApiRoutes
};
