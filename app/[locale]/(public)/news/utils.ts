export type SearchParams = Record<string, string | string[] | undefined>;

export function pickParam(value?: string | string[]): string | undefined {
  if (Array.isArray(value)) {
    return value[0];
  }
  return value;
}

export {buildQueryString} from '@lib/url';
