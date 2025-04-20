#!/usr/bin/env python3
"""
Python Example Client for Airtap MCP
Demonstrates how to connect to and use the Airtap MCP server from Python
"""

import json
import asyncio
import websockets
import os
from datetime import datetime

# Configuration
MCP_SERVER_URL = "ws://localhost:3000"
API_TOKEN = os.environ.get("API_TOKEN", "your-api-token-here")

# Message ID counter
message_id = 1

async def send_message(websocket, message_type, **params):
    """Send a message to the MCP server"""
    global message_id
    
    message = {
        "id": str(message_id),
        "type": message_type
    }
    message_id += 1
    
    if message_type == "run_tool":
        message["tool"] = params.get("tool")
        message["params"] = params.get("params", {})
    else:
        message.update(params)
    
    await websocket.send(json.dumps(message))
    print(f"> Sent {message_type} message (ID: {message['id']})")
    
    return message["id"]

async def handle_message(websocket, message):
    """Handle incoming message from MCP server"""
    message_type = message.get("type")
    message_id = message.get("id")
    
    print(f"< Received {message_type} message" + (f" (ID: {message_id})" if message_id else ""))
    
    if message_type == "server_info":
        print(f"Server: {message.get('server')} ({message.get('version')})")
        print(f"Protocol: {message.get('protocol')}")
    
    elif message_type == "tools_list":
        print("Available tools:")
        for tool in message.get("tools", []):
            print(f"- {tool['name']}: {tool['description']}")
    
    elif message_type == "request_received":
        print(f"Request received for tool: {message.get('tool')}")
    
    elif message_type == "tool_response":
        print(f"Tool execution completed: {message.get('tool')}")
        print(f"Result: {json.dumps(message.get('result'), indent=2)}")
    
    elif message_type == "error":
        print(f"Error: {message.get('message')}")
    
    else:
        print(f"Unknown message type: {message_type}")
        print(f"Message: {json.dumps(message, indent=2)}")

async def main():
    """Main function for the MCP client"""
    try:
        async with websockets.connect(MCP_SERVER_URL) as websocket:
            print("Connected to Airtap MCP server")
            
            # Request list of available tools
            await send_message(websocket, "list_tools")
            
            # Example: Submit a task
            task_description = "Open the calculator app, calculate 25 + 37, and verify the result is 62"
            task_id = await send_message(
                websocket, 
                "run_tool", 
                tool="submit_task",
                params={
                    "task": task_description,
                    "precisionMode": True,
                    "navigateToHome": True
                }
            )
            
            # Wait for response
            response = await websocket.recv()
            await handle_message(websocket, json.loads(response))
            
            # Wait for another response (tool_response)
            response = await websocket.recv()
            message = json.loads(response)
            await handle_message(websocket, message)
            
            # Get task ID from response
            task_id = message.get("result", {}).get("taskId")
            
            if task_id:
                print(f"\nTask submitted with ID: {task_id}")
                print("Checking task status in 5 seconds...")
                await asyncio.sleep(5)
                
                # Check task status
                await send_message(
                    websocket,
                    "run_tool",
                    tool="get_task_status",
                    params={"taskId": task_id}
                )
                
                # Wait for response
                response = await websocket.recv()
                await handle_message(websocket, json.loads(response))
                
                # Wait for tool_response
                response = await websocket.recv()
                await handle_message(websocket, json.loads(response))
            
            # Keep connection open for a while
            print("\nPress Ctrl+C to exit...")
            while True:
                await asyncio.sleep(1)
    
    except websockets.exceptions.ConnectionClosed:
        print("Connection to Airtap MCP server closed")
    
    except KeyboardInterrupt:
        print("\nExiting...")
    
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    asyncio.run(main())
