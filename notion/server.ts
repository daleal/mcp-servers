import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { loadTools } from '@mcp-servers/shared/tools';
import { tools } from '~/tools/main.ts';

export const server = new McpServer({
  name: 'example-server',
  version: '1.0.0',
});

loadTools(server, tools);
