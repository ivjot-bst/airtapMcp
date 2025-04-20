#!/usr/bin/env node

/**
 * Airtap MCP Server
 * Main entry point for the Airtap MCP server
 */

const dotenv = require('dotenv');
const path = require('path');
const { Command } = require('commander');
const winston = require('winston');
const { validateApiToken } = require('./utils/auth');
const { startServer } = require('./core/server');
const packageJson = require('../package.json');

// Load environment variables from .env file if present
dotenv.config();

// Configure logger
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(({ level, message, timestamp }) => {
      return `${timestamp} ${level}: ${message}`;
    })
  ),
  transports: [
    new winston.transports.Console()
  ],
});

// Setup command line interface
const program = new Command();

program
  .name('airtap-mcp')
  .description('Airtap Model Context Protocol (MCP) server for Android automation')
  .version(packageJson.version)
  .option('-p, --port <number>', 'Port to run the server on', '3000')
  .option('-t, --token <string>', 'API token for authentication')
  .option('-d, --debug', 'Enable debug mode', false)
  .action(async (options) => {
    try {
      // Set debug mode if specified
      if (options.debug) {
        logger.level = 'debug';
        logger.debug('Debug mode enabled');
      }

      // Get API token from command line or environment variable
      const apiToken = options.token || process.env.API_TOKEN;
      
      if (!apiToken) {
        logger.error('API token is required. Please provide it via --token option or API_TOKEN environment variable.');
        process.exit(1);
      }

      // Validate API token
      try {
        await validateApiToken(apiToken);
        logger.info('API token validated successfully');
      } catch (error) {
        logger.error(`API token validation failed: ${error.message}`);
        process.exit(1);
      }

      // Start MCP server
      const port = parseInt(options.port, 10);
      await startServer(port, apiToken, logger);
      
    } catch (error) {
      logger.error(`Error starting server: ${error.message}`);
      process.exit(1);
    }
  });

program.parse(process.argv);
