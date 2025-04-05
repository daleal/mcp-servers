import * as notion from '~/shared/services/notion/client.ts';
import { idSchema } from '~/shared/utils/ids.ts';
import { buildTool } from '~/shared/utils/tools.ts';

export const tool = buildTool({
  name: 'retrieve-block',
  description: 'Retrieve a block from Notion',
  parameters: {
    blockId: idSchema('The ID of the block to retrieve.'),
  },
  action: async ({ blockId }) => {
    const response = await notion.request({
      path: `/blocks/${blockId}`,
      method: 'GET',
    });

    return response.json();
  },
});
