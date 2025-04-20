# Airtap: Android Automation MCP Server

## Introduction
Airtap is a powerful Model Context Protocol (MCP) server that provides seamless integration with Android devices in a sandbox environment. It enables AI agents, LLMs, and applications to interact with Android OS programmatically through a standardized API.

## 📱 Overview
Airtap acts as a bridge between AI agents and Android devices, providing a secure sandbox environment for automated interactions. This allows developers to build autonomous agents that can perform complex tasks on Android without manual intervention.

## 🔍 Architecture

```
┌───────────────────────────────────────────────────────────┐
│                      Client Environment                   │
│                                                           │
│   ┌───────────┐      ┌───────────┐      ┌───────────┐     │
│   │ LLM Agent │      │ Testing   │      │ Custom    │     │
│   │ Framework │      │ Framework │      │ App Logic │     │
│   └─────┬─────┘      └─────┬─────┘      └─────┬─────┘     │
│         │                  │                  │           │
└─────────┼──────────────────┼──────────────────┼───────────┘
          │                  │                  │
          │     ┌────────────▼─────────────┐    │
          └────►│   MCP Client Interface   │◄───┘
                │                          │
                └────────────┬─────────────┘
                             │
                             │ MCP Protocol
                             ▼
┌────────────────────────────────────────────────────────────────┐
│                        Airtap MCP Server                       │
│                                                                │
│  ┌────────────┐    ┌────────────┐    ┌────────────────────┐    │
│  │ Task       │    │ Android    │    │ Error Recovery     │    │
│  │ Management │◄──►│ Interaction│◄──►│ System             │    │
│  │ API        │    │ Engine     │    │                    │    │
│  └────────────┘    └─────┬──────┘    └────────────────────┘    │
│                          │                                      │
│                    ┌─────▼──────┐     ┌────────────────────┐   │
│                    │ UI Element │     │ Computer Vision    │   │
│                    │ Detection  │◄───►│ (Parasail UI-TARS) │   │
│                    └─────┬──────┘     └────────────────────┘   │
│                          │                                      │
└──────────────────────────┼──────────────────────────────────────┘
                           │
                           │ Secure Connection
                           ▼
┌────────────────────────────────────────────────────────────────┐
│                       Sandbox Environment                       │
│                                                                │
│    ┌────────────────┐      ┌────────────────┐                  │
│    │                │      │  App Store &   │                  │
│    │ Android Device │◄────►│  Package       │                  │
│    │ Instance       │      │  Management    │                  │
│    │                │      │                │                  │
│    └───────┬────────┘      └────────────────┘                  │
│            │                                                    │
│    ┌───────▼────────┐      ┌────────────────┐                  │
│    │ Screen Capture │      │ Device State   │                  │
│    │ & Analysis     │◄────►│  Management    │                  │
│    │                │      │                │                  │
│    └────────────────┘      └────────────────┘                  │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

## 🚀 Key Use Cases
1. **Autonomous Android Agents**
   Build AI agents that can complete complex mobile tasks independently
2. **Automated Mobile App Testing**
   Create comprehensive testing workflows for Android applications
3. **User Experience Simulation**
   Simulate user interactions for UX research and optimization
4. **Mobile Workflow Automation**
   Automate repetitive mobile tasks across multiple applications
5. **Cross-App Integration**
   Enable agents to work across different mobile applications seamlessly

## ✅ Getting Started
### Prerequisites
- **Node.js**: Install Node.js to access the npx command (Node.js module runner)
- **Airtap Account**: Create an Airtap Personal Access Token by signing up at [airtap.ai](https://airtap.ai)

### Configuration
Add Airtap to your MCP servers list in your configuration:
```json
{
  "mcpServers": {
    "AirTap": {
      "command": "npx",
      "args": ["@airtap/mcp"],
      "env": {
        "API_TOKEN": "<insert-your-api-token-here>"
      }
    }
  }
}
```

## 🔧 Available Tools
### Low-Level Android OS Interaction Tools

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

### High-Level Task Management Tools
| Tool | Description |
|------|-------------|
| submit_task | Submit a new automation task. Parameters: `{ task: string, precisionMode?: boolean, navigateToHome?: boolean, maxSteps?: number }`. Returns taskId and initial status. |
| get_task_status | Get task status and progress. Parameter: `{ taskId: string }`. Returns task state, status, and history. |
| list_tasks | Get all tasks for the authenticated user. Optional filter parameters. Returns array of task objects. |
| provide_human_input | Provide human input to an ongoing task. Parameters: `{ input: string, taskId: string }`. Returns updated task status. |
| cancel_task | Cancel a running task. Parameter: `{ taskId: string }`. Returns cancellation status. |

## 🔍 Advanced Features
### Error Recovery Strategies
| Feature | Description |
|---------|-------------|
| Network Errors | Automatically retry operations when network connectivity issues occur |
| App Crashes | Detect and recover from application crashes by restarting apps |
| UI Navigation Errors | Handle unexpected popups and dialogs that interrupt normal flow |
| CAPTCHA Detection | Identify CAPTCHA challenges and request human assistance when needed |
| Permission Requests | Automatically handle system permission dialogs |
| Missing UI Elements | Retry with different strategies when expected UI elements aren't found |
| App Installation | Automatically navigate to Play Store, search, install, and continue with the original task |

### UI Element Detection
| Feature | Description |
|---------|-------------|
| Image Analysis | Analyze screenshots to identify UI elements using Parasail UI-TARS model |
| Element Coordinates | Extract precise coordinates for interactive elements |
| Dynamic Navigation | Navigate interfaces even when element positions change |
| Adaptive Scaling | Work across different screen sizes and resolutions automatically |

## ⚠️ Troubleshooting
| Issue | Solution |
|-------|----------|
| Timeouts | Configure appropriate timeout in agent settings. Recommend 180 seconds, adjust based on use case. |
| "spawn npx ENOENT" Error | 1. Find Node.js path: `which node` (macOS) or `where node` (Windows). 2. Update MCP configuration with full path. |
| Connection Issues | Check network configuration and ensure Airtap account is properly authenticated. |
| Slow Performance | Consider optimizing the screen resolution settings in your Android instance. |

## 🔒 Security Considerations
- All Android interactions occur in a secure sandbox environment
- API tokens should be kept confidential and never exposed in client-side code
- Consider implementing rate limiting for your production applications
- Regular security audits are recommended for mission-critical implementations

## 🌟 Best Practices
- Start Simple: Begin with basic interactions before attempting complex workflows
- Handle Errors Gracefully: Always implement error handling in your automation scripts
- Use Task IDs: Save task IDs to resume or monitor long-running operations
- Test Thoroughly: Validate your automation across different Android versions
- Monitor Resource Usage: Keep track of device resource consumption during automation

## 👨‍💻 Contributing
We welcome contributions to help improve Airtap! Here's how you can help:
- Report Issues: Found a bug or have a feature request? Open an issue on our GitHub repository.
- Submit Pull Requests: Feel free to fork the repository and submit PRs with enhancements.
- Improve Documentation: Suggestions for improving this documentation are always welcome.
- Share Examples: Contribute practical examples to help other users leverage Airtap effectively.

For significant changes, please open an issue first to discuss your proposal.

## 📞 Support
If you encounter any issues or have questions, please:
- Check our GitHub Issues for similar problems
- Join our Discord community for real-time support
- Contact support at support@airtap.ai

---

**Airtap - Empowering intelligent automation for Android**
