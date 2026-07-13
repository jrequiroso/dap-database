import { readFileSync } from 'node:fs';
import { normalizeBaseModel, normalizeBrand, normalizeModelForComparison, normalizeText } from './normalize';
import type { DatabaseProduct } from './types';

export function parseCsv(input: string): Record<string, string>[] {
  const rows: string[][] = [];
  let field = '';
  let row: string[] = [];
  let inQuotes = false;

  for (let i = 0; i < input.length; i += 1) {
    const char = input[i];
    const next = input[i + 1];

    if (char === '"') {
      if (inQuotes && next === '"') {
        field += '"';
        i += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }

    if (char === ',' && !inQuotes) {
      row.push(field);
      field = '';
      continue;
    }

    if ((char === '\n' || char === '\r') && !inQuotes) {
      if (char === '\r' && next === '\n') i += 1;
      row.push(field);
      if (row.some((cell) => cell.trim() !== '')) rows.push(row);
      row = [];
      field = '';
      continue;
    }

    field += char;
  }

  row.push(field);
  if (row.some((cell) => cell.trim() !== '')) rows.push(row);

  const [headers = [], ...dataRows] = rows;
  return dataRows.map((dataRow) =>
    Object.fromEntries(headers.map((header, index) => [header.trim(), dataRow[index]?.trim() ?? ''])),
  );
}

export function readDatabaseProducts(csvPath: string): DatabaseProduct[] {
  return parseCsv(readFileSync(csvPath, 'utf8')).map((row) => {
    const brand = row.Brand ?? '';
    const model = row.Model ?? '';
    const variant = row.Variant ?? '';
    const displayName = [brand, model, variant].filter(Boolean).join(' ');
    return {
      brand,
      model,
      variant,
      displayName,
      normalizedBrand: normalizeBrand(brand),
      normalizedModel: normalizeModelForComparison(brand, model),
      normalizedIdentity: normalizeModelForComparison(brand, model, variant),
      normalizedBase: normalizeBaseModel(brand, model),
      normalizedCorpus: normalizeText(Object.values(row).join(' ')),
    };
  });
}
