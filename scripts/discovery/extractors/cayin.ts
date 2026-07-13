import { anchorMatches, resolveUrl, stripTags, uniqueByNameAndUrl } from '../html';
import type { DiscoveredProduct, DiscoverySource } from '../types';

const dapNamePattern = /^N\d[\w+.\-\s]*(?:\sSeries)?(?:\s\+\sAmber Pearl)?$/i;

export function extractCayin(html: string, source: DiscoverySource): DiscoveredProduct[] {
  const products: DiscoveredProduct[] = [];

  for (const anchor of anchorMatches(html)) {
    const name = stripTags(anchor.inner).replace(/\s+/g, ' ').trim();
    if (!dapNamePattern.test(name)) continue;
    if (!/features\/7\/15\//i.test(anchor.href)) continue;

    products.push({
      brand: source.brand,
      detectedName: `Cayin ${name}`,
      productUrl: resolveUrl(anchor.href, source.url),
      sourceUrl: source.url,
      sourceType: source.type,
    });
  }

  return uniqueByNameAndUrl(products);
}
