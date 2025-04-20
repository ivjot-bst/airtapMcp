/**
 * Basic Airtap MCP Client Example
 * Demonstrates how to connect to and use the Airtap MCP server
 */

const WebSocket = require('ws');
const readline = require('readline');

// Configuration
const MCP_SERVER_URL = 'ws://localhost:3000';
const API_TOKEN = process.env.API_TOKEN || 'your-api-token-here';

// Create readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Create WebSocket connection
const ws = new WebSocket(MCP_SERVER_URL);

// Message ID counter
let messageId = 1;

// Active requests map
const activeRequests = new Map();

// Connect to WebSocket server
ws.on('open', () => {
  console.log('Connected to Airtap MCP server');
  
  // Request list of available tools
  sendMessage('list_tools');
  
  // Start command prompt
  promptCommand();
});

// Handle incoming messages
ws.on('message', (data) => {
  try {
    const message = JSON.parse(data);
    handleMessage(message);
  } catch (error) {
    console.error('Error parsing message:', error);
  }
});

// Handle WebSocket errors
ws.on('error', (error) => {
  console.error('WebSocket error:', error);
});

// Handle WebSocket close
ws.on('close', () => {
  console.log('Disconnected from Airtap MCP server');
  rl.close();
  process.exit(0);
});

/**
 * Send message to MCP server
 * @param {string} type - Message type
 * @param {object} params - Message parameters
 * @returns {number} - Message ID
 */
function sendMessage(type, params = {}) {
  const id = `${messageId++}`;
  
  const message = {
    id,
    type
  };
  
  if (type === 'run_tool') {
    message.tool = params.tool;
    message.params = params.params;
  } else {
    Object.assign(message, params);
  }
  
  ws.send(JSON.stringify(message));
  console.log(`> Sent ${type} message (ID: ${id})`);
  
  return id;
}

/**
 * Handle incoming message
 * @param {object} message - Received message
 */
function handleMessage(message) {
  const { type, id } = message;
  
  console.log(`< Received ${type} message` + (id ? ` (ID: ${id})` : ''));
  
  switch (type) {
    case 'server_info':
      console.log(`Server: ${message.server} (${message.version})`);
      console.log(`Protocol: ${message.protocol}`);
      break;
      
    case 'tools_list':
      console.log('Available tools:');
      message.tools.forEach(tool => {
        console.log(`- ${tool.name}: ${tool.description}`);
      });
      break;
      
    case 'request_received':
      console.log(`Request received for tool: ${message.tool}`);
      break;
      
    case 'tool_response':
      console.log(`Tool execution completed: ${message.tool}`);
      console.log('Result:', JSON.stringify(message.result, null, 2));
      break;
      
    case 'error':
      console.error(`Error:`, message.message);
      break;
      
    default:
      console.log('Unknown message type:', type);
      console.log('Message:', JSON.stringify(message, null, 2));
  }
  
  // Prompt for next command after receiving a message
  promptCommand();
}

/**
 * Prompt user for command
 */
function promptCommand() {
  rl.question('\nEnter command (tools, tap, input, swipe, back, home, submit, status, exit): ', (command) => {
    handleCommand(command.trim().toLowerCase());
  });
}

/**
 * Handle user command
 * @param {string} command - Command string
 */
function handleCommand(command) {
  switch (command) {
    case 'tools':
      sendMessage('list_tools');
      break;
      
    case 'tap':
      rl.question('Enter coordinates (x,y): ', (input) => {
        const [x, y] = input.split(',').map(num => parseInt(num.trim(), 10));
        
        if (isNaN(x) || isNaN(y)) {
          console.error('Invalid coordinates');
          promptCommand();
          return;
        }
        
        sendMessage('run_tool', {
          tool: 'tap',
          params: {
            coordinates: [x, y]
          }
        });
      });
      break;
      
    case 'input':
      rl.question('Enter coordinates (x,y): ', (coordsInput) => {
        const [x, y] = coordsInput.split(',').map(num => parseInt(num.trim(), 10));
        
        if (isNaN(x) || isNaN(y)) {
          console.error('Invalid coordinates');
          promptCommand();
          return;
        }
        
        rl.question('Enter text: ', (text) => {
          sendMessage('run_tool', {
            tool: 'inputText',
            params: {
              coordinates: [x, y],
              text
            }
          });
        });
      });
      break;
      
    case 'swipe':
      rl.question('Enter start coordinates (x1,y1): ', (startInput) => {
        const [x1, y1] = startInput.split(',').map(num => parseInt(num.trim(), 10));
        
        if (isNaN(x1) || isNaN(y1)) {
          console.error('Invalid start coordinates');
          promptCommand();
          return;
        }
        
        rl.question('Enter end coordinates (x2,y2): ', (endInput) => {
          const [x2, y2] = endInput.split(',').map(num => parseInt(num.trim(), 10));
          
          if (isNaN(x2) || isNaN(y2)) {
            console.error('Invalid end coordinates');
            promptCommand();
            return;
          }
          
          rl.question('Enter duration (ms): ', (durationInput) => {
            const duration = parseInt(durationInput.trim(), 10) || 300;
            
            sendMessage('run_tool', {
              tool: 'swipe',
              params: {
                start: [x1, y1],
                end: [x2, y2],
                duration
              }
            });
          });
        });
      });
      break;
      
    case 'back':
      sendMessage('run_tool', {
        tool: 'navigateBack',
        params: {}
      });
      break;
      
    case 'home':
      sendMessage('run_tool', {
        tool: 'navigateHome',
        params: {}
      });
      break;
      
    case 'submit':
      rl.question('Enter task description: ', (task) => {
        rl.question('Enable precision mode? (y/n): ', (precisionInput) => {
          const precisionMode = precisionInput.trim().toLowerCase() === 'y';
          
          sendMessage('run_tool', {
            tool: 'submit_task',
            params: {
              task,
              precisionMode,
              navigateToHome: true
            }
          });
        });
      });
      break;
      
    case 'status':
      rl.question('Enter task ID: ', (taskId) => {
        sendMessage('run_tool', {
          tool: 'get_task_status',
          params: {
            taskId
          }
        });
      });
      break;
      
    case 'exit':
      console.log('Exiting...');
      ws.close();
      rl.close();
      process.exit(0);
      break;
      
    default:
      console.log('Unknown command. Available commands:');
      console.log('- tools: List available tools');
      console.log('- tap: Tap at specific coordinates');
      console.log('- input: Input text at coordinates');
      console.log('- swipe: Perform swipe gesture');
      console.log('- back: Press back button');
      console.log('- home: Go to home screen');
      console.log('- submit: Submit a new automation task');
      console.log('- status: Check task status');
      console.log('- exit: Exit the client');
      promptCommand();
  }
}

// Handle process termination
process.on('SIGINT', () => {
  console.log('\nExiting...');
  ws.close();
  rl.close();
  process.exit(0);
});
