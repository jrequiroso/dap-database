# DAP Discovery Watch

DAP Discovery Watch is a deterministic weekly check for possible new DAP models. It watches manually configured official manufacturer pages plus a small retailer-sighting tier, compares detected product names against `src/data/daps.csv`, and creates a GitHub issue only when actionable candidates are found.

It never edits `src/data/daps.csv`, never creates DAP rows, never guesses specifications, and never uses AI services, search engines, forums, review sites, or general crawling. Retailer listings are treated as lower-trust sightings that require official or stronger verification before a row is added.

## Current Sources

Configured official sources:

- FiiO: `https://www.fiio.com/category`
- Shanling: `https://en.shanling.com/category/237`
- iBasso: `https://ibasso.com/product-category/dap/`
- Cayin: `https://en.cayin.cn/features/7/15/717.html`
- HiBy: `https://store.hiby.com/collections/music-player`
- Hidizs: `https://www.hidizs.net/collections/portable-music-player`
- QLS/Quloos: `https://www.qlshifi.com/en/?cate=2`

Configured retailer-sighting sources:

- HiFiGo: `https://hifigo.com/collections/portable-music-player`
- Linsoul: `https://www.linsoul.com/collections/digital-audio-players`

Official sources use brand-specific extractors in `scripts/discovery/extractors/`. Retailer sources use the shared retailer extractor and are filtered by known DAP brands plus DAP/music-player wording.

## Commands

Run a local dry run:

```bash
npm run discover:daps:dry-run
```

Run and use exit code `10` when actionable candidates are found:

```bash
npm run discover:daps
```

Run deterministic tests:

```bash
npm run test:discovery
```

Generated reports are written under `tmp/` and are ignored by git.

## Candidate Classifications

- `likely-new`: official source lists a product with no sufficiently close Brand + Model + Variant match.
- `possible-variant`: a close base-model match exists, but generation, edition, material, storage, or other variant text may matter.
- `retail-sighting`: retailer listing mentions a DAP-like product that is not already covered, but needs official or stronger verification.
- `possible-duplicate`: a very close match exists after safe normalization, but source naming differs.
- `needs-classification`: the extractor found a weak product-like entry that needs human review.

The watcher is conservative. False positives are acceptable; false certainty is not.

## Duplicate Issue Suppression

Each actionable candidate gets a deterministic fingerprint based on:

- brand
- normalized detected product name
- classification
- official product URL

The workflow checks open `[DAP Discovery]` issues for those fingerprints. If every current actionable fingerprint is already present in an open discovery issue, it does not create a duplicate issue.

## Weekly Workflow

`.github/workflows/dap-discovery.yml` runs every Monday and can also be run manually. Manual runs include a `create_issue` input so the full discovery path can be tested without opening an issue.

The workflow:

1. Installs dependencies with `npm ci`.
2. Runs discovery with `--no-exit-code` so candidates do not fail the job.
3. Uploads the Markdown and JSON reports as artifacts.
4. Checks open discovery issues for duplicate fingerprints.
5. Creates one issue only when there are new actionable candidates.

## Adding a Source

1. Verify the official manufacturer page manually.
2. Add a source in `scripts/discovery/sources.ts`.
3. Create a source-specific extractor in `scripts/discovery/extractors/`.
4. Add fixture HTML and deterministic tests.
5. Run `npm run test:discovery` and `npm run discover:daps -- --dry-run`.

Retailer sources must use `type: 'retailer'` and should stay limited to curated DAP category pages. Do not use search engine results, forums, review sites, or broad site crawling as automated discovery sources.
