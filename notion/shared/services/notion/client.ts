const BASE_URL = 'https://api.notion.com/v1';

const NOTION_VERSION = '2022-06-28';
const NOTION_TOKEN = Deno.env.get('NOTION_TOKEN');

const HEADERS = {
  'Authorization': `Bearer ${NOTION_TOKEN}`,
  'Notion-Version': NOTION_VERSION,
  'Content-Type': 'application/json',
};

type Params = Record<string, string | number | boolean>;

const buildParams = (params: Params) => {
  const result = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    result.append(key, value.toString());
  }
  return result;
};

export const request = async (
  options: {
    path: string;
    method: string;
    body?: Record<string, unknown>;
    params?: Params;
  },
) => {
  const params = buildParams(options.params ?? {});
  const response = await fetch(
    `${BASE_URL}${options.path}?${params.toString()}`,
    {
      method: options.method,
      body: options.body ? JSON.stringify(options.body) : undefined,
      headers: HEADERS,
    },
  );

  return response;
};
