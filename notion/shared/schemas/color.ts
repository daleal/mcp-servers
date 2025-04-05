import { z } from 'zod';

const colors = [
  'default',
  'blue',
  'blue_background',
  'brown',
  'brown_background',
  'gray',
  'gray_background',
  'green',
  'green_background',
  'orange',
  'orange_background',
  'pink',
  'pink_background',
  'purple',
  'purple_background',
  'red',
  'red_background',
  'yellow',
  'yellow_background',
] as const;

export const colorSchema = z.enum(colors);
