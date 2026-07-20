import assert from 'node:assert/strict';
import test from 'node:test';
import {
  calculateCoverage,
  coreFieldDefinitions,
  resolveFieldState,
  rowCoverage,
  technicalFieldDefinitions,
  type CsvRow,
} from '../src/utils/coverage';

function baseRow(overrides: Partial<CsvRow> = {}): CsvRow {
  return {
    Brand: 'Example',
    Model: 'Player',
    Variant: '',
    'Release Year': '2024',
    Status: 'Active',
    'MSRP USD': '999',
    SoC: 'Snapdragon 665',
    OS: 'Android 12',
    'RAM GB': '4',
    'Storage GB': '64',
    microSD: 'TRUE',
    'Battery mAh': '4500',
    DAC: 'ES9038Q2M',
    '3.5mm': 'TRUE',
    '4.4mm': 'TRUE',
    '2.5mm': 'FALSE',
    '6.35mm': 'FALSE',
    'SE Power mW': '120',
    'BAL Power mW': '400',
    Bluetooth: 'TRUE',
    'Wi-Fi': 'TRUE',
    'Bluetooth Version': '5.0',
    'Streaming Services': 'TIDAL / Qobuz',
    'Storage Expansion Max': '2TB',
    'USB Port': 'USB-C',
    'Battery Life Hours': '10',
    Weight: '200g',
    Dimensions: '120 x 70 x 15 mm',
    Notes: 'Verified - Official.',
    review_notes: '',
    ...overrides,
  };
}

function core(field: string) {
  const definition = coreFieldDefinitions.find((entry) => entry.field === field);
  assert.ok(definition, `Missing core definition for ${field}`);
  return definition;
}

function technical(field: string) {
  const definition = technicalFieldDefinitions.find((entry) => entry.field === field);
  assert.ok(definition, `Missing technical definition for ${field}`);
  return definition;
}

test('populated field resolves to known', () => {
  assert.equal(resolveFieldState(baseRow(), core('DAC')).state, 'known');
});

test('blank applicable field resolves to missing', () => {
  assert.equal(resolveFieldState(baseRow({ DAC: '' }), core('DAC')).state, 'missing');
});

test('Sony blank SoC resolves to undisclosed', () => {
  assert.equal(resolveFieldState(baseRow({ Brand: 'Sony', SoC: '' }), technical('SoC')).state, 'undisclosed');
});

test('non-Android legacy player blank RAM resolves to not_applicable', () => {
  assert.equal(resolveFieldState(baseRow({ OS: 'HiBy OS', 'RAM GB': '' }), technical('RAM GB')).state, 'not_applicable');
});

test('device without balanced output does not count blank BAL Power mW as missing', () => {
  const row = baseRow({ '4.4mm': 'FALSE', '2.5mm': 'FALSE', 'Balanced Output Type': '', 'BAL Power mW': '' });
  assert.equal(resolveFieldState(row, core('BAL Power mW')).state, 'not_applicable');
  assert.equal(rowCoverage(row).actionableMissing.includes('BAL Power mW'), false);
});

test('device without microSD does not count Storage Expansion Max as missing', () => {
  const row = baseRow({ microSD: 'FALSE', 'Storage Expansion Max': '' });
  assert.equal(resolveFieldState(row, core('Storage Expansion Max')).state, 'not_applicable');
});

test('active model with actionable core blank is current model incomplete', () => {
  const summary = calculateCoverage([baseRow({ DAC: '' })], () => false);
  assert.equal(summary.currentModelsIncomplete, 1);
});

test('row with only undisclosed and not applicable blanks can be core complete', () => {
  const row = baseRow({
    Brand: 'Sony',
    SoC: '',
    '4.4mm': 'FALSE',
    '2.5mm': 'FALSE',
    'Balanced Output Type': '',
    'BAL Power mW': '',
    microSD: 'FALSE',
    'Storage Expansion Max': '',
    Notes: 'Sony does not publish the processor. No balanced output. No microSD.',
  });
  assert.equal(rowCoverage(row).isCoreComplete, true);
});

test('actionable missing excludes undisclosed and not_applicable fields', () => {
  const summary = calculateCoverage([
    baseRow({ Brand: 'Sony', SoC: '', DAC: '' }),
    baseRow({ '4.4mm': 'FALSE', '2.5mm': 'FALSE', 'Balanced Output Type': '', 'BAL Power mW': '' }),
  ], () => false);

  assert.equal(summary.actionableMissingFields, 1);
});

test('applicable field coverage uses known plus missing plus needs verification denominator', () => {
  const summary = calculateCoverage([baseRow({ DAC: '', Notes: 'USB Port needs verification.' })], () => false);
  assert.equal(summary.applicableCoveragePct, 89);
  assert.equal(summary.needsVerificationFields, 1);
});

test('needs review flags are preserved through injected review predicate', () => {
  const summary = calculateCoverage([baseRow({ review_notes: 'Needs review: source conflict.' })], (row) => row.review_notes.includes('Needs review'));
  assert.equal(summary.needsReviewRows, 1);
});

test('row order identities can use brand model and variant without model-only collisions', () => {
  const rows = [
    baseRow({ Brand: 'HiBy', Model: 'M500', Variant: '4G', DAC: '' }),
    baseRow({ Brand: 'HiBy', Model: 'M500', Variant: 'WiFi' }),
  ];
  const summary = calculateCoverage(rows, () => false);
  assert.equal(summary.rows[0].row.Variant, '4G');
  assert.equal(summary.rows[0].actionableMissing.includes('DAC'), true);
  assert.equal(summary.rows[1].row.Variant, 'WiFi');
});
