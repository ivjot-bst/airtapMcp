/**
 * Task Management Services
 * Implements high-level task management tools
 */

const axios = require('axios');
const { v4: uuidv4 } = require('uuid');

/**
 * Creates and returns task management tools
 * @param {string} apiToken - API token for authentication
 * @param {object} logger - Winston logger instance
 * @returns {object} - Object containing registered tools
 */
function taskManagementTools(apiToken, logger) {
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
  
  // Active tasks tracker (in-memory)
  const activeTasks = new Map();
  
  // Define tools
  return {
    // Submit a new automation task
    submit_task: {
      description: 'Submit a new automation task',
      parameters: {
        task: {
          type: 'string',
          description: 'The task description in natural language',
          required: true
        },
        precisionMode: {
          type: 'boolean',
          description: 'Whether to use precision mode for more accurate UI interactions',
          required: false,
          default: false
        },
        navigateToHome: {
          type: 'boolean',
          description: 'Whether to navigate to home screen before starting the task',
          required: false,
          default: true
        },
        maxSteps: {
          type: 'number',
          description: 'Maximum number of steps for the task execution',
          required: false,
          default: 30
        }
      },
      handler: async (params, session) => {
        logger.debug(`Submitting new task: "${params.task}"`);
        
        try {
          // Validate parameters
          if (!params.task) {
            throw new Error('Task description is required');
          }
          
          const precisionMode = params.precisionMode !== undefined ? params.precisionMode : false;
          const navigateToHome = params.navigateToHome !== undefined ? params.navigateToHome : true;
          const maxSteps = params.maxSteps || 30;
          
          // In a real implementation, call Airtap API to submit task
          // For now, simulate API call
          const taskId = uuidv4();
          const result = await simulateTaskApi('submitTask', {
            taskId,
            task: params.task,
            precisionMode,
            navigateToHome,
            maxSteps
          });
          
          // Store task information in session
          if (session) {
            if (!session.activeTasks) {
              session.activeTasks = new Map();
            }
            session.activeTasks.set(taskId, {
              taskId,
              task: params.task,
              status: 'pending',
              submitted: new Date().toISOString()
            });
          }
          
          // Also store in global active tasks
          activeTasks.set(taskId, {
            taskId,
            task: params.task,
            status: 'pending',
            submitted: new Date().toISOString()
          });
          
          return {
            taskId,
            status: 'pending',
            message: 'Task submitted successfully'
          };
        } catch (error) {
          logger.error(`Error submitting task: ${error.message}`);
          throw error;
        }
      }
    },
    
    // Get task status
    get_task_status: {
      description: 'Get task status and progress',
      parameters: {
        taskId: {
          type: 'string',
          description: 'The ID of the task to check',
          required: true
        }
      },
      handler: async (params, session) => {
        logger.debug(`Getting status for task: ${params.taskId}`);
        
        try {
          // Validate parameters
          if (!params.taskId) {
            throw new Error('Task ID is required');
          }
          
          // Check if task exists in session
          if (session && session.activeTasks && session.activeTasks.has(params.taskId)) {
            // Update task status from API in real implementation
          }
          
          // In a real implementation, call Airtap API to get task status
          // For now, simulate API call
          const result = await simulateTaskApi('getTaskStatus', {
            taskId: params.taskId
          });
          
          return result;
        } catch (error) {
          logger.error(`Error getting task status: ${error.message}`);
          throw error;
        }
      }
    },
    
    // List tasks
    list_tasks: {
      description: 'Get all tasks for the authenticated user',
      parameters: {
        status: {
          type: 'string',
          description: 'Filter tasks by status (pending, running, completed, failed, cancelled)',
          required: false
        },
        limit: {
          type: 'number',
          description: 'Maximum number of tasks to return',
          required: false,
          default: 10
        },
        offset: {
          type: 'number',
          description: 'Offset for pagination',
          required: false,
          default: 0
        }
      },
      handler: async (params, session) => {
        logger.debug(`Listing tasks with filters: ${JSON.stringify(params)}`);
        
        try {
          const status = params.status;
          const limit = params.limit || 10;
          const offset = params.offset || 0;
          
          // In a real implementation, call Airtap API to list tasks
          // For now, simulate API call
          const result = await simulateTaskApi('listTasks', {
            status,
            limit,
            offset
          });
          
          return result;
        } catch (error) {
          logger.error(`Error listing tasks: ${error.message}`);
          throw error;
        }
      }
    },
    
    // Provide human input to task
    provide_human_input: {
      description: 'Provide human input to an ongoing task',
      parameters: {
        input: {
          type: 'string',
          description: 'The human input to provide',
          required: true
        },
        taskId: {
          type: 'string',
          description: 'The ID of the task to provide input for',
          required: true
        }
      },
      handler: async (params, session) => {
        logger.debug(`Providing human input for task ${params.taskId}: "${params.input}"`);
        
        try {
          // Validate parameters
          if (!params.input) {
            throw new Error('Input is required');
          }
          
          if (!params.taskId) {
            throw new Error('Task ID is required');
          }
          
          // In a real implementation, call Airtap API to provide human input
          // For now, simulate API call
          const result = await simulateTaskApi('provideHumanInput', {
            taskId: params.taskId,
            input: params.input
          });
          
          // Update task status in session
          if (session && session.activeTasks && session.activeTasks.has(params.taskId)) {
            const taskInfo = session.activeTasks.get(params.taskId);
            taskInfo.status = 'running'; // After input, task usually goes back to running
            taskInfo.lastInput = params.input;
            taskInfo.lastInputTime = new Date().toISOString();
            session.activeTasks.set(params.taskId, taskInfo);
          }
          
          // Also update in global active tasks
          if (activeTasks.has(params.taskId)) {
            const taskInfo = activeTasks.get(params.taskId);
            taskInfo.status = 'running';
            taskInfo.lastInput = params.input;
            taskInfo.lastInputTime = new Date().toISOString();
            activeTasks.set(params.taskId, taskInfo);
          }
          
          return {
            taskId: params.taskId,
            status: 'running',
            message: 'Human input provided successfully'
          };
        } catch (error) {
          logger.error(`Error providing human input: ${error.message}`);
          throw error;
        }
      }
    },
    
    // Cancel task
    cancel_task: {
      description: 'Cancel a running task',
      parameters: {
        taskId: {
          type: 'string',
          description: 'The ID of the task to cancel',
          required: true
        }
      },
      handler: async (params, session) => {
        logger.debug(`Cancelling task: ${params.taskId}`);
        
        try {
          // Validate parameters
          if (!params.taskId) {
            throw new Error('Task ID is required');
          }
          
          // In a real implementation, call Airtap API to cancel task
          // For now, simulate API call
          const result = await simulateTaskApi('cancelTask', {
            taskId: params.taskId
          });
          
          // Update task status in session
          if (session && session.activeTasks && session.activeTasks.has(params.taskId)) {
            const taskInfo = session.activeTasks.get(params.taskId);
            taskInfo.status = 'cancelled';
            taskInfo.cancelledAt = new Date().toISOString();
            session.activeTasks.set(params.taskId, taskInfo);
          }
          
          // Also update in global active tasks
          if (activeTasks.has(params.taskId)) {
            const taskInfo = activeTasks.get(params.taskId);
            taskInfo.status = 'cancelled';
            taskInfo.cancelledAt = new Date().toISOString();
            activeTasks.set(params.taskId, taskInfo);
          }
          
          return {
            taskId: params.taskId,
            status: 'cancelled',
            message: 'Task cancelled successfully'
          };
        } catch (error) {
          logger.error(`Error cancelling task: ${error.message}`);
          throw error;
        }
      }
    }
  };
}

/**
 * Simulate task API calls (for development/testing)
 * @param {string} action - Action to simulate
 * @param {object} params - Parameters for the action
 * @returns {Promise} - Promise that resolves to simulated response
 */
async function simulateTaskApi(action, params) {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // Generate mock response based on action
  switch (action) {
    case 'submitTask':
      return {
        taskId: params.taskId,
        status: 'pending',
        createdAt: new Date().toISOString()
      };
      
    case 'getTaskStatus': {
      // Generate a random status
      const statuses = ['pending', 'running', 'waiting_for_input', 'completed', 'failed'];
      const statusIndex = Math.floor(Math.random() * statuses.length);
      const status = statuses[statusIndex];
      
      // Generate a random number of steps
      const totalSteps = Math.floor(Math.random() * 20) + 5;
      const currentStep = Math.min(Math.floor(Math.random() * totalSteps) + 1, totalSteps);
      
      // Generate random steps
      const steps = [];
      for (let i = 1; i <= totalSteps; i++) {
        const stepStatus = i < currentStep ? 'completed' : 
                          i === currentStep ? (status === 'running' ? 'in_progress' : status) : 
                          'pending';
        
        steps.push({
          step: i,
          action: `Step ${i} of the task`,
          status: stepStatus,
          timestamp: new Date(Date.now() - (totalSteps - i) * 10000).toISOString()
        });
      }
      
      return {
        taskId: params.taskId,
        status,
        progress: {
          currentStep,
          totalSteps
        },
        steps,
        createdAt: new Date(Date.now() - totalSteps * 10000).toISOString(),
        updatedAt: new Date().toISOString(),
        waitingForInput: status === 'waiting_for_input',
        inputPrompt: status === 'waiting_for_input' ? 'Please provide instructions for the next step' : null
      };
    }
      
    case 'listTasks': {
      const count = Math.min(params.limit || 10, 20);
      const tasks = [];
      
      for (let i = 0; i < count; i++) {
        const statuses = ['pending', 'running', 'completed', 'failed', 'cancelled'];
        const status = params.status || statuses[Math.floor(Math.random() * statuses.length)];
        
        if (params.status && params.status !== status) {
          continue; // Skip if filtering by status
        }
        
        tasks.push({
          taskId: uuidv4(),
          task: `Sample task ${i + 1}`,
          status,
          progress: {
            currentStep: Math.floor(Math.random() * 10) + 1,
            totalSteps: 10
          },
          createdAt: new Date(Date.now() - Math.random() * 86400000 * 7).toISOString(),
          updatedAt: new Date(Date.now() - Math.random() * 3600000).toISOString()
        });
      }
      
      return {
        tasks,
        count: tasks.length,
        totalCount: 100, // Mock total count
        limit: params.limit || 10,
        offset: params.offset || 0
      };
    }
      
    case 'provideHumanInput':
      return {
        taskId: params.taskId,
        status: 'running',
        inputReceived: true,
        updatedAt: new Date().toISOString()
      };
      
    case 'cancelTask':
      return {
        taskId: params.taskId,
        status: 'cancelled',
        updatedAt: new Date().toISOString()
      };
      
    default:
      throw new Error(`Unknown action: ${action}`);
  }
}

module.exports = taskManagementTools;
