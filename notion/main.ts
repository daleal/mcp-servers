import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { server } from '~/server.ts';

const transport = new StdioServerTransport();

server.connect(transport);
