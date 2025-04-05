import { z } from 'zod';
import { colorSchema } from '~/shared/schemas/color.ts';
import { idSchema } from '~/shared/utils/ids.ts';

const annotationsSchema = z.object({
  bold: z.boolean().optional(),
  italic: z.boolean().optional(),
  strikethrough: z.boolean().optional(),
  underline: z.boolean().optional(),
  code: z.boolean().optional(),
  color: colorSchema.describe('Color for the text.').optional(),
}).describe('Styling information for the text.');

const textSchema = z.object({
  content: z.string().describe('The actual text content.'),
  link: z.object({
    url: z.string().url().describe('The URL the text links to.'),
  }).optional().describe("Optional link object with a 'url' field."),
}).describe("Object containing text content and optional link info. Required if type is 'text'.");

const databaseMentionSchema = z.object({
  type: z.literal('database').describe('The type of the mention.'),
  database: z.object({
    id: idSchema('The ID of the mentioned database.'),
  }).describe("Database mention object. Contains a database reference with an 'id' field."),
}).describe("Mention object if type is 'mention'. Represents an inline mention of a database.");

const dateMentionSchema = z.object({
  type: z.literal('date').describe('The type of the mention.'),
  date: z.object({
    start: z.string().datetime({ offset: true }).describe('An ISO 8601 formatted start date or date-time.'),
    end: z.string().datetime({ offset: true }).nullable().describe(
      'An ISO 8601 formatted end date or date-time, or null if not a range.',
    ),
    time_zone: z.string().nullable().describe('Time zone information for start and end. If null, times are in UTC.'),
  }).describe('Date mention object, containing a date property value object.'),
}).describe("Mention object if type is 'mention'. Represents an inline mention of a date.");

const linkPreviewMentionSchema = z.object({
  type: z.literal('link_preview').describe('The type of the mention.'),
  link_preview: z.object({
    url: z.string().url().describe('The URL for the link preview.'),
  }).describe('Link Preview mention object, containing a URL for the link preview.'),
}).describe("Mention object if type is 'mention'. Represents an inline mention of a link preview.");

const pageMentionSchema = z.object({
  type: z.literal('page').describe('The type of the mention.'),
  page: z.object({
    id: idSchema('The ID of the mentioned page.'),
  }).describe("Page mention object, containing a page reference with an 'id' field."),
}).describe("Mention object if type is 'mention'. Represents an inline mention of a page.");

const templateMentionSchema = z.object({
  type: z.literal('template_mention').describe('The type of the mention.'),
  template_mention: z.union([
    z.object({
      type: z.literal('template_mention_date').describe('The template mention type.'),
      template_mention_date: z.enum(['today', 'now']).describe('For template_mention_date type, the date keyword.'),
    }),
    z.object({
      type: z.literal('template_mention_user').describe('The template mention type.'),
      template_mention_user: z.literal('me').describe('For template_mention_user type, the user keyword.'),
    }),
  ]).describe('Template mention object, can be a template_mention_date or template_mention_user.'),
}).describe("Mention object if type is 'mention'. Represents an inline mention of a template mention.");

const userMentionSchema = z.object({
  type: z.literal('user').describe('The type of the mention.'),
  user: z.object({
    object: z.literal('user').describe("Should be 'user'."),
    id: idSchema('The ID of the user.'),
  }).describe('User mention object, contains a user reference.'),
}).describe("Mention object if type is 'mention'. Represents an inline mention of a user.");

const mentionSchema = z.discriminatedUnion('type', [
  databaseMentionSchema,
  dateMentionSchema,
  linkPreviewMentionSchema,
  pageMentionSchema,
  templateMentionSchema,
  userMentionSchema,
]).describe(
  "Mention object if type is 'mention'. Represents an inline mention of a database, date, link preview, page, template mention, or user.",
);

const equationSchema = z.object({
  expression: z.string().describe('LaTeX string representing the inline equation.'),
}).describe("Equation object if type is 'equation'. Represents an inline LaTeX equation.");

const richTextObjectBaseSchema = z.object({
  annotations: annotationsSchema.optional(),
  href: z.string().url().optional().describe('The URL of any link or mention in this text, if any.'),
  plain_text: z.string().describe('The plain text without annotations.').optional(),
});

export const richTextObjectSchema = z.discriminatedUnion('type', [
  richTextObjectBaseSchema.extend({
    type: z.literal('text').describe('The type of this rich text object.'),
    text: textSchema,
    mention: z.undefined().optional(), // Ensure other discriminated union keys are not present
    equation: z.undefined().optional(),
  }),
  richTextObjectBaseSchema.extend({
    type: z.literal('mention').describe('The type of this rich text object.'),
    mention: mentionSchema,
    text: z.undefined().optional(),
    equation: z.undefined().optional(),
  }),
  richTextObjectBaseSchema.extend({
    type: z.literal('equation').describe('The type of this rich text object.'),
    equation: equationSchema,
    text: z.undefined().optional(),
    mention: z.undefined().optional(),
  }),
]).describe('A rich text object.');

export type RichTextObject = z.infer<typeof richTextObjectSchema>;
