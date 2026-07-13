import { anchorMatches, resolveUrl, stripTags, uniqueByNameAndUrl } from '../html';
import type { DiscoveredProduct, DiscoverySource } from '../types';

const dxPattern = /^DX[\dA-Z+\-\s]+$/i;

export function extractIbasso(html: string, source: DiscoverySource): DiscoveredProduct[] {
  const products: DiscoveredProduct[] = [];

  for (const anchor of anchorMatches(html)) {
    const name = stripTags(anchor.inner).replace(/\s+/g, ' ').trim();
    if (!dxPattern.test(name)) continue;
    if (/case|faceplate/i.test(name)) continue;
    if (!/\/product\//i.test(anchor.href)) continue;

    products.push({
      brand: source.brand,
      detectedName: `iBasso ${name}`,
      productUrl: resolveUrl(anchor.href, source.url),
      sourceUrl: source.url,
      sourceType: source.type,
    });
  }

  return uniqueByNameAndUrl(products);
}
