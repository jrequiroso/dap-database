# DAP Database Audit Pass 6: HiBy

Input: `/mnt/data/daps_audit_latest.csv`
Output: `/mnt/data/daps_audit_pass6_hiby.csv`

Rows parsed in original pass snapshot: 236
Rows after variant-row sync: 240
Current canonical rows at validation time: 240
HiBy rows audited: 31
Field changes: 34
Needs-review flags: 16
Battery Life Hours non-numeric remaining: 0 nonblank values

Validation note: `daps_audit_pass6_hiby.csv` was originally generated from a 236-row snapshot. It has now been synced to the canonical 240-row variant model by replacing old unsplit M11 Plus LTD, M23, M27, and SP4000 rows with their current split rows. Row identities now match the canonical CSV.

## Summary

This pass focused on HiBy rows, using current official HiBy store/wiki pages where the text extraction exposed specs, and exact-model review sources where official pages are missing, image-only, redirected, or no longer represent the older model.

## MSRP policy

`MSRP USD` stores the original launch MSRP or official launch list price in USD when source-backed. Do not overwrite it with current sale, promo, open-box, used, clearance, or coupon pricing. For currently sold products where launch MSRP is hard to find, use: official launch MSRP first; official regular product-page price only when clearly not a sale price; reputable retailer regular price near launch; otherwise leave blank. Current availability pricing belongs in notes or buy links, not `MSRP USD`.

Key changes:

- Filled HiBy R6 III 2025 dimensions and weight from the official current product page.
- Changed HiBy R6 III 2023 Source URL to the exact Headfonics review source to keep it distinct from the 2025 CS43198 refresh.
- Normalized R3Pro II OS, DAC wording, amp field, and weight unit from official HiBy page text.
- Filled M300 Bluetooth Version and Wi-Fi Bands from the official HiBy guide.
- Corrected RS8 Battery Life Hours from 8 to 12 because the official page lists 12h SE and 8h balanced; numeric field now uses the highest official local playback value.
- Normalized several unitless HiBy weights to values with `g`.
- Switched R8 Source URL from a generic HiBy help-center listing to an exact-model review source.
- Flagged M500 technical specs, R3 Pro Saber original-vs-2022 source mismatch, R5 II mode-specific battery detail, and several older review-only rows for manual review rather than guessing.
- Left R6 Pro Max MSRP at the existing value because the current official store price is not enough evidence to replace launch/list MSRP.

## Manual-review posture

Rows remain unresolved when the available source is image-based, review-only, variant-specific, or when current store pages no longer represent an older model exactly.
