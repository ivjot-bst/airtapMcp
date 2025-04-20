# Installation Guide

This guide provides detailed instructions for installing and setting up the Airtap MCP server for Android automation.

## Prerequisites

Before you begin, ensure you have the following prerequisites installed:

- **Node.js** (v16.0.0 or higher)
- **npm** (v7.0.0 or higher)
- **An Airtap account** with API access

## Installation Steps

### 1. Install the package

You can install the Airtap MCP server either globally or locally.

#### Global Installation (Recommended for most users)

```bash
npm install -g @airtap/mcp
```

This allows you to run the Airtap MCP server from anywhere on your system.

#### Local Installation

```bash
npm install @airtap/mcp
```

When installed locally, you'll need to use `npx` to run the server:

```bash
npx @airtap/mcp
```

### 2. Set up your API token

You need an Airtap API token to use the MCP server. You can set this up in one of three ways:

#### Option 1: Environment Variable

```bash
export API_TOKEN=your_airtap_api_token_here
```

#### Option 2: .env File

Create a `.env` file in your project directory with the following content:

```
API_TOKEN=your_airtap_api_token_here
```

#### Option 3: Command Line Parameter

```bash
airtap-mcp --token your_airtap_api_token_here
```

### 3. Configure MCP clients

#### Claude Desktop Configuration

Edit your `claude_desktop_config.json` file to include Airtap MCP:

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

#### Other MCP Clients

For other MCP clients, configure them to connect to the Airtap MCP server running on:

```
ws://localhost:3000
```

## Development Setup

If you want to contribute to the development of Airtap MCP, follow these additional steps:

### 1. Clone the repository

```bash
git clone https://github.com/airtap/airtap-mcp.git
cd airtap-mcp
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up the development environment

```bash
cp .env.example .env
# Edit .env file with your API token
```

### 4. Run tests

```bash
npm test
```

### 5. Run in development mode

```bash
npm run dev
```

This will start the server with hot-reloading enabled for development.

## Troubleshooting

### Common Issues

#### "spawn npx ENOENT" Error

1. Find the full path to your Node.js executable:
   - On macOS/Linux: `which node`
   - On Windows: `where node`
2. Update your MCP configuration to use the full path.

#### Connection Issues

If you're experiencing connection issues:

1. Check your network configuration
2. Verify your API token is valid
3. Ensure your Airtap account has access to Android automation features

#### Timeout Errors

If you're experiencing timeout errors:

1. Configure a longer timeout in your agent settings (recommended: 180 seconds)
2. Consider optimizing your screen resolution settings in the Android instance

## Support

If you encounter any problems during installation, please:

- Check the [Troubleshooting](#troubleshooting) section
- Visit our [GitHub Issues](https://github.com/airtap/airtap-mcp/issues) page
- Contact our support team at support@airtap.ai
