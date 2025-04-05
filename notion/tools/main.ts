import { tool as appendChildrenBlocks } from '~/tools/append-children-blocks.ts';
import { tool as retrieveBlockChildren } from '~/tools/retrieve-block-children.ts';
import { tool as retrieveBlock } from '~/tools/retrieve-block.ts';
import { tool as retrievePage } from '~/tools/retrieve-page.ts';
import { tool as search } from '~/tools/search.ts';

export const tools = [
  appendChildrenBlocks,
  retrieveBlockChildren,
  retrieveBlock,
  retrievePage,
  search,
];
