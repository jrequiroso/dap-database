import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { resolve } from 'node:path';
import { classifyProduct } from './compare';
import { parseCsv } from './csv';
import { extractFiio } from './extractors/fiio';
import { extractHiby } from './extractors/hiby';
import { extractHidizs } from './extractors/hidizs';
import { extractQls } from './extractors/qls';
import { extractRetailer } from './extractors/retailer';
import { extractShanling } from './extractors/shanling';
import { resolveUrl } from './html';
import { fingerprint, normalizeBaseModel, normalizeModelForComparison } from './normalize';
import { renderReport } from './report';
import type { DatabaseProduct, DiscoveryResult, DiscoverySource } from './types';

const fixtureRoot = resolve('scripts/discovery/__fixtures__');

test('name normalization handles case, whitespace, hyphen spacing, unicode, and repeated brand', () => {
  assert.equal(normalizeModelForComparison('Cayin', 'Cayin N3-Pro'), 'n3pro');
  assert.equal(normalizeModelForComparison('Hidizs', 'HIDIZS   AP80 Pro MAX'), 'ap80 pro max');
});

test('CSV parser handles quoted commas', () => {
  const rows = parseCsv('Brand,Model,Variant,Notes\nFiiO,M27,,"one, two"\n');
  assert.equal(rows[0]?.Notes, 'one, two');
});

test('exact CSV match is classified as possible duplicate', () => {
  const candidate = classifyProduct(product('FiiO M27'), [db('FiiO', 'M27')]);
  assert.equal(candidate.classification, 'possible-duplicate');
});

test('obvious normalized duplicate compares closely', () => {
  const candidate = classifyProduct(product('Cayin N3-Pro'), [db('Cayin', 'N3Pro')]);
  assert.equal(candidate.classification, 'possible-duplicate');
});

test('official spacing differences like MAX and MK2 compare as duplicates', () => {
  assert.equal(classifyProduct(product('iBasso DX300MAX'), [db('iBasso', 'DX300 MAX')]).classification, 'possible-duplicate');
  assert.equal(classifyProduct(product('iBasso DX260MK2'), [db('iBasso', 'DX260 MK2')]).classification, 'possible-duplicate');
});

test('possible variant is detected when base model is close but variant text differs', () => {
  const candidate = classifyProduct(product('HiBy R5 Saber 2022'), [db('HiBy', 'R5')]);
  assert.equal(candidate.classification, 'possible-variant');
});

test('documented edition text is classified as duplicate instead of actionable variant', () => {
  const candidate = classifyProduct(product('Cayin N8 Brass Black'), [db('Cayin', 'N8', '', 'stainless steel brass black')]);
  assert.equal(candidate.classification, 'possible-duplicate');
  assert.equal(candidate.isActionable, false);
});

test('documented edition text can match the shortest base row instead of a longer similar model', () => {
  const candidate = classifyProduct(product('Hidizs AP80 Stainless Steel'), [
    db('Hidizs', 'AP80 Pro Max'),
    db('Hidizs', 'AP80', '', 'stainless steel'),
  ]);
  assert.equal(candidate.classification, 'possible-duplicate');
  assert.equal(candidate.closestMatch, 'Hidizs AP80');
  assert.equal(candidate.isActionable, false);
});

test('collaboration edition text is treated as a variant of the base player', () => {
  const candidate = classifyProduct(product('HiBy M500 X Hatsune Miku'), [db('HiBy', 'M500', 'WiFi')]);
  assert.equal(candidate.classification, 'possible-variant');
});

test('source names that omit existing row variant context are duplicates', () => {
  const candidate = classifyProduct(product('Hidizs AP30'), [db('Hidizs', 'AP30', 'Kickstarter')]);
  assert.equal(candidate.classification, 'possible-duplicate');
});

test('likely new product is detected when no close match exists', () => {
  const candidate = classifyProduct(product('FiiO M99'), [db('FiiO', 'M23')]);
  assert.equal(candidate.classification, 'likely-new');
});

test('retailer-only unmatched products are retail sightings', () => {
  const candidate = classifyProduct(
    {
      ...product('Muse HiFi MUSE 300'),
      brand: 'Muse HiFi',
      sourceType: 'retailer',
      sourceUrl: 'https://hifigo.com/collections/portable-music-player',
    },
    [db('FiiO', 'M23')],
  );
  assert.equal(candidate.classification, 'retail-sighting');
  assert.equal(candidate.isActionable, true);
});

test('FiiO extractor deduplicates repeated products and skips DAC amps', () => {
  const source = sourceFor('FiiO', 'https://www.fiio.com/category', 'fiio');
  const products = extractFiio(readFileSync(resolve(fixtureRoot, 'fiio.html'), 'utf8'), source);
  assert.deepEqual(products.map((item) => item.detectedName), ['FiiO M27', 'FiiO M23']);
});

test('relative URL resolution uses the source URL', () => {
  assert.equal(resolveUrl('/product/481', 'https://en.shanling.com/category/237'), 'https://en.shanling.com/product/481');
});

test('Shanling extractor removes generic Portable Player suffix', () => {
  const source = sourceFor('Shanling', 'https://en.shanling.com/category/237', 'shanling');
  const products = extractShanling(readFileSync(resolve(fixtureRoot, 'shanling.html'), 'utf8'), source);
  assert.deepEqual(products.map((item) => item.detectedName), ['Shanling M7T', 'Shanling M7']);
});

test('HiBy extractor keeps music players and skips set/case entries', () => {
  const source = sourceFor('HiBy', 'https://store.hiby.com/collections/music-player', 'hiby');
  const html = `
    <a href="/products/hiby-r3pro-ii">R3Pro II</a>
    <a href="/products/hiby-r8ii-aluminum-alloy-ver">R8 II AL</a>
    <a href="/products/hiby-digital-m300">M300(3+32GB)</a>
    <a href="/products/hiby-golden-10th-anniversary-set">Golden 10th Anniv. Set</a>
    <a href="/products/m300-silicone-case">M300 Silicone Case</a>
  `;
  const products = extractHiby(html, source);
  assert.deepEqual(products.map((item) => item.detectedName), [
    'HiBy R3 Pro II',
    'HiBy R8 II Aluminum Alloy',
    'HiBy M300 3GB/32GB',
  ]);
});

test('Hidizs extractor keeps DAPs and skips bundles/accessories', () => {
  const source = sourceFor('Hidizs', 'https://www.hidizs.net/collections/portable-music-player', 'hidizs');
  const html = `
    <a href="/products/hidizs-ap80-pro-max-all-in-one-hi-res-streaming-music-player">HIDIZS AP80 PRO MAX All-in-One Hi-Res Streaming Music Player</a>
    <a href="/products/ap80-pro-portable-lossless-music-player-special-edition">AP80 PRO Special Edition</a>
    <a href="/products/ap80-pro-max-leather-case">AP80 PRO MAX Leather Case</a>
    <a href="/products/ms3-ap80-pro-x-bundle">MS3 + AP80 PRO-X Bundle</a>
  `;
  const products = extractHidizs(html, source);
  assert.deepEqual(products.map((item) => item.detectedName), ['Hidizs AP80 Pro Max', 'Hidizs AP80 Pro Special Edition']);
});

test('QLS extractor keeps player models and skips non-player QA products', () => {
  const source = sourceFor('QLS', 'https://www.qlshifi.com/en/?cate=2', 'qls');
  const html = `
    <a href="/en/wzcapi/qa662.htm">QA662 HiFi Player & Digital Turntable</a>
    <a href="/en/wzcapi/qa390.htm">Quloos QA390 Movable Desktop Player</a>
    <a href="/en/wzcapi/qa390le.htm">QA390LE/MOD(QA390V2) Movable Desktop Player</a>
    <a href="/en/wzcapi/qa890.htm">QA890 24Bit 192Khz PCM & DSD(DoP) HiFi DAC</a>
  `;
  const products = extractQls(html, source);
  assert.deepEqual(products.map((item) => item.detectedName), [
    'QLS QA662',
    'QLS QA390',
    'QLS QA390LE/MOD(QA390V2)',
  ]);
});

test('retailer extractor keeps DAP listings and skips accessories or bundles', () => {
  const source = sourceFor('HiFiGo', 'https://hifigo.com/collections/portable-music-player', 'retailer');
  const html = `
    <a href="/products/ibasso-dx260mk2">iBasso DX260MK2 CS43198*8 Digital Audio Player</a>
    <a href="/products/hiby-r3-pro-ii">HiBy R3 Pro II / Pro 2 CS43198*2 Music Player</a>
    <a href="/products/fiio-m23">FiiO M23 AK4191EQ+AK4499EX High-Resolution Music Player</a>
    <a href="/products/fiio-m21-case">FiiO M21 Blue Leather Case</a>
    <a href="/products/ms3-ap80-pro-x-bundle">MS3 + AP80 PRO-X Bundle</a>
  `;
  const products = extractRetailer(html, source);
  assert.deepEqual(products.map((item) => item.detectedName), ['iBasso DX260 MK2', 'HiBy R3 Pro II', 'FiiO M23']);
  assert.deepEqual(products.map((item) => item.sourceType), ['retailer', 'retailer', 'retailer']);
});

test('report generation includes source failures and fingerprints', () => {
  const candidate = classifyProduct(product('FiiO M99'), [db('FiiO', 'M23')]);
  const report = renderReport({
    generatedAt: '2026-07-13T00:00:00.000Z',
    sourcesConfigured: 1,
    sourcesChecked: 0,
    sourceFailures: [{ source: sourceFor('FiiO', 'https://www.fiio.com/category', 'fiio'), error: 'HTTP 500' }],
    discoveredProducts: [candidate],
    candidates: [candidate],
    actionableCandidates: [candidate],
    reportPath: 'tmp/dap-discovery-report.md',
  } satisfies DiscoveryResult);

  assert.match(report, /Source failures/);
  assert.match(report, /dap-discovery-fingerprint:/);
});

test('candidate fingerprint is stable', () => {
  assert.equal(
    fingerprint(['FiiO', 'M27', 'likely-new', 'https://www.fiio.com/M27']),
    fingerprint(['fiio', 'm27', 'LIKELY-NEW', 'https://www.fiio.com/M27']),
  );
});

function product(detectedName: string) {
  return {
    brand: detectedName.split(' ')[0] ?? '',
    detectedName,
    productUrl: `https://example.test/${encodeURIComponent(detectedName)}`,
    sourceUrl: 'https://example.test/catalog',
    sourceType: 'catalog' as const,
  };
}

function db(brand: string, model: string, variant = '', corpus = ''): DatabaseProduct {
  return {
    brand,
    model,
    variant,
    displayName: [brand, model, variant].filter(Boolean).join(' '),
    normalizedBrand: brand.toLowerCase(),
    normalizedModel: normalizeModelForComparison(brand, model),
    normalizedIdentity: normalizeModelForComparison(brand, model, variant),
    normalizedBase: normalizeBaseModel(brand, model),
    normalizedCorpus: [normalizeModelForComparison(brand, model, variant), corpus].filter(Boolean).join(' '),
  };
}

function sourceFor(brand: string, url: string, extractor: DiscoverySource['extractor']): DiscoverySource {
  return { brand, url, extractor, enabled: true, type: extractor === 'retailer' ? 'retailer' : 'catalog' };
}
