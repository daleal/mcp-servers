import { z } from 'zod';
import * as notion from '~/shared/services/notion/client.ts';
import { buildTool } from '~/shared/utils/tools.ts';

const parameters = {
  query: z.string().describe('Text to search for in page or database titles').optional(),
  filter: z.object({
    property: z.literal('object').describe("Must be 'object'"),
    value: z.union([z.literal('page'), z.literal('database')]).describe("Either 'page' or 'database'"),
  }).describe('Filter results by object type (page or database)').optional(),
  sort: z.object({
    direction: z
      .union([z.literal('ascending'), z.literal('descending')])
      .describe('Sort direction (ascending or descending)'),
    timestamp: z.literal('last_edited_time').describe('Sort by last edited time'),
  }).describe('Sort order of results').optional(),
  startCursor: z.string().describe('Pagination cursor to start search from').optional(),
  pageSize: z.number().describe('Number of results to return per page (max 100)').optional(),
};

export const tool = buildTool({
  name: 'search',
  description: 'Search pages or databases by title in Notion',
  parameters,
  action: async ({ query, filter, sort, startCursor, pageSize }) => {
    const body = {
      query,
      filter,
      sort,
      start_cursor: startCursor,
      page_size: pageSize,
    };

    const response = await notion.request({
      path: '/search',
      method: 'POST',
      body: Object.fromEntries(Object.entries(body).filter(([_, v]) => v !== undefined)),
    });

    return response.json();
  },
});
