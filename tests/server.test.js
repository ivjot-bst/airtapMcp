/**
 * Tests for Airtap MCP server
 */

const { startServer } = require('../src/core/server');

// Mock dependencies
jest.mock('../src/utils/auth', () => ({
  verifyTokenMiddleware: jest.fn((req, res, next) => next()),
  validateApiToken: jest.fn().mockResolvedValue({ valid: true })
}));

jest.mock('../src/api/routes', () => ({
  registerApiRoutes: jest.fn()
}));

jest.mock('../src/core/tools', () => ({
  registerTools: jest.fn().mockReturnValue({})
}));

jest.mock('ws', () => {
  return {
    Server: jest.fn().mockImplementation(() => {
      return {
        on: jest.fn()
      };
    })
  };
});

// Mock logger
const mockLogger = {
  info: jest.fn(),
  error: jest.fn(),
  debug: jest.fn()
};

describe('MCP Server', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  test('startServer should create and start HTTP server', async () => {
    // Mock http.createServer
    const mockServer = {
      listen: jest.fn((port, callback) => {
        callback();
        return mockServer;
      })
    };
    
    const http = require('http');
    const originalCreateServer = http.createServer;
    http.createServer = jest.fn().mockReturnValue(mockServer);
    
    try {
      // Call startServer
      const port = 3000;
      const apiToken = 'test-token';
      const server = await startServer(port, apiToken, mockLogger);
      
      // Verify server was created and started
      expect(http.createServer).toHaveBeenCalled();
      expect(mockServer.listen).toHaveBeenCalledWith(port, expect.any(Function));
      expect(mockLogger.info).toHaveBeenCalledWith(expect.stringContaining(`${port}`));
      expect(server).toBe(mockServer);
    } finally {
      // Restore original
      http.createServer = originalCreateServer;
    }
  });
});
