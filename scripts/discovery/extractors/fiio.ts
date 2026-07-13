import { anchorMatches, resolveUrl, stripTags, uniqueByNameAndUrl } from '../html';
import type { DiscoveredProduct, DiscoverySource } from '../types';

const productNamePattern = /^(ECHO NANO|ECHO MINI|M\d{1,2}(?:\s?(?:R2R|S|K|PRO))?|JM\d+|DISC)$/i;

export function extractFiio(html: string, source: DiscoverySource): DiscoveredProduct[] {
  const products: DiscoveredProduct[] = [];

  for (const anchor of anchorMatches(html)) {
    const name = stripTags(anchor.inner);
    if (!productNamePattern.test(name)) continue;
    if (/aliexpress|jadeaudio/i.test(anchor.href)) continue;

    products.push({
      brand: source.brand,
      detectedName: `FiiO ${name.replace(/\s+/g, ' ').trim()}`,
      productUrl: resolveUrl(anchor.href, source.url),
      sourceUrl: source.url,
      sourceType: source.type,
    });
  }

  return uniqueByNameAndUrl(products);
}
