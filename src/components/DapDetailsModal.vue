<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted } from 'vue';
import { ChevronLeft, ChevronRight, ExternalLink, X } from 'lucide-vue-next';
import type { Dap, MixedSpecValue } from '../types/dap';
import { formatBattery, formatColors, formatPower, formatPrice, formatValue, hasValue } from '../utils/formatters';
import { getStatusBadgeMeta, getVerificationBadgeMeta, imageUrlForDap, isAndroidBased } from '../utils/dapDisplay';
import DapPhoto from './DapPhoto.vue';

const props = defineProps<{
  dap: Dap | null;
  previousDap?: Dap | null;
  nextDap?: Dap | null;
}>();

const emit = defineEmits<{
  close: [];
  navigate: [dap: Dap];
}>();

interface DetailRow {
  label: string;
  value: string;
}

interface BuyGroup {
  label: string;
  links: Array<{ label: string; url: string; affiliate?: boolean }>;
}

const referenceLinkRel = 'noopener noreferrer nofollow';
const affiliateLinkRel = 'noopener noreferrer nofollow sponsored';

function handleKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape' && props.dap) emit('close');
  if (event.key === 'ArrowLeft' && props.previousDap) emit('navigate', props.previousDap);
  if (event.key === 'ArrowRight' && props.nextDap) emit('navigate', props.nextDap);
}

function textValue(value: MixedSpecValue | boolean | undefined): string {
  if (!hasValue(value)) return '';
  return formatValue(value);
}

function listValue(values: string[] | null | undefined): string {
  return values?.length ? formatColors(values) : '';
}

function gbValue(value: MixedSpecValue | undefined): string {
  if (!hasValue(value)) return '';
  if (typeof value === 'number') return `${value.toLocaleString('en-US')}GB`;
  const raw = String(value).trim();
  return /(?:gb|tb)$/i.test(raw) ? raw : `${raw}GB`;
}

function powerValue(power: MixedSpecValue | undefined, load: string): string {
  if (!hasValue(power)) return '';
  const formattedPower = formatPower(power);
  return hasValue(load) ? `${formattedPower} @ ${load}` : formattedPower;
}

function addRow(rows: DetailRow[], label: string, value: string) {
  if (value) rows.push({ label, value });
}

const summaryItems = computed(() => {
  if (!props.dap) return [];
  const dap = props.dap;
  const items = [
    hasValue(dap.releaseYear) ? formatValue(dap.releaseYear) : '',
    hasValue(dap.msrpUsd) ? formatPrice(dap.msrpUsd) : '',
    hasValue(dap.status) ? getStatusBadgeMeta(dap.status).label : '',
    hasValue(dap.verificationStatus) ? getVerificationBadgeMeta(dap.verificationStatus).label : '',
    hasValue(dap.os) ? (isAndroidBased(dap) ? 'Android' : 'Non-Android') : '',
    dap.has44mm ? '4.4mm' : '',
  ];
  return items.filter(Boolean);
});

const coreRows = computed<DetailRow[]>(() => {
  if (!props.dap) return [];
  const dap = props.dap;
  const rows: DetailRow[] = [
    { label: 'Brand', value: dap.brand },
    { label: 'Model', value: dap.model },
  ];
  addRow(rows, 'Variant', textValue(dap.variant));
  addRow(rows, 'Year', textValue(dap.releaseYear));
  addRow(rows, 'MSRP', hasValue(dap.msrpUsd) ? formatPrice(dap.msrpUsd) : '');
  return rows;
});

const outputSummary = computed(() => {
  if (!props.dap) return '';
  const dap = props.dap;
  const balancedType = dap.balancedOutputType.toLowerCase();
  const outputs: string[] = [];
  if (dap.has35mm) outputs.push('3.5mm');
  if (dap.has25mm) outputs.push(balancedType.includes('2.5') ? '2.5mm balanced' : '2.5mm');
  if (dap.has44mm) outputs.push(balancedType.includes('4.4') ? '4.4mm balanced' : '4.4mm');
  if (dap.has635mm) outputs.push('6.35mm');
  if (dap.lineOut) outputs.push('line out');
  if (dap.coaxOut) outputs.push('coax');
  if (dap.opticalOut) outputs.push('optical');
  return outputs.join(', ');
});

const audioRows = computed<DetailRow[]>(() => {
  if (!props.dap) return [];
  const dap = props.dap;
  const rows: DetailRow[] = [];
  addRow(rows, 'DAC', textValue(dap.dac));
  addRow(rows, 'Amp', textValue(dap.amp));
  addRow(rows, 'Outputs', outputSummary.value);
  addRow(rows, 'Balanced Output', textValue(dap.balancedOutputType));
  addRow(rows, 'SE Power', powerValue(dap.sePowerMw, dap.sePowerLoad));
  addRow(rows, 'Balanced Power', powerValue(dap.balPowerMw, dap.balPowerLoad));
  return rows;
});

const hardwareRows = computed<DetailRow[]>(() => {
  if (!props.dap) return [];
  const dap = props.dap;
  const rows: DetailRow[] = [];
  addRow(rows, 'SoC', textValue(dap.soc));
  addRow(rows, 'RAM', gbValue(dap.ramGb));
  addRow(rows, 'OS', textValue(dap.os));
  addRow(rows, 'Battery', hasValue(dap.batteryMah) ? formatBattery(dap.batteryMah) : '');
  addRow(rows, 'Battery Life', textValue(dap.batteryLifeHours));
  addRow(rows, 'Display', textValue(dap.displaySize));
  addRow(rows, 'Weight', textValue(dap.weight));
  addRow(rows, 'Dimensions', textValue(dap.dimensions));
  addRow(rows, 'Storage', gbValue(dap.storageGb));
  if (dap.microSd === true) {
    addRow(rows, 'Expansion', hasValue(dap.storageExpansionMax) ? `microSD up to ${dap.storageExpansionMax}` : 'microSD');
  }
  addRow(rows, 'Colors', listValue(dap.colors));
  return rows;
});

const connectivityRows = computed<DetailRow[]>(() => {
  if (!props.dap) return [];
  const dap = props.dap;
  const rows: DetailRow[] = [];
  if (dap.bluetooth === true) addRow(rows, 'Bluetooth', textValue(dap.bluetoothVersion) || 'Yes');
  addRow(rows, 'Codecs', listValue(dap.bluetoothCodecs));
  if (dap.wifi === true) addRow(rows, 'Wi-Fi', textValue(dap.wifiBands) || 'Yes');
  if (dap.cellular === true) addRow(rows, 'Cellular', 'Yes');
  if (dap.has4g === true) addRow(rows, '4G', 'Yes');
  if (dap.has5g === true) addRow(rows, '5G', 'Yes');

  const usbParts = [textValue(dap.usbPort)];
  if (dap.usbDac === true) usbParts.push('USB DAC');
  addRow(rows, 'USB', usbParts.filter(Boolean).join(', '));

  const formats = [];
  if (hasValue(dap.pcmMax)) formats.push(`PCM ${dap.pcmMax}`);
  if (hasValue(dap.dsdMax)) formats.push(String(dap.dsdMax));
  addRow(rows, 'Formats', formats.join(', '));

  if (dap.mqa === true) addRow(rows, 'MQA', 'Yes');
  addRow(rows, 'Streaming', listValue(dap.streamingServices));
  return rows;
});

const sourceTypeLabel = computed(() => {
  if (!props.dap) return '';
  const sourceType = getVerificationBadgeMeta(props.dap.verificationStatus).label;
  if (props.dap.sourceUrl) return `${sourceType} - Open source`;
  return sourceType || 'Source not listed';
});

const buyGroups = computed<BuyGroup[]>(() => {
  if (!props.dap) return [];
  const dap = props.dap;
  const groups: BuyGroup[] = [];

  if (dap.officialStoreUrl) {
    groups.push({
      label: 'Official',
      links: [{ label: 'Official Store', url: dap.officialStoreUrl }],
    });
  }

  if (dap.buyLinks.length) {
    groups.push({ label: 'Retailers', links: dap.buyLinks });
  }

  if (dap.affiliateLinks.length) {
    groups.push({
      label: 'Affiliate',
      links: dap.affiliateLinks.map((link) => ({ ...link, affiliate: true })),
    });
  }

  return groups;
});

const hasBuyInfo = computed(() => {
  if (!props.dap) return false;
  return Boolean(buyGroups.value.length || props.dap.buyNotes.trim());
});

const hasReviewInfo = computed(() => {
  if (!props.dap) return false;
  return Boolean(props.dap.reviewLinks.length || props.dap.reviewNotes.trim());
});

function compactDapName(dap: Dap | null | undefined): string {
  if (!dap) return '';
  return [dap.brand, dap.model, dap.variant].filter(Boolean).join(' ');
}

onMounted(() => {
  window.addEventListener('keydown', handleKeydown);
});

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleKeydown);
});
</script>

<template>
  <Teleport to="body">
    <div v-if="dap" class="modal-backdrop" role="presentation" @click.self="$emit('close')">
      <section class="details-modal" role="dialog" aria-modal="true" :aria-label="`${dap.brand} ${dap.model} details`">
        <header class="details-modal__header">
          <div>
            <p class="eyebrow">{{ dap.brand }}</p>
            <h2>{{ dap.model }}</h2>
            <p v-if="dap.variant" class="variant-text">{{ dap.variant }}</p>
          </div>
          <button class="btn btn-ghost btn-icon details-icon-button" type="button" aria-label="Close details" @click="$emit('close')">
            <X :size="18" aria-hidden="true" />
          </button>
        </header>

        <div class="details-modal__body">
          <div v-if="summaryItems.length" class="details-summary" aria-label="DAP summary">
            <span v-for="item in summaryItems" :key="item">{{ item }}</span>
          </div>

          <div class="details-top">
            <aside class="details-photo-panel">
              <DapPhoto :dap="dap" size="large" />
              <a
                v-if="dap.images[0]?.sourceUrl"
                class="source-link"
                :href="dap.images[0].sourceUrl"
                target="_blank"
                :rel="referenceLinkRel"
              >
                <ExternalLink :size="15" aria-hidden="true" />
                <span>Image source</span>
              </a>
              <p v-else-if="imageUrlForDap(dap)" class="muted-block">Image source not listed</p>
            </aside>

            <section class="details-section details-section--core">
              <h3>Core Info</h3>
              <dl class="spec-grid spec-grid--single">
                <div v-for="row in coreRows" :key="row.label" class="spec-row">
                  <dt class="spec-label">{{ row.label }}</dt>
                  <dd class="spec-value">{{ row.value }}</dd>
                </div>
              </dl>
              <div v-if="hasReviewInfo" class="inline-review-block">
                <p class="buy-group__label">Reviews</p>
                <ul v-if="dap.reviewLinks.length" class="buy-link-list">
                  <li v-for="link in dap.reviewLinks" :key="link.url">
                    <a class="source-link" :href="link.url" target="_blank" :rel="referenceLinkRel">
                      <ExternalLink :size="15" aria-hidden="true" />
                      <span>{{ link.label }}</span>
                    </a>
                  </li>
                </ul>
                <p v-if="dap.reviewNotes" class="buy-notes">{{ dap.reviewNotes }}</p>
              </div>
            </section>
          </div>

          <div class="details-sections">

            <section v-if="audioRows.length" class="details-section">
              <h3>Audio</h3>
              <dl class="spec-grid">
                <div v-for="row in audioRows" :key="row.label" class="spec-row">
                  <dt class="spec-label">{{ row.label }}</dt>
                  <dd class="spec-value">{{ row.value }}</dd>
                </div>
              </dl>
            </section>

            <section v-if="hardwareRows.length" class="details-section">
              <h3>Hardware</h3>
              <dl class="spec-grid">
                <div v-for="row in hardwareRows" :key="row.label" class="spec-row">
                  <dt class="spec-label">{{ row.label }}</dt>
                  <dd class="spec-value">{{ row.value }}</dd>
                </div>
              </dl>
            </section>

            <section v-if="connectivityRows.length" class="details-section">
              <h3>Connectivity</h3>
              <dl class="spec-grid">
                <div v-for="row in connectivityRows" :key="row.label" class="spec-row">
                  <dt class="spec-label">{{ row.label }}</dt>
                  <dd class="spec-value">{{ row.value }}</dd>
                </div>
              </dl>
            </section>

            <section class="details-section">
              <h3>Source</h3>
              <dl class="spec-grid spec-grid--single">
                <div class="spec-row">
                  <dt class="spec-label">Source</dt>
                  <dd class="spec-value">
                    <a v-if="dap.sourceUrl" class="source-link" :href="dap.sourceUrl" target="_blank" :rel="referenceLinkRel">
                      <ExternalLink :size="15" aria-hidden="true" />
                      <span>{{ sourceTypeLabel }}</span>
                    </a>
                    <span v-else>{{ sourceTypeLabel }}</span>
                  </dd>
                </div>
              </dl>
            </section>

            <section v-if="hasBuyInfo" class="details-section buy-section">
              <h3>Buy / Availability</h3>
              <div class="buy-groups">
                <div v-for="group in buyGroups" :key="group.label" class="buy-group">
                  <p class="buy-group__label">{{ group.label }}</p>
                  <ul class="buy-link-list">
                    <li v-for="link in group.links" :key="`${group.label}-${link.url}`">
                      <a class="source-link" :href="link.url" target="_blank" :rel="link.affiliate ? affiliateLinkRel : referenceLinkRel">
                        <ExternalLink :size="15" aria-hidden="true" />
                        <span>{{ link.label }}</span>
                      </a>
                      <span v-if="link.affiliate" class="affiliate-badge">Affiliate</span>
                    </li>
                  </ul>
                </div>
                <p v-if="dap.buyNotes" class="buy-notes">
                  <strong>Notes:</strong> {{ dap.buyNotes }}
                </p>
              </div>
            </section>

            <details class="details-section notes-panel">
              <summary>Notes and source details</summary>
              <p class="notes-text">{{ formatValue(dap.notes) }}</p>
            </details>
          </div>
        </div>
        <nav
          v-if="previousDap || nextDap"
          class="details-modal__nav"
          :class="{
            'details-modal__nav--single': !previousDap || !nextDap,
            'details-modal__nav--next-only': !previousDap && nextDap,
          }"
          aria-label="Browse DAP details"
        >
          <button
            v-if="previousDap"
            class="btn btn-secondary modal-nav-button"
            type="button"
            :aria-label="`Previous DAP: ${compactDapName(previousDap)}`"
            @click="$emit('navigate', previousDap)"
          >
            <ChevronLeft :size="17" aria-hidden="true" />
            <span>
              <small>Previous</small>
              <strong>{{ compactDapName(previousDap) }}</strong>
            </span>
          </button>
          <button
            v-if="nextDap"
            class="btn btn-secondary modal-nav-button modal-nav-button--next"
            type="button"
            :aria-label="`Next DAP: ${compactDapName(nextDap)}`"
            @click="$emit('navigate', nextDap)"
          >
            <span>
              <small>Next</small>
              <strong>{{ compactDapName(nextDap) }}</strong>
            </span>
            <ChevronRight :size="17" aria-hidden="true" />
          </button>
        </nav>
      </section>
    </div>
  </Teleport>
</template>
