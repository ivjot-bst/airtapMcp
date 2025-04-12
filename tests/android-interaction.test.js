/**
 * Tests for Android Interaction Tools
 */

const androidInteractionTools = require('../src/services/android-interaction');

// Mock axios
jest.mock('axios', () => ({
  create: jest.fn().mockReturnValue({
    get: jest.fn(),
    post: jest.fn()
  })
}));

// Mock logger
const mockLogger = {
  info: jest.fn(),
  error: jest.fn(),
  debug: jest.fn()
};

describe('Android Interaction Tools', () => {
  let tools;
  const mockApiToken = 'test-api-token'; // Test credential
  const mockSession = { id: 'test-session' };
  
  beforeEach(() => {
    jest.clearAllMocks();
    tools = androidInteractionTools(mockApiToken, mockLogger);
  });
  
  describe('tap tool', () => {
    test('should validate coordinates parameter', async () => {
      // Missing coordinates
      await expect(tools.tap.handler({}, mockSession))
        .rejects.toThrow('Invalid coordinates');
        
      // Invalid coordinates format
      await expect(tools.tap.handler({ coordinates: 'invalid' }, mockSession))
        .rejects.toThrow('Invalid coordinates');
        
      // Wrong array length
      await expect(tools.tap.handler({ coordinates: [100] }, mockSession))
        .rejects.toThrow('Invalid coordinates');
    });
    
    test('should successfully call tap with valid parameters', async () => {
      const params = { coordinates: [100, 200] };
      const result = await tools.tap.handler(params, mockSession);
      
      expect(result).toEqual(expect.objectContaining({
        success: true,
        action: 'tap',
        coordinates: [100, 200]
      }));
      
      expect(mockLogger.debug).toHaveBeenCalledWith(expect.stringContaining('tap'));
    });
  });
  
  describe('inputText tool', () => {
    test('should validate text parameter', async () => {
      // Missing text
      await expect(tools.inputText.handler({ coordinates: [100, 200] }, mockSession))
        .rejects.toThrow('Text parameter is required');
    });
    
    test('should validate coordinates parameter', async () => {
      // Missing coordinates
      await expect(tools.inputText.handler({ text: 'Hello' }, mockSession))
        .rejects.toThrow('Invalid coordinates');
        
      // Invalid coordinates format
      await expect(tools.inputText.handler({ text: 'Hello', coordinates: 'invalid' }, mockSession))
        .rejects.toThrow('Invalid coordinates');
        
      // Wrong array length
      await expect(tools.inputText.handler({ text: 'Hello', coordinates: [100] }, mockSession))
        .rejects.toThrow('Invalid coordinates');
    });
    
    test('should successfully call inputText with valid parameters', async () => {
      const params = { text: 'Hello World', coordinates: [100, 200] };
      const result = await tools.inputText.handler(params, mockSession);
      
      expect(result).toEqual(expect.objectContaining({
        success: true,
        action: 'inputText',
        text: 'Hello World',
        coordinates: [100, 200]
      }));
      
      expect(mockLogger.debug).toHaveBeenCalledWith(expect.stringContaining('inputText'));
    });
  });
  
  // Add more tests for other tools...
});
