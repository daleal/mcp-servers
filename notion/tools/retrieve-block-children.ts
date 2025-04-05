import { z } from 'zod';
import * as notion from '~/shared/services/notion/client.ts';
import { idSchema } from '~/shared/utils/ids.ts';
import { buildTool } from '~/shared/utils/tools.ts';

export const tool = buildTool({
  name: 'retrieve-block',
  description: 'Retrieve the children of a block from Notion',
  parameters: {
    blockId: idSchema('The ID of the block.'),
    startCursor: z.string().describe('Pagination cursor to start search from').optional(),
    pageSize: z.number().describe('Number of results to return per page (max 100)').optional(),
  },
  action: async ({ blockId, startCursor, pageSize }) => {
    const response = await notion.request({
      path: `/blocks/${blockId}`,
      method: 'GET',
      params: {
        start_cursor: startCursor,
        page_size: pageSize,
      },
    });

    return response.json();
  },
});
