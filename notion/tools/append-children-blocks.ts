import { z } from 'zod';
import * as notion from '~/shared/services/notion/client.ts';
import { idSchema } from '~/shared/utils/ids.ts';
import { buildTool } from '~/shared/utils/tools.ts';
import { blockObjectSchema } from '~/shared/schemas/block-object.ts';

export const tool = buildTool({
  name: 'append-children-blocks',
  description:
    "Append new children blocks to a specified parent block in Notion. Requires insert content capabilities. You can optionally specify the 'after' parameter to append after a certain block.",
  parameters: {
    blockId: idSchema('The ID of the parent block.'),
    children: z.array(blockObjectSchema).describe(
      'Array of block objects to append. Each block must follow the Notion block schema.',
    ),
    after: idSchema('The ID of the existing block that the new block should be appended after.').optional(),
  },
  action: async ({ blockId, children, after }) => {
    const response = await notion.request({
      path: `/blocks/${blockId}/children`,
      method: 'PATCH',
      body: { children, after },
    });

    return response.json();
  },
});
