/**
 * Android Interaction Services
 * Implements low-level Android OS interaction tools
 */

const axios = require('axios');

/**
 * Creates and returns Android interaction tools
 * @param {string} apiToken - API token for authentication
 * @param {object} logger - Winston logger instance
 * @returns {object} - Object containing registered tools
 */
function androidInteractionTools(apiToken, logger) {
  // Airtap API base URL
  const AIRTAP_API_BASE = 'https://api.airtap.ai';
  
  // Create HTTP client with authentication
  const apiClient = axios.create({
    baseURL: AIRTAP_API_BASE,
    headers: {
      'Authorization': `Bearer ${apiToken}`,
      'Content-Type': 'application/json'
    }
  });
  
  // Define tools
  return {
    // Tap at specific coordinates
    tap: {
      description: 'Tap at specific coordinates on the device screen',
      parameters: {
        coordinates: {
          type: 'array',
          description: 'X and Y coordinates to tap [x, y]',
          required: true
        }
      },
      handler: async (params, session) => {
        logger.debug(`Executing tap at coordinates: ${params.coordinates}`);
        
        try {
          // Validate parameters
          if (!params.coordinates || !Array.isArray(params.coordinates) || params.coordinates.length !== 2) {
            throw new Error('Invalid coordinates. Must be an array [x, y]');
          }
          
          const [x, y] = params.coordinates;
          
          // In a real implementation, call Airtap API to execute tap
          // For now, simulate API call
          const response = await simulateApiCall('tap', {
            x, y,
            deviceId: params.deviceId || 'default'
          });
          
          return {
            success: true,
            action: 'tap',
            coordinates: [x, y],
            screenshot: response.screenshot
          };
        } catch (error) {
          logger.error(`Error executing tap: ${error.message}`);
          throw error;
        }
      }
    },
    
    // Input text at coordinates
    inputText: {
      description: 'Type text at specified coordinates',
      parameters: {
        text: {
          type: 'string',
          description: 'Text to input',
          required: true
        },
        coordinates: {
          type: 'array',
          description: 'X and Y coordinates to tap before inputting text [x, y]',
          required: true
        }
      },
      handler: async (params, session) => {
        logger.debug(`Executing inputText: "${params.text}" at coordinates: ${params.coordinates}`);
        
        try {
          // Validate parameters
          if (!params.text) {
            throw new Error('Text parameter is required');
          }
          
          if (!params.coordinates || !Array.isArray(params.coordinates) || params.coordinates.length !== 2) {
            throw new Error('Invalid coordinates. Must be an array [x, y]');
          }
          
          const [x, y] = params.coordinates;
          
          // In a real implementation, call Airtap API to execute text input
          // For now, simulate API call
          const response = await simulateApiCall('inputText', {
            text: params.text,
            x, y,
            deviceId: params.deviceId || 'default'
          });
          
          return {
            success: true,
            action: 'inputText',
            text: params.text,
            coordinates: [x, y],
            screenshot: response.screenshot
          };
        } catch (error) {
          logger.error(`Error executing inputText: ${error.message}`);
          throw error;
        }
      }
    },
    
    // Clear text from input field
    clearText: {
      description: 'Clear text from input field',
      parameters: {
        noOfChars: {
          type: 'number',
          description: 'Number of characters to clear',
          required: true
        },
        coordinates: {
          type: 'array',
          description: 'X and Y coordinates of the input field [x, y]',
          required: true
        }
      },
      handler: async (params, session) => {
        logger.debug(`Executing clearText: ${params.noOfChars} chars at coordinates: ${params.coordinates}`);
        
        try {
          // Validate parameters
          if (typeof params.noOfChars !== 'number' || params.noOfChars <= 0) {
            throw new Error('noOfChars must be a positive number');
          }
          
          if (!params.coordinates || !Array.isArray(params.coordinates) || params.coordinates.length !== 2) {
            throw new Error('Invalid coordinates. Must be an array [x, y]');
          }
          
          const [x, y] = params.coordinates;
          
          // In a real implementation, call Airtap API to clear text
          // For now, simulate API call
          const response = await simulateApiCall('clearText', {
            noOfChars: params.noOfChars,
            x, y,
            deviceId: params.deviceId || 'default'
          });
          
          return {
            success: true,
            action: 'clearText',
            noOfChars: params.noOfChars,
            coordinates: [x, y]
          };
        } catch (error) {
          logger.error(`Error executing clearText: ${error.message}`);
          throw error;
        }
      }
    },
    
    // Swipe gesture
    swipe: {
      description: 'Perform swipe gesture on the device screen',
      parameters: {
        start: {
          type: 'array',
          description: 'Starting X and Y coordinates [x1, y1]',
          required: true
        },
        end: {
          type: 'array',
          description: 'Ending X and Y coordinates [x2, y2]',
          required: true
        },
        duration: {
          type: 'number',
          description: 'Duration of swipe in milliseconds',
          required: false,
          default: 300
        }
      },
      handler: async (params, session) => {
        logger.debug(`Executing swipe from ${params.start} to ${params.end} (duration: ${params.duration || 300}ms)`);
        
        try {
          // Validate parameters
          if (!params.start || !Array.isArray(params.start) || params.start.length !== 2) {
            throw new Error('Invalid start coordinates. Must be an array [x1, y1]');
          }
          
          if (!params.end || !Array.isArray(params.end) || params.end.length !== 2) {
            throw new Error('Invalid end coordinates. Must be an array [x2, y2]');
          }
          
          const [x1, y1] = params.start;
          const [x2, y2] = params.end;
          const duration = params.duration || 300;
          
          // In a real implementation, call Airtap API to execute swipe
          // For now, simulate API call
          const response = await simulateApiCall('swipe', {
            x1, y1, x2, y2, duration,
            deviceId: params.deviceId || 'default'
          });
          
          return {
            success: true,
            action: 'swipe',
            start: [x1, y1],
            end: [x2, y2],
            duration
          };
        } catch (error) {
          logger.error(`Error executing swipe: ${error.message}`);
          throw error;
        }
      }
    },
    
    // Navigate back
    navigateBack: {
      description: 'Press the Android back button',
      parameters: {},
      handler: async (params, session) => {
        logger.debug('Executing navigateBack');
        
        try {
          // In a real implementation, call Airtap API to press back button
          // For now, simulate API call
          const response = await simulateApiCall('navigateBack', {
            deviceId: params.deviceId || 'default'
          });
          
          return {
            success: true,
            action: 'navigateBack',
            screenshot: response.screenshot
          };
        } catch (error) {
          logger.error(`Error executing navigateBack: ${error.message}`);
          throw error;
        }
      }
    },
    
    // Navigate home
    navigateHome: {
      description: 'Go to home screen',
      parameters: {},
      handler: async (params, session) => {
        logger.debug('Executing navigateHome');
        
        try {
          // In a real implementation, call Airtap API to go to home screen
          // For now, simulate API call
          const response = await simulateApiCall('navigateHome', {
            deviceId: params.deviceId || 'default'
          });
          
          return {
            success: true,
            action: 'navigateHome',
            screenshot: response.screenshot
          };
        } catch (error) {
          logger.error(`Error executing navigateHome: ${error.message}`);
          throw error;
        }
      }
    },
    
    // Wait for specified seconds
    wait: {
      description: 'Wait for specified seconds',
      parameters: {
        seconds: {
          type: 'number',
          description: 'Number of seconds to wait',
          required: true
        }
      },
      handler: async (params, session) => {
        logger.debug(`Executing wait for ${params.seconds} seconds`);
        
        try {
          // Validate parameters
          if (typeof params.seconds !== 'number' || params.seconds <= 0) {
            throw new Error('seconds must be a positive number');
          }
          
          // Wait for specified duration
          await new Promise(resolve => setTimeout(resolve, params.seconds * 1000));
          
          return {
            success: true,
            action: 'wait',
            seconds: params.seconds
          };
        } catch (error) {
          logger.error(`Error executing wait: ${error.message}`);
          throw error;
        }
      }
    },
    
    // List installed apps
    listApps: {
      description: 'List all installed applications',
      parameters: {},
      handler: async (params, session) => {
        logger.debug('Executing listApps');
        
        try {
          // In a real implementation, call Airtap API to get installed apps
          // For now, simulate API call
          const response = await simulateApiCall('listApps', {
            deviceId: params.deviceId || 'default'
          });
          
          return {
            success: true,
            action: 'listApps',
            apps: response.apps
          };
        } catch (error) {
          logger.error(`Error executing listApps: ${error.message}`);
          throw error;
        }
      }
    },
    
    // Uninstall app
    uninstallApp: {
      description: 'Uninstall an application by package name',
      parameters: {
        packageName: {
          type: 'string',
          description: 'Package name of the app to uninstall',
          required: true
        }
      },
      handler: async (params, session) => {
        logger.debug(`Executing uninstallApp for package: ${params.packageName}`);
        
        try {
          // Validate parameters
          if (!params.packageName) {
            throw new Error('packageName is required');
          }
          
          // In a real implementation, call Airtap API to uninstall app
          // For now, simulate API call
          const response = await simulateApiCall('uninstallApp', {
            packageName: params.packageName,
            deviceId: params.deviceId || 'default'
          });
          
          return {
            success: true,
            action: 'uninstallApp',
            packageName: params.packageName,
            status: response.status
          };
        } catch (error) {
          logger.error(`Error executing uninstallApp: ${error.message}`);
          throw error;
        }
      }
    },
    
    // Long press
    longpress: {
      description: 'Long press at coordinates',
      parameters: {
        coordinates: {
          type: 'array',
          description: 'X and Y coordinates to long press [x, y]',
          required: true
        },
        duration: {
          type: 'number',
          description: 'Duration of long press in milliseconds',
          required: false,
          default: 1000
        }
      },
      handler: async (params, session) => {
        logger.debug(`Executing longpress at coordinates: ${params.coordinates} (duration: ${params.duration || 1000}ms)`);
        
        try {
          // Validate parameters
          if (!params.coordinates || !Array.isArray(params.coordinates) || params.coordinates.length !== 2) {
            throw new Error('Invalid coordinates. Must be an array [x, y]');
          }
          
          const [x, y] = params.coordinates;
          const duration = params.duration || 1000;
          
          // In a real implementation, call Airtap API to execute long press
          // For now, simulate API call
          const response = await simulateApiCall('longpress', {
            x, y, duration,
            deviceId: params.deviceId || 'default'
          });
          
          return {
            success: true,
            action: 'longpress',
            coordinates: [x, y],
            duration,
            screenshot: response.screenshot
          };
        } catch (error) {
          logger.error(`Error executing longpress: ${error.message}`);
          throw error;
        }
      }
    }
  };
}

/**
 * Simulate API call to Airtap API (for development/testing)
 * @param {string} action - Action to simulate
 * @param {object} params - Parameters for the action
 * @returns {Promise} - Promise that resolves to simulated response
 */
async function simulateApiCall(action, params) {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 200));
  
  // Generate mock response based on action
  switch (action) {
    case 'tap':
    case 'inputText':
    case 'navigateBack':
    case 'navigateHome':
    case 'longpress':
      return {
        success: true,
        screenshot: 'base64_encoded_screenshot_data...'
      };
      
    case 'clearText':
    case 'swipe':
      return {
        success: true
      };
      
    case 'listApps':
      return {
        success: true,
        apps: [
          { packageName: 'com.android.chrome', appName: 'Chrome' },
          { packageName: 'com.google.android.gm', appName: 'Gmail' },
          { packageName: 'com.instagram.android', appName: 'Instagram' },
          { packageName: 'com.spotify.music', appName: 'Spotify' },
          { packageName: 'org.telegram.messenger', appName: 'Telegram' }
        ]
      };
      
    case 'uninstallApp':
      return {
        success: true,
        status: 'uninstalled'
      };
      
    default:
      throw new Error(`Unknown action: ${action}`);
  }
}

module.exports = androidInteractionTools;
