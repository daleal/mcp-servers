import { idSchema as idSchemaBase } from '~/shared/schemas/id.ts';

const CONSTANT_DESCRIPTION =
  'It should be a 32-character string (excluding hyphens) formatted as 8-4-4-4-12 with hyphens (-).';

const buildDescription = (description: string) => {
  return `${description.replace(/\.$/g, '')}. ${CONSTANT_DESCRIPTION}`;
};

export const idSchema = (description: string) => idSchemaBase.describe(buildDescription(description));
