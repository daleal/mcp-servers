import { z } from 'zod';
import { richTextObjectSchema } from '~/shared/schemas/rich-text.ts';
import { colorSchema } from '~/shared/schemas/color.ts';

const baseParagraphSchema = z.object({
  rich_text: z
    .array(richTextObjectSchema)
    .describe('An array of rich text objects representing the contents of the block.')
    .optional(),
  color: colorSchema.describe('The color of the block.').optional(),
}).describe('Paragraph block object.');

type Paragraph = z.infer<typeof baseParagraphSchema> & {
  children?: Array<BlockObject>;
};

const paragraphSchema: z.ZodType<Paragraph> = baseParagraphSchema.extend({
  children: z.array(z.lazy(() => blockObjectSchema)).describe('Nested child blocks.').optional(),
});

const baseBlockObjectSchema = z.object({
  object: z.literal('block').describe("Should be 'block'."),
  type: z.string().describe(
    "Type of the block. Possible values include 'paragraph', 'heading_1', 'heading_2', 'heading_3', 'bulleted_list_item', 'numbered_list_item', 'to_do', 'toggle', 'child_page', 'child_database', 'embed', 'callout', 'quote', 'equation', 'divider', 'table_of_contents', 'column', 'column_list', 'link_preview', 'synced_block', 'template', 'link_to_page', 'audio', 'bookmark', 'breadcrumb', 'code', 'file', 'image', 'pdf', 'video'. Not all types are supported for creation via API.",
  ),
}).describe('A Notion block object.');

export const blockObjectSchema = baseBlockObjectSchema.extend({
  paragraph: paragraphSchema.optional(),
});

export type BlockObject = z.infer<typeof blockObjectSchema>;
