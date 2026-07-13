import { appendFileSync, mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { classifyProducts } from './compare';
import { readDatabaseProducts } from './csv';
import { fetchSource } from './fetch';
import { extractProducts } from './extractors';
import { writeReport } from './report';
import { discoverySources } from './sources';
import type { Candidate, DiscoveredProduct, DiscoveryResult, SourceFailure } from './types';

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '../..');

type Options = {
  reportPath: string;
  resultPath: string;
  noExitCode: boolean;
  dryRun: boolean;
};

async function main(): Promise<void> {
  const options = parseArgs(process.argv.slice(2));
  const enabledSources = discoverySources.filter((source) => source.enabled);
  const database = readDatabaseProducts(resolve(projectRoot, 'src/data/daps.csv'));
  const discoveredProducts: DiscoveredProduct[] = [];
  const sourceFailures: SourceFailure[] = [];

  for (const source of enabledSources) {
    try {
      const html = await fetchSource(source);
      discoveredProducts.push(...extractProducts(html, source));
    } catch (error) {
      sourceFailures.push({
        source,
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

  const uniqueProducts = deduplicateProducts(discoveredProducts);
  const candidates = deduplicateCandidates(classifyProducts(uniqueProducts, database));
  const actionableCandidates = candidates.filter((candidate) => candidate.isActionable);
  const reportPath = resolve(projectRoot, options.reportPath);
  const resultPath = resolve(projectRoot, options.resultPath);
  const result: DiscoveryResult = {
    generatedAt: new Date().toISOString(),
    sourcesConfigured: enabledSources.length,
    sourcesChecked: enabledSources.length - sourceFailures.length,
    sourceFailures,
    discoveredProducts: uniqueProducts,
    candidates,
    actionableCandidates,
    reportPath: options.reportPath,
  };

  writeReport(result, reportPath);
  mkdirSync(dirname(resultPath), { recursive: true });
  writeFileSync(resultPath, `${JSON.stringify(result, null, 2)}\n`, 'utf8');
  writeGithubOutputs(result, options);

  console.log(`DAP discovery checked ${result.sourcesChecked}/${result.sourcesConfigured} sources.`);
  console.log(`Discovered products: ${result.discoveredProducts.length}`);
  console.log(`Actionable candidates: ${result.actionableCandidates.length}`);
  console.log(`Report: ${options.reportPath}`);

  if (options.dryRun) {
    for (const candidate of result.actionableCandidates) {
      console.log(`${candidate.classification}: ${candidate.detectedName} [${candidate.fingerprint}]`);
    }
  }

  if (result.actionableCandidates.length > 0 && !options.noExitCode) {
    process.exitCode = 10;
  }
}

function parseArgs(args: string[]): Options {
  const options: Options = {
    reportPath: 'tmp/dap-discovery-report.md',
    resultPath: 'tmp/dap-discovery-result.json',
    noExitCode: false,
    dryRun: false,
  };

  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    if (arg === '--report') options.reportPath = args[++index] ?? options.reportPath;
    else if (arg === '--result') options.resultPath = args[++index] ?? options.resultPath;
    else if (arg === '--no-exit-code') options.noExitCode = true;
    else if (arg === '--dry-run') {
      options.dryRun = true;
      options.noExitCode = true;
    }
  }

  return options;
}

function deduplicateProducts(products: DiscoveredProduct[]): DiscoveredProduct[] {
  const seen = new Set<string>();
  const output: DiscoveredProduct[] = [];
  for (const product of products) {
    const key = `${product.brand}|${product.detectedName}|${product.productUrl}`.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    output.push(product);
  }
  return output;
}

function deduplicateCandidates(candidates: Candidate[]): Candidate[] {
  const seen = new Set<string>();
  const output: Candidate[] = [];
  for (const candidate of candidates) {
    if (seen.has(candidate.fingerprint)) continue;
    seen.add(candidate.fingerprint);
    output.push(candidate);
  }
  return output;
}

function writeGithubOutputs(result: DiscoveryResult, options: Options): void {
  const outputPath = process.env.GITHUB_OUTPUT;
  if (!outputPath) return;
  appendFileSync(
    outputPath,
    [
      `has_candidates=${result.actionableCandidates.length > 0}`,
      `candidate_count=${result.actionableCandidates.length}`,
      `report_path=${options.reportPath}`,
      `result_path=${options.resultPath}`,
      '',
    ].join('\n'),
    'utf8',
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
