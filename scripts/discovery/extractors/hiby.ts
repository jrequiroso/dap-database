import { anchorMatches, resolveUrl, stripTags, uniqueByNameAndUrl } from '../html';
import type { DiscoveredProduct, DiscoverySource } from '../types';

const acceptedPatterns = [
  /^RS8 II$/i,
  /^R1$/i,
  /^R3 II 2025$/i,
  /^R3 ?Pro II$/i,
  /^R4$/i,
  /^R6 III 2025$/i,
  /^R6 Pro II 2025$/i,
  /^R6 ?Pro Max$/i,
  /^R8 II(?: AL| Aluminum Alloy)?$/i,
  /^RS6(?: AL| Aluminum Alloy)?$/i,
  /^RS2$/i,
  /^M500(?: X Hatsune Miku)?$/i,
  /^M300\([^)]+\)$/i,
  /^HiBy R6 Pro II$/i,
];

export function extractHiby(html: string, source: DiscoverySource): DiscoveredProduct[] {
  const products: DiscoveredProduct[] = [];

  for (const anchor of anchorMatches(html)) {
    const name = cleanName(stripTags(anchor.inner));
    if (!name) continue;
    if (!/\/products\//i.test(anchor.href)) continue;
    if (!acceptedPatterns.some((pattern) => pattern.test(name))) continue;

    products.push({
      brand: source.brand,
      detectedName: `HiBy ${canonicalName(name)}`,
      productUrl: resolveUrl(anchor.href, source.url),
      sourceUrl: source.url,
      sourceType: source.type,
    });
  }

  return uniqueByNameAndUrl(products);
}

function cleanName(value: string): string {
  return value
    .replace(/\s+/g, ' ')
    .replace(/\s*[|].*$/, '')
    .trim();
}

function canonicalName(value: string): string {
  const normalized = value
    .replace(/^HiBy\s+/i, '')
    .replace(/\bR3Pro\b/i, 'R3 Pro')
    .replace(/\bR6Pro\b/i, 'R6 Pro')
    .replace(/\bR8 II AL\b/i, 'R8 II Aluminum Alloy')
    .replace(/\bRS6 AL\b/i, 'RS6 Aluminum Alloy')
    .replace(/\s+/g, ' ')
    .trim();
  return normalized.replace(/\bM300\((\d+)\+(\d+)GB\)$/i, 'M300 $1GB/$2GB');
}
