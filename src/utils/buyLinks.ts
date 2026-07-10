import type { BuyLink } from '../types/dap';

export function parseLabeledLinks(value: string): BuyLink[] {
  if (!value.trim()) return [];

  return value
    .split(';')
    .map((item) => {
      const separatorIndex = item.indexOf('|');
      if (separatorIndex === -1) return null;

      const label = item.slice(0, separatorIndex).trim();
      const url = item.slice(separatorIndex + 1).trim();
      if (!label || !isValidHttpUrl(url)) return null;

      return { label, url };
    })
    .filter((link): link is BuyLink => Boolean(link));
}

export const parseBuyLinks = parseLabeledLinks;

export function isValidHttpUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}
