import { readFileSync, appendFileSync } from 'node:fs';

type Options = {
  resultPath: string;
  issuesPath: string;
  reportPath: string;
};

type ResultFile = {
  actionableCandidates: Array<{ fingerprint: string }>;
};

type Issue = {
  body?: string;
};

const options = parseArgs(process.argv.slice(2));
const result = JSON.parse(readFileSync(options.resultPath, 'utf8')) as ResultFile;
const issues = JSON.parse(readFileSync(options.issuesPath, 'utf8')) as Issue[];
const existingFingerprints = new Set<string>();

for (const issue of issues) {
  for (const match of (issue.body ?? '').matchAll(/dap-discovery-fingerprint:([a-f0-9]+)/g)) {
    existingFingerprints.add(match[1] ?? '');
  }
}

const candidateFingerprints = result.actionableCandidates.map((candidate) => candidate.fingerprint);
const newFingerprints = candidateFingerprints.filter((fingerprint) => !existingFingerprints.has(fingerprint));
const shouldCreateIssue = newFingerprints.length > 0;

const outputPath = process.env.GITHUB_OUTPUT;
if (outputPath) {
  appendFileSync(
    outputPath,
    [
      `should_create_issue=${shouldCreateIssue}`,
      `new_fingerprint_count=${newFingerprints.length}`,
      `candidate_count=${candidateFingerprints.length}`,
      `report_path=${options.reportPath}`,
      '',
    ].join('\n'),
    'utf8',
  );
}

console.log(`Existing actionable fingerprints: ${existingFingerprints.size}`);
console.log(`Current actionable fingerprints: ${candidateFingerprints.length}`);
console.log(`New actionable fingerprints: ${newFingerprints.length}`);

function parseArgs(args: string[]): Options {
  const options: Options = {
    resultPath: 'tmp/dap-discovery-result.json',
    issuesPath: 'tmp/dap-discovery-open-issues.json',
    reportPath: 'tmp/dap-discovery-report.md',
  };

  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    if (arg === '--result') options.resultPath = args[++index] ?? options.resultPath;
    else if (arg === '--issues') options.issuesPath = args[++index] ?? options.issuesPath;
    else if (arg === '--report') options.reportPath = args[++index] ?? options.reportPath;
  }

  return options;
}
