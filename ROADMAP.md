# DAP Database Roadmap

This is a working list of models planned for future addition.

Inclusion depends on available sources and whether the device fits the DAP Database scope.

The current database already has 110 DAPs. This roadmap avoids intentionally repeating models that are already in the database.

## Status Labels

- Planned: intended for future addition
- Variant check: may be added separately if specs differ
- Scope check: may not fit the DAP-only scope
- Excluded for now: not currently planned because it is not a DAP or does not fit the database scope
- Already in database: confirmed existing row, do not add again

## Source Rules

Official sources are preferred.

Source priority:

1. Official product page
2. Official manual / support page
3. Official store page
4. Archived official page
5. Trusted review site
6. Reputable retailer
7. Community source

If official sources are unavailable, add the row only when at least two reliable secondary sources agree on the core specs.

If only one secondary source is available, the row may be added as Partial or Unverified, with uncertain fields left blank.

Do not guess specs from memory.

## Variant Rules

Separate variant rows should be added only when the variant has meaningful hardware or spec differences.

Add a separate row when the variant changes:

- DAC
- amp section
- output ports
- operating system/platform
- battery
- RAM/storage configuration, if it affects the model identity
- wireless/cellular configuration
- major chassis/material design
- decoding support
- modular amp/DAC configuration

Do not add a separate row just for:

- color variants
- storage-only variants
- regional naming
- bundle/package differences
- limited editions with the same internals

When unsure, add the base model first and note possible variants for later review.

## Alias Notes

Some DAPs are commonly searched using shorthand, alternate spacing, generation names, or regional names.

Long term, the CSV should include a dedicated aliases column so search can match these terms without creating duplicate rows.

Examples:

- HiBy R2 II: R2 II, R2 Gen 2, R2II, R2G2
- HiBy R3 II: R3 II, R3 Gen 2, R3g2, R3G2
- Sony NW-A55: A55, Walkman A55
- Sony NW-A105: A105, Walkman A105
- Sony NW-A306: A306, Walkman A306
- Sony NW-ZX707: ZX707, Walkman ZX707
- FiiO JM21: JM21, Fiio JM21, FiiO JM21
- Shanling M0 Pro: M0 Pro, Shanling M0Pro
- Shanling M1s: M1s, Shanling M1S

Until an aliases column exists, aliases may be documented in Notes, but they should not create duplicate model rows.

## Recently Added

These rows have been added and should not be duplicated in future passes.

- Lotoo PAW Gold Touch
- Lotoo PAW Gold Touch 2
- Lotoo PAW 6000
- Luxury & Precision P6
- Luxury & Precision P6 Pro
- Cowon Plenue D
- Cowon Plenue D2
- Onkyo DP-X1A
- Pioneer XDP-300R
- Questyle QP1R
- Questyle QP2R

## High Priority: Popular Legacy Models

These should be prioritized because they are commonly discussed, historically important, or useful for real-world buying/comparison searches.

- HiBy R2 II / R2 Gen 2
- HiBy R3
- HiBy R5
- HiBy R5 Saber
- HiBy R6
- HiBy R6 Pro
- HiBy R6 2020
- HiBy R6 Pro 2020
- Shanling M1s
- FiiO M6
- FiiO M11 Pro
- Sony NW-A55
- Sony NW-A105
- Sony NW-WM1A
- Sony NW-WM1Z
- iBasso DX200
- iBasso DX220

## Addition Wave: Lotoo

Current database already includes multiple Lotoo models, so avoid duplicating those rows.

- Lotoo PAW 5000
- Lotoo PAW 5000 MKII
  - Separate row from PAW 5000
- Lotoo PAW Pico
- Lotoo Mjolnir
  - Scope check: may be transportable source gear rather than pocket DAP

Already in database:

- Lotoo PAW Gold Touch
- Lotoo PAW Gold Touch 2 / PAW GT2
- Lotoo PAW 6000

Naming note:

PAW Gold Touch may be abbreviated as PAW GT or LPGT. PAW Gold Touch 2 may be abbreviated as PAW GT2 or LPGT2. Do not add abbreviation-only duplicate rows.

Variant note:

Lotoo special editions should only be added if hardware, chassis material, or specs meaningfully differ. Do not add color-only or bundle-only editions.

## Addition Wave: Luxury & Precision

Luxury & Precision is now represented in the database. Remaining additions should focus on clearly sourced models and meaningful variants.

- Luxury & Precision P6 Pro Ti99
  - Variant check: add separately if chassis/material/spec differences are meaningful
- Luxury & Precision LP6
- Luxury & Precision LP6 Gold
  - Variant check: add separately if hardware/chassis/specs differ from LP6
- Luxury & Precision LP6 Ti
  - Variant check: add separately if hardware/chassis/specs differ from LP6
- Luxury & Precision E7
  - Variant check: modular amp/DAC cards may need notes or separate variant handling
- Luxury & Precision P1

Already in database:

- Luxury & Precision P6
- Luxury & Precision P6 Pro

Excluded for now:

- Luxury & Precision W4
- Luxury & Precision W4 EX

Reason:

These are dongle DAC/amps, not standalone DAPs.

## Addition Wave: Cowon / Plenue Legacy

Cowon/Plenue is now represented in the database. Remaining additions should fill the wider Plenue family.

- Cowon Plenue J
- Cowon Plenue R
- Cowon Plenue R2
  - Separate row from Plenue R
- Cowon Plenue M
- Cowon Plenue M2
  - Separate row from Plenue M
- Cowon Plenue 1
- Cowon Plenue 2
- Cowon Plenue 2 MKII
  - Separate row from Plenue 2
- Cowon Plenue S
- Cowon Plenue L
- Cowon Plenue V

Already in database:

- Cowon Plenue D
- Cowon Plenue D2

Variant note:

Cowon variants are usually distinct enough when marked D2, R2, M2, MKII, etc. Color-only variants should be skipped.

## Addition Wave: Onkyo / Pioneer Android DAP Era

Onkyo and Pioneer are now represented in the database. Remaining additions should fill the older Android DAP families.

- Onkyo DP-S1
- Onkyo DP-S1A
  - Separate row from DP-S1 if specs differ
- Onkyo DP-X1
- Pioneer XDP-30R
- Pioneer XDP-100R

Already in database:

- Onkyo DP-X1A
- Pioneer XDP-300R

Variant note:

Watch for regional naming and storage variants.

## Addition Wave: Questyle

Questyle is now represented in the database. Remaining additions should focus on later high-end models.

- Questyle QPM
- Questyle QP3R
  - Needs source validation before adding

Already in database:

- Questyle QP1R
- Questyle QP2R

Variant note:

Skip limited color/material editions unless there are hardware or official spec differences.

## Addition Wave: HiBy Cleanup

Current database already includes several HiBy models, but these older/common models are still missing.

- HiBy R2
- HiBy R2 II / R2 Gen 2
  - Separate row from R2 if specs differ
  - Add search aliases: R2 II, R2 Gen 2, R2II, R2G2
- HiBy R3
  - Separate from R3 Pro / R3 Pro Saber / R3 II
- HiBy R5
- HiBy R5 Saber
  - Separate row from R5 if DAC/output/specs differ
- HiBy R6
- HiBy R6 Pro
- HiBy R6 2020
  - Variant check: separate row if hardware differs from original R6
- HiBy R6 Pro 2020
  - Variant check: separate row if hardware differs from original R6 Pro

Already in database:

- HiBy M300
- HiBy M500 4G
- HiBy M500 WiFi
- HiBy R1
- HiBy R3 II 2025
- HiBy R3 Pro
- HiBy R3 Pro Saber / 2020
- HiBy R3 Pro Saber 2022
- HiBy R4
- HiBy R5 II / Gen 2
- HiBy R6 III 2025
- HiBy R6 Pro II
- HiBy R8 II
- HiBy RS2
- HiBy RS6
- HiBy RS8
- HiBy RS8 II

## Addition Wave: Sony Walkman Legacy

The current database covers newer Android Walkmans and WM1 M2 models. This wave fills older and popular legacy models.

- Sony NW-A40 Series
  - Variant check: NW-A45 / NW-A46 / NW-A47 may be storage/regional variants
  - Prefer one family row unless specs differ
- Sony NW-A55
- Sony NW-A100 Series
  - Variant check: NW-A105 / NW-A106 / NW-A107 may be storage/regional variants
  - Prefer one family row unless specs differ
- Sony NW-ZX300
- Sony NW-ZX500 / NW-ZX505
  - Variant check: may overlap with NW-ZX507 depending region/storage
- Sony NW-WM1A
- Sony NW-WM1Z

Already in database:

- Sony NW-A306
- Sony NW-A307
- Sony NW-ZX507
- Sony NW-ZX707
- Sony NW-WM1AM2
- Sony NW-WM1ZM2

Variant note:

Sony model numbers often represent region/storage variants. Avoid duplicate rows unless specs differ.

## Addition Wave: FiiO Legacy and Cleanup

The current database has strong modern FiiO coverage. This wave fills older models.

- FiiO M3
- FiiO M3K
  - Separate row from M3
- FiiO M5
- FiiO M6
- FiiO M11 Pro
  - Separate row from M11
- FiiO X1
- FiiO X1 II
  - Separate row from X1
- FiiO X3
- FiiO X3 II
  - Separate row from X3
- FiiO X3 III
  - Separate row from X3 II
- FiiO X5
- FiiO X5 II
  - Separate row from X5
- FiiO X7
  - Separate row from X7 Mark II

Already in database:

- FiiO JM21 original 3GB/32GB
- FiiO JM21 4GB/64GB Refresh
- FiiO M7
- FiiO M9
- FiiO M11
- FiiO M11 Plus ESS
- FiiO M11 Plus LTD
- FiiO M11S
- FiiO M15
- FiiO M15S
- FiiO M17
- FiiO M21
- FiiO M23
- FiiO Snowsky Disc
- FiiO Snowsky Echo Mini
- FiiO Snowsky Echo Nano
- FiiO X5 III
- FiiO X7 Mark II

Variant note:

Skip Stainless Steel, color, and bundle editions unless specs differ.

## Addition Wave: Astell&Kern History and Midrange

The current database already includes newer/high-priority Astell&Kern models, so this wave focuses on missing older and midrange units.

- Astell&Kern A&norma SR15
- Astell&Kern A&norma SR25
- Astell&Kern A&norma SR25 MKII
  - Separate row from SR25
- Astell&Kern A&futura SE100
- Astell&Kern A&futura SE180
  - Variant check: DAC module variants may need notes or separate variant rows if sold/configured distinctly
- Astell&Kern A&futura SE200
- Astell&Kern A&futura SE300
- Astell&Kern A&futura SE300 Titan
  - Variant check: add separately only if material/spec differences are worth tracking
- Astell&Kern A&ultima SP1000
- Astell&Kern A&ultima SP1000M
  - Separate row from SP1000
- Astell&Kern A&ultima SP2000
- Astell&Kern A&ultima SP2000T
  - Separate row from SP2000
- Astell&Kern KANN
- Astell&Kern KANN Cube
- Astell&Kern KANN Alpha
- Astell&Kern SA700
- Astell&Kern AK70
- Astell&Kern AK70 MKII
  - Separate row from AK70
- Astell&Kern AK Jr

Already in database:

- Astell&Kern A&norma SR35
- Astell&Kern A&ultima SP3000
- Astell&Kern A&ultima SP3000M
- Astell&Kern A&ultima SP3000T
- Astell&Kern A&ultima SP4000
- Astell&Kern KANN MAX
- Astell&Kern KANN ULTRA
- Astell&Kern PD10
- Astell&Kern PD20

Variant note:

Astell&Kern often has limited material/color editions. Do not add those unless specs, chassis material, or major hardware meaningfully differ.

## Addition Wave: iBasso Legacy and MAX Models

The current database covers many modern iBasso models. This wave fills older and MAX variants.

- iBasso DX50
- iBasso DX80
- iBasso DX90
- iBasso DX120
- iBasso DX150
  - Variant check: amp module configuration may need notes
- iBasso DX200
  - Variant check: amp module configuration may need notes
- iBasso DX220
  - Variant check: amp module configuration may need notes
- iBasso DX220 MAX
  - Separate row from DX220
- iBasso DX300 MAX
  - Separate row from DX300
- iBasso DX320 MAX Ti
  - Separate row from DX320 / DX320 MAX

Already in database:

- iBasso DX160
- iBasso DX170
- iBasso DX180
- iBasso DX240
- iBasso DX260
- iBasso DX270
- iBasso DX300
- iBasso DX320
- iBasso DX340

Variant note:

For modular iBasso players, the base row should note stock amp module. Add separate variant rows only if a model was officially sold with a distinct stock module/configuration.

## Addition Wave: Shanling Cleanup

The current database already has many Shanling models. This wave fills missing older models and naming variants.

- Shanling M1
- Shanling M1s
  - Separate row from M1
- Shanling M2
- Shanling M2s
  - Separate row from M2
- Shanling M5
- Shanling M5s
  - Separate row from M5
- Shanling Q1
- Shanling M6 21
  - Separate row or variant row from original M6 if hardware differs
- Shanling M6 Pro 21
  - Separate row or variant row from original M6 Pro if hardware differs
- Shanling M9 Plus
  - Separate row from M9
- Shanling M7T

Needs naming check:

- Shanling M6 Pro 2021
  - May be the same as M6 Pro 21. Do not duplicate until verified.

Already in database:

- Shanling M0 Pro
- Shanling M0 Pura
- Shanling M1 Plus
- Shanling M2X
- Shanling M3 Plus
- Shanling M3 Ultra
- Shanling M3X
- Shanling M5 Ultra
- Shanling M6
- Shanling M6 Pro
- Shanling M6 Ultra
- Shanling M7
- Shanling M8
- Shanling M8T
- Shanling M9

Variant note:

Shanling naming can be messy. Confirm whether "21" and "2021" names refer to the same model before adding.

## Addition Wave: Other Modern / Relevant DAPs

These are secondary additions after the major brand gaps are handled.

- ONIX Overture XM5
- HIFIMAN HM901R
- HIFIMAN HM1000
  - Scope check: may be source/transportable gear depending configuration
- HIFIMAN R2R2000
- HiFiMAN SuperMini
- HiFiMAN MegaMini
- xDuoo X2S
- xDuoo X3
- xDuoo X3 II
  - Separate row from X3
- xDuoo X10
- xDuoo X20
- Colorfly C4
- Colorfly U8
- Colorfly U6
- Phinistec S7

Already in database:

- ONIX XM2

Excluded for now:

- Colorfly CDA-M1P

Reason:

Likely dongle DAC/amp, not DAP.

Variant note:

HIFIMAN and Colorfly models may need extra scope checking because some are transportable/source devices rather than conventional pocket DAPs.

## Addition Wave: Budget / AliExpress-Style DAPs

These should be added later because budget models often have inconsistent specs, relabels, and silent revisions.

- Ruizu A55
- Ruizu A58
- Ruizu X02
- Ruizu X50
- Benjie S5
- Benjie K9
- AGPTEK H3
- AGPTEK H50
- AGPTEK A02
- Mechen M30
- Mechen M31
- Mechen M3

Variant note:

Budget DAPs often have inconsistent listings, relabels, and silent revisions. Add only when sources are clear enough. Avoid duplicate rows for obvious rebrands unless there is enough evidence that they are sold as meaningfully different models.

## Excluded / Not Currently Planned

These are not planned for the DAP Database unless the project scope expands.

- Luxury & Precision W4
- Luxury & Precision W4 EX
- Colorfly CDA-M1P

Reason:

These are dongle DAC/amps, not standalone DAPs.

## Already Covered Brand Notes

These brands/models already have substantial coverage in the current database.

### Activo

Already in database:

- Activo P1

No current Activo roadmap wave needed unless more models are identified.

### Cayin

Already in database:

- Cayin N3Ultra
- Cayin N3Pro
- Cayin N5ii
- Cayin N5iiS
- Cayin N6ii
- Cayin N6iii
- Cayin N7
- Cayin N8
- Cayin N8ii
- Cayin N8iii
- Cayin i5

No current Cayin roadmap wave needed unless more models or variants are identified.

### Hidizs

Already in database:

- Hidizs AP30
- Hidizs AP80
- Hidizs AP80 Pro
- Hidizs AP80 Pro Max
- Hidizs AP80 Pro X

No current Hidizs roadmap wave needed unless more DAP models are identified.

### HiFi Walker

Already in database:

- HiFi Walker H2
- HiFi Walker H2 Touch

No current HiFi Walker roadmap wave needed unless more models are identified.

### Surfans

Already in database:

- Surfans F20
- Surfans F28
- Surfans F35

No current Surfans roadmap wave needed unless more models are identified.

### TempoTec

Already in database:

- TempoTec V3
- TempoTec V6

No current TempoTec roadmap wave needed unless more models are identified.
