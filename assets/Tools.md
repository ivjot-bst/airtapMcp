# Airtap MCP Tools

This document provides comprehensive information about the tools available in the Airtap MCP Server.

## Low-Level Android OS Interaction Tools

| Tool | Description |
|------|-------------|
| tap | Tap at specific coordinates. Parameters: `{ coordinates: [x, y] }`. Returns success state and screenshot. |
| inputText | Type text at specified coordinates. Parameters: `{ text: string, coordinates: [x, y] }`. Returns success state and screenshot. |
| clearText | Clear text from input field. Parameters: `{ noOfChars: number, coordinates: [x, y] }`. Returns success state. |
| swipe | Perform swipe gesture. Parameters: `{ start: [x1, y1], end: [x2, y2], duration: number }`. Returns success state. |
| navigateBack | Press the Android back button. Parameters: `{}`. Returns success state and new screen. |
| navigateHome | Go to home screen. Parameters: `{}`. Returns success state and home screen. |
| wait | Wait for specified seconds. Parameters: `{ seconds: number }`. Returns success after waiting. |
| listApps | List all installed applications. Parameters: `{}`. Returns list of installed packages. |
| uninstallApp | Uninstall an application by package name. Parameters: `{ packageName: string }`. Returns uninstall status. |
| longpress | Long press at coordinates. Parameters: `{ coordinates: [x, y], duration?: number }`. Returns success state. |

## High-Level Task Management Tools

| Tool | Description |
|------|-------------|
| submit_task | Submit a new automation task. Parameters: `{ task: string, precisionMode?: boolean, navigateToHome?: boolean, maxSteps?: number }`. Returns taskId and initial status. |
| get_task_status | Get task status and progress. Parameter: `{ taskId: string }`. Returns task state, status, and history. |
| list_tasks | Get all tasks for the authenticated user. Optional filter parameters. Returns array of task objects. |
| provide_human_input | Provide human input to an ongoing task. Parameters: `{ input: string, taskId: string }`. Returns updated task status. |
| cancel_task | Cancel a running task. Parameter: `{ taskId: string }`. Returns cancellation status. |

## Advanced Error Recovery Strategies

| Feature | Description |
|---------|-------------|
| Network Errors | Automatically retry operations when network connectivity issues occur |
| App Crashes | Detect and recover from application crashes by restarting apps |
| UI Navigation Errors | Handle unexpected popups and dialogs that interrupt normal flow |
| CAPTCHA Detection | Identify CAPTCHA challenges and request human assistance when needed |
| Permission Requests | Automatically handle system permission dialogs |
| Missing UI Elements | Retry with different strategies when expected UI elements aren't found |
| App Installation | Automatically navigate to Play Store, search, install, and continue with the original task |

## UI Element Detection Features

| Feature | Description |
|---------|-------------|
| Image Analysis | Analyze screenshots to identify UI elements using Parasail UI-TARS model |
| Element Coordinates | Extract precise coordinates for interactive elements |
| Dynamic Navigation | Navigate interfaces even when element positions change |
| Adaptive Scaling | Work across different screen sizes and resolutions automatically |

## Example Usage

### Basic Interactions

```javascript
// Tap on an element at specific coordinates
const tapResult = await mcpClient.runTool('tap', { coordinates: [500, 800] });

// Input text into a field
const inputResult = await mcpClient.runTool('inputText', { 
  text: 'Hello world', 
  coordinates: [500, 800] 
});

// Swipe from one position to another
const swipeResult = await mcpClient.runTool('swipe', {
  start: [500, 1000],
  end: [500, 200],
  duration: 300 // milliseconds
});
```

### Complex Task Management

```javascript
// Submit a complex automation task
const taskResult = await mcpClient.runTool('submit_task', {
  task: 'Open Instagram, search for #travel, and save the first 5 posts',
  precisionMode: true,
  navigateToHome: true,
  maxSteps: 50
});

// Get status of an ongoing task
const taskId = taskResult.taskId;
const statusResult = await mcpClient.runTool('get_task_status', {
  taskId: taskId
});

// Provide human input when needed
await mcpClient.runTool('provide_human_input', {
  input: 'Select the second option',
  taskId: taskId
});

// Cancel a task if needed
await mcpClient.runTool('cancel_task', {
  taskId: taskId
});
```

For more detailed information about each tool, please refer to the [API documentation](https://docs.airtap.ai/api-reference).
