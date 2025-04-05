import * as notion from '~/shared/services/notion/client.ts';
import { idSchema } from '~/shared/utils/ids.ts';
import { buildTool } from '~/shared/utils/tools.ts';

export const tool = buildTool({
  name: 'retrieve-page',
  description: 'Retrieve a page from Notion',
  parameters: {
    pageId: idSchema('The ID of the page to retrieve.'),
  },
  action: async ({ pageId }) => {
    const response = await notion.request({
      path: `/pages/${pageId}`,
      method: 'GET',
    });

    return response.json();
  },
});
