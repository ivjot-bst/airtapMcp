/**
 * Tools Registration
 * Registers all available tools for the MCP server
 */

const androidInteractionTools = require('../services/android-interaction');
const taskManagementTools = require('../services/task-management');

/**
 * Register all available tools
 * @param {string} apiToken - API token for authentication
 * @param {object} logger - Winston logger instance
 * @returns {object} - Object containing all registered tools
 */
function registerTools(apiToken, logger) {
  // Tool definitions for MCP protocol
const tools = {};
  
  // Register Android Interaction (Low-Level) Tools
  registerToolGroup(tools, androidInteractionTools(apiToken, logger));
  
  // Register Task Management (High-Level) Tools
  registerToolGroup(tools, taskManagementTools(apiToken, logger));
  
  logger.info(`Registered ${Object.keys(tools).length} tools`);
  
  return tools;
}

/**
 * Register a group of tools
 * @param {object} tools - Tools object to register into
 * @param {object} toolGroup - Group of tools to register
 */
function registerToolGroup(tools, toolGroup) {
  for (const [name, tool] of Object.entries(toolGroup)) {
    tools[name] = {
      name,
      description: tool.description,
      parameters: tool.parameters,
      handler: tool.handler
    };
  }
}

module.exports = {
  registerTools
};
