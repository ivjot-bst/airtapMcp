/**
 * Instagram Testing Example with Airtap MCP
 * This example demonstrates how to use Airtap to automate a simple Instagram scenario:
 * 1. Open Instagram
 * 2. Search for a hashtag
 * 3. Like the first 5 posts
 */

const WebSocket = require('ws');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

// Configuration
const API_TOKEN = process.env.API_TOKEN;
const MCP_SERVER_URL = 'ws://localhost:3000';

// Check for API token
if (!API_TOKEN) {
  console.error('ERROR: API_TOKEN environment variable not set');
  console.error('Please set your Airtap API token in the .env file or as an environment variable');
  process.exit(1);
}

// Connect to Airtap MCP server
console.log('Connecting to Airtap MCP server...');
const ws = new WebSocket(MCP_SERVER_URL);

// Counter for message IDs
let messageId = 1;

// Main execution logic
ws.on('open', async () => {
  console.log('Connected to Airtap MCP server');
  
  try {
    await sleep(1000); // Wait for connection to stabilize
    
    console.log('\n=== Instagram Testing Automation ===\n');
    
    // First check if Instagram is installed
    console.log('Checking if Instagram is installed...');
    const installedApps = await runTool('listApps', {});
    
    const instagramPackage = 'com.instagram.android';
    const isInstalled = installedApps.apps.some(app => app.packageName === instagramPackage);
    
    if (!isInstalled) {
      console.log('Instagram is not installed. Please install Instagram before running this test.');
      ws.close();
      return;
    }
    
    console.log('Instagram is installed. Proceeding with test...');
    
    // Go to home screen
    console.log('Navigating to home screen...');
    await runTool('navigateHome', {});
    await sleep(2000);
    
    // Submit high-level task for Instagram automation
    console.log('Starting Instagram automation task...');
    const taskResult = await runTool('submit_task', {
      task: 'Open Instagram, search for #travel, and like the first 5 posts',
      precisionMode: true,
      navigateToHome: true,
      maxSteps: 30
    });
    
    const taskId = taskResult.taskId;
    console.log(`Task submitted with ID: ${taskId}`);
    
    // Poll for task status until completed or failed
    await monitorTask(taskId);
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    ws.close();
  }
});

// Handle WebSocket messages
ws.on('message', (data) => {
  const message = JSON.parse(data);
  
  // Log message if it's not a response to our tool execution
  if (message.type !== 'tool_response' && message.type !== 'request_received') {
    console.log('Received message:', message);
  }
});

// Handle WebSocket errors
ws.on('error', (error) => {
  console.error('WebSocket error:', error.message);
});

// Handle WebSocket close
ws.on('close', () => {
  console.log('Disconnected from Airtap MCP server');
  process.exit(0);
});

/**
 * Run an MCP tool
 * @param {string} tool - Tool name
 * @param {object} params - Tool parameters
 * @returns {Promise<object>} - Tool execution result
 */
async function runTool(tool, params) {
  return new Promise((resolve, reject) => {
    const id = String(messageId++);
    
    // Set up message handler for this request
    const messageHandler = (data) => {
      const message = JSON.parse(data);
      
      if (message.id === id && message.type === 'tool_response') {
        // Remove this listener once we get our response
        ws.removeListener('message', messageHandler);
        
        if (message.status === 'success') {
          resolve(message.result);
        } else {
          reject(new Error(`Tool execution failed: ${JSON.stringify(message.error)}`));
        }
      }
      
      // Log progress messages for task status
      if (tool === 'get_task_status' && message.type === 'task_progress') {
        console.log(`Task progress: ${message.progress}%`);
      }
    };
    
    // Add specific message handler for this request
    ws.addListener('message', messageHandler);
    
    // Send tool execution request
    ws.send(JSON.stringify({
      id,
      type: 'run_tool',
      tool,
      params
    }));
    
    // Set timeout to prevent hanging
    setTimeout(() => {
      ws.removeListener('message', messageHandler);
      reject(new Error(`Timeout waiting for ${tool} response`));
    }, 60000);
  });
}

/**
 * Monitor a task until it's completed or failed
 * @param {string} taskId - Task ID to monitor
 * @returns {Promise<void>}
 */
async function monitorTask(taskId) {
  console.log('Monitoring task progress...');
  
  let isCompleted = false;
  let attemptCount = 0;
  const maxAttempts = 30; // Maximum polling attempts
  
  while (!isCompleted && attemptCount < maxAttempts) {
    await sleep(5000); // Poll every 5 seconds
    
    try {
      const status = await runTool('get_task_status', { taskId });
      console.log(`Task status: ${status.status}`);
      
      if (status.status === 'completed') {
        console.log('Task completed successfully!');
        isCompleted = true;
      } else if (status.status === 'failed' || status.status === 'cancelled') {
        console.log(`Task ${status.status}. Reason: ${status.reason || 'unknown'}`);
        isCompleted = true;
      } else if (status.status === 'waiting_for_input') {
        console.log('Task is waiting for human input.');
        
        // For demo purposes, we'll just provide a generic input
        // In a real scenario, you might want to implement specific logic based on what the task is waiting for
        await runTool('provide_human_input', {
          taskId,
          input: 'Please continue with the next step'
        });
        
        console.log('Human input provided.');
      }
      
      // If task is running, display current step
      if (status.progress && status.progress.currentStep) {
        console.log(`Current step: ${status.progress.currentStep} of ${status.progress.totalSteps}`);
      }
      
      attemptCount++;
    } catch (error) {
      console.error('Error checking task status:', error.message);
      attemptCount++;
    }
  }
  
  if (!isCompleted) {
    console.log('Task monitoring timed out. The task may still be running.');
  }
}

/**
 * Sleep for specified milliseconds
 * @param {number} ms - Milliseconds to sleep
 * @returns {Promise<void>}
 */
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Handle application termination
process.on('SIGINT', () => {
  console.log('\nTerminating...');
  ws.close();
  process.exit(0);
});
