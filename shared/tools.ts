import { z } from 'zod';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import type { CallToolResult } from '@modelcontextprotocol/sdk/types.js';

export const buildToolFactory = <TPrefix extends string>(prefix: TPrefix) =>
<
  TName extends string,
  TShape extends z.ZodRawShape,
  TInput extends z.infer<z.ZodObject<TShape>>,
>({
  name,
  description,
  parameters,
  action,
}: {
  name: TName;
  description: string;
  parameters: TShape;
  action: (input: TInput) => unknown | Promise<unknown>;
}): [
  `${TPrefix}-${TName}`,
  string,
  TShape,
  (input: TInput) => Promise<CallToolResult>,
] => [
  `${prefix}-${name}`,
  description,
  parameters,
  async (options: TInput) => {
    const response = await action(options);

    return {
      content: [{ type: 'text', text: JSON.stringify(response, null, 2) }],
    } satisfies CallToolResult;
  },
];

type AnyTool = [
  string,
  string,
  z.ZodRawShape,
  // deno-lint-ignore no-explicit-any
  (input: any) => Promise<CallToolResult>,
];

export const loadTools = (server: McpServer, tools: Array<AnyTool>) => {
  for (const tool of tools) {
    server.tool(...tool);
  }
};
