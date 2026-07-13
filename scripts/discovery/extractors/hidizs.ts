import { anchorMatches, resolveUrl, stripTags, uniqueByNameAndUrl } from '../html';
import type { DiscoveredProduct, DiscoverySource } from '../types';

const modelPatterns = [
  /\bAP80\s+PRO\s+MAX\b/i,
  /\bAP80\s+PRO-X\b/i,
  /\bAP80\s+PRO\s+Special Edition\b/i,
  /\bAP80\s+PRO\b/i,
  /\bAP80\s+Stainless Steel\b/i,
  /\bAP80\b/i,
  /\bAP60\s+II\b/i,
  /\bAP60\b/i,
  /\bAP100\b/i,
  /\bAP200\b/i,
  /\bAP30\b/i,
];

export function extractHidizs(html: string, source: DiscoverySource): DiscoveredProduct[] {
  const products: DiscoveredProduct[] = [];

  for (const anchor of anchorMatches(html)) {
    const text = stripTags(anchor.inner).replace(/\s+/g, ' ').trim();
    if (!text) continue;
    if (!/\/products\//i.test(anchor.href)) continue;
    if (/bundle|case|sandisk|cable|adapter|iem|earphone|monitor/i.test(text)) continue;

    const model = modelFromText(text);
    if (!model) continue;

    products.push({
      brand: source.brand,
      detectedName: `Hidizs ${model}`,
      productUrl: resolveUrl(anchor.href, source.url),
      sourceUrl: source.url,
      sourceType: source.type,
    });
  }

  return uniqueByNameAndUrl(products);
}

function modelFromText(value: string): string | null {
  for (const pattern of modelPatterns) {
    const match = value.match(pattern);
    if (match?.[0]) return canonicalModel(match[0]);
  }
  return null;
}

function canonicalModel(value: string): string {
  return value
    .replace(/\s+/g, ' ')
    .replace(/\bpro\b/gi, 'Pro')
    .replace(/\bmax\b/gi, 'Max')
    .replace(/\bspecial edition\b/gi, 'Special Edition')
    .trim();
}
