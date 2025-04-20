/**
 * Task Management API Routes
 * Routes for managing automation tasks
 */

const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');

/**
 * @route GET /api/tasks
 * @description Get all tasks for the authenticated user
 * @access Private
 */
router.get('/', async (req, res) => {
  try {
    // Extract query parameters for filtering
    const { status, limit, offset } = req.query;
    
    // Build query parameters for API call
    const params = {
      limit: limit ? parseInt(limit, 10) : 20,
      offset: offset ? parseInt(offset, 10) : 0
    };
    
    if (status) {
      params.status = status;
    }
    
    // In a real implementation, fetch tasks from Airtap API
    // For now, return mock data
    const tasks = getMockTasks(params);
    
    res.status(200).json({
      tasks,
      count: tasks.length,
      totalCount: 100, // Mock total count
      limit: params.limit,
      offset: params.offset
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @route GET /api/tasks/:id
 * @description Get a task by ID
 * @access Private
 */
router.get('/:id', async (req, res) => {
  try {
    const taskId = req.params.id;
    
    // In a real implementation, fetch task from Airtap API
    // For now, return mock data
    const task = getMockTask(taskId);
    
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    
    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @route POST /api/tasks
 * @description Create a new task
 * @access Private
 */
router.post('/', async (req, res) => {
  try {
    const { task, precisionMode, navigateToHome, maxSteps } = req.body;
    
    // Validate required fields
    if (!task) {
      return res.status(400).json({ error: 'Task description is required' });
    }
    
    // In a real implementation, create task via Airtap API
    // For now, return mock data
    const newTask = {
      id: uuidv4(),
      task,
      precisionMode: precisionMode || false,
      navigateToHome: navigateToHome || true,
      maxSteps: maxSteps || 30,
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    res.status(201).json(newTask);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @route POST /api/tasks/:id/cancel
 * @description Cancel a task
 * @access Private
 */
router.post('/:id/cancel', async (req, res) => {
  try {
    const taskId = req.params.id;
    
    // In a real implementation, cancel task via Airtap API
    // For now, return mock data
    const task = getMockTask(taskId);
    
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    
    if (task.status === 'completed' || task.status === 'failed' || task.status === 'cancelled') {
      return res.status(400).json({ error: `Task already in terminal state: ${task.status}` });
    }
    
    task.status = 'cancelled';
    task.updatedAt = new Date().toISOString();
    
    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @route POST /api/tasks/:id/input
 * @description Provide human input to a task
 * @access Private
 */
router.post('/:id/input', async (req, res) => {
  try {
    const taskId = req.params.id;
    const { input } = req.body;
    
    // Validate required fields
    if (!input) {
      return res.status(400).json({ error: 'Input is required' });
    }
    
    // In a real implementation, provide input to task via Airtap API
    // For now, return mock data
    const task = getMockTask(taskId);
    
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    
    if (task.status !== 'waiting_for_input') {
      return res.status(400).json({ error: 'Task is not waiting for input' });
    }
    
    task.status = 'running';
    task.lastInput = input;
    task.updatedAt = new Date().toISOString();
    
    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * Generate mock task data for testing
 * @param {Object} params - Query parameters
 * @returns {Array} - Array of mock tasks
 */
function getMockTasks(params) {
  const statuses = ['pending', 'running', 'completed', 'failed', 'cancelled', 'waiting_for_input'];
  const mockTasks = [];
  
  const count = Math.min(params.limit, 20); // Max 20 tasks
  
  for (let i = 0; i < count; i++) {
    const status = params.status || statuses[Math.floor(Math.random() * statuses.length)];
    
    mockTasks.push({
      id: uuidv4(),
      task: `Sample task ${i + 1}`,
      status,
      precisionMode: Math.random() > 0.5,
      navigateToHome: Math.random() > 0.3,
      maxSteps: 30 + Math.floor(Math.random() * 70),
      currentStep: Math.floor(Math.random() * 20),
      createdAt: new Date(Date.now() - Math.random() * 86400000 * 7).toISOString(), // Within last week
      updatedAt: new Date(Date.now() - Math.random() * 3600000).toISOString() // Within last hour
    });
  }
  
  return mockTasks;
}

/**
 * Get mock task by ID
 * @param {string} id - Task ID
 * @returns {Object|null} - Mock task or null if not found
 */
function getMockTask(id) {
  // In a real implementation, this would fetch from database or API
  // For demo, always return a mock task with the given ID
  return {
    id,
    task: 'Open Instagram, search for #travel, and save the first 5 posts',
    status: ['pending', 'running', 'completed', 'failed', 'waiting_for_input'][Math.floor(Math.random() * 5)],
    precisionMode: true,
    navigateToHome: true,
    maxSteps: 50,
    currentStep: 12,
    steps: [
      { step: 1, action: 'Navigating to home screen', status: 'completed', timestamp: new Date(Date.now() - 300000).toISOString() },
      { step: 2, action: 'Opening Instagram app', status: 'completed', timestamp: new Date(Date.now() - 250000).toISOString() },
      { step: 3, action: 'Waiting for Instagram to load', status: 'completed', timestamp: new Date(Date.now() - 240000).toISOString() },
      { step: 4, action: 'Tapping on search icon', status: 'completed', timestamp: new Date(Date.now() - 230000).toISOString() },
      { step: 5, action: 'Tapping on search field', status: 'completed', timestamp: new Date(Date.now() - 220000).toISOString() },
      { step: 6, action: 'Typing "#travel"', status: 'completed', timestamp: new Date(Date.now() - 210000).toISOString() },
      { step: 7, action: 'Tapping on hashtag result', status: 'completed', timestamp: new Date(Date.now() - 200000).toISOString() },
      { step: 8, action: 'Waiting for results to load', status: 'completed', timestamp: new Date(Date.now() - 180000).toISOString() },
      { step: 9, action: 'Identifying first post', status: 'completed', timestamp: new Date(Date.now() - 160000).toISOString() },
      { step: 10, action: 'Tapping on first post', status: 'completed', timestamp: new Date(Date.now() - 150000).toISOString() },
      { step: 11, action: 'Long pressing to save post', status: 'completed', timestamp: new Date(Date.now() - 140000).toISOString() },
      { step: 12, action: 'Navigating to next post', status: 'in_progress', timestamp: new Date(Date.now() - 130000).toISOString() }
    ],
    createdAt: new Date(Date.now() - 300000).toISOString(),
    updatedAt: new Date(Date.now() - 100000).toISOString()
  };
}

module.exports = router;
