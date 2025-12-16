import { McpServer, ResourceTemplate } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import * as z from 'zod/v4';

// Create an MCP server
const server = new McpServer({
    name: 'demo-server',
    version: '1.0.0'
});

// Add an addition tool
server.registerTool(
    'add',
    {
        title: 'Addition Tool',
        description: 'Add two numbers',
        inputSchema: { a: z.number(), b: z.number() },
        outputSchema: { result: z.number() }
    },
    async ({ a, b }) => {
        const output = { result: a + b };
        return {
            content: [{ type: 'text', text: JSON.stringify(output) }],
            structuredContent: output
        };
    }
);

// Add a dynamic greeting resource
server.registerResource(
    'greeting',
    new ResourceTemplate('greeting://{name}', { list: undefined }),
    {
        title: 'Greeting Resource',
        description: 'Dynamic greeting generator'
    },
    async (uri, { name }) => ({
        contents: [
            {
                uri: uri.href,
                text: `Hello, ${name}!`
            }
        ]
    })
);

// Add a "get current date" tool
server.registerTool(
    'get-current-date',
    {
        title: 'Get Current Date',
        description: 'Returns the current date and time in ISO 8601 format',
        inputSchema: {}, // no input needed
        outputSchema: { currentDate: z.string() }
    },
    async () => {
        const currentDate = new Date().toISOString();
        const output = { currentDate };
        return {
            content: [{ type: 'text', text: JSON.stringify(output) }],
            structuredContent: output
        };
    }
);

// Set up stdio transport
const transport = new StdioServerTransport();

// Connect the server to stdio transport
server.connect(transport).catch(err => {
    console.error('Failed to start stdio server:', err);
    process.exit(1);
});
