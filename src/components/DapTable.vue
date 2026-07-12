<script setup lang="ts">
import { ArrowDown, ArrowUp, ChevronsUpDown } from 'lucide-vue-next';
import type { Dap, SortKey, SortState } from '../types/dap';
import { formatBattery, formatPrice, formatValue } from '../utils/formatters';
import { getStatusBadgeMeta, getVerificationBadgeMeta } from '../utils/dapDisplay';
import { dapDetailHash } from '../utils/slugs';
import DapPhoto from './DapPhoto.vue';
import SpecChip from './SpecChip.vue';

defineProps<{
  daps: Dap[];
  sortState: SortState;
}>();

const emit = defineEmits<{
  sort: [key: SortKey];
}>();

const sortableColumns: Array<{ key: SortKey; label: string; align?: 'brand' | 'right' }> = [
  { key: 'brand', label: 'Brand', align: 'brand' },
  { key: 'model', label: 'Model' },
  { key: 'releaseYear', label: 'Year', align: 'right' },
  { key: 'msrpUsd', label: 'MSRP', align: 'right' },
  { key: 'batteryMah', label: 'Battery', align: 'right' },
];

function sortLabel(key: SortKey, sortState: SortState): string {
  if (sortState.key !== key) return 'Sort';
  return sortState.direction === 'asc' ? 'Sorted ascending' : 'Sorted descending';
}

function shouldShowTableStatus(status: string): boolean {
  return status.trim().toLowerCase() !== 'active';
}

function tableStatusLabel(status: string): string {
  return status.trim().toLowerCase() === 'discontinued' ? 'Discont.' : getStatusBadgeMeta(status).label;
}

function formatMemorySpec(value: Dap['ramGb'] | Dap['storageGb']): string {
  if (value === null || value === undefined || value === '') return '-';
  if (typeof value === 'number') return `${value}GB`;
  return String(value);
}

function formatMemoryPair(dap: Dap): string {
  const ram = formatMemorySpec(dap.ramGb);
  const storage = formatMemorySpec(dap.storageGb);
  if (ram === '-' && storage === '-') return '-';
  return `${ram} / ${storage}`;
}
</script>

<template>
  <div class="table-wrap">
    <table class="dap-table">
      <colgroup>
        <col class="col-photo" />
        <col class="col-brand" />
        <col class="col-model" />
        <col class="col-year" />
        <col class="col-msrp" />
        <col class="col-battery" />
        <col class="col-balanced" />
        <col class="col-os" />
        <col class="col-memory" />
        <col class="col-dac" />
        <col class="col-verification" />
      </colgroup>
      <thead>
        <tr>
          <th class="photo-col"><span class="compact-th">Image</span></th>
          <th
            v-for="column in sortableColumns"
            :key="column.key"
            :class="{ 'is-numeric': column.align === 'right', 'is-brand': column.align === 'brand' }"
          >
            <button
              type="button"
              class="sort-button"
              :class="{ 'is-active': sortState.key === column.key }"
              :aria-label="`${sortLabel(column.key, sortState)} by ${column.label}`"
              @click="emit('sort', column.key)"
            >
              <span>{{ column.label }}</span>
              <span class="sort-glyph">
                <ArrowUp v-if="sortState.key === column.key && sortState.direction === 'asc'" :size="14" aria-hidden="true" />
                <ArrowDown v-else-if="sortState.key === column.key" :size="14" aria-hidden="true" />
                <ChevronsUpDown v-else :size="14" aria-hidden="true" />
              </span>
            </button>
          </th>
          <th class="is-centered">4.4mm</th>
          <th>OS</th>
          <th class="is-centered">RAM / Storage</th>
          <th>DAC</th>
          <th>
            <button
              type="button"
              class="sort-button"
              :class="{ 'is-active': sortState.key === 'verificationStatus' }"
              :aria-label="`${sortLabel('verificationStatus', sortState)} by Verification`"
              @click="emit('sort', 'verificationStatus')"
            >
              <span>Source</span>
              <span class="sort-glyph">
                <ArrowUp v-if="sortState.key === 'verificationStatus' && sortState.direction === 'asc'" :size="14" aria-hidden="true" />
                <ArrowDown v-else-if="sortState.key === 'verificationStatus'" :size="14" aria-hidden="true" />
                <ChevronsUpDown v-else :size="14" aria-hidden="true" />
              </span>
            </button>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="dap in daps" :key="dap.id">
          <td class="photo-col">
            <a class="photo-button" :href="dapDetailHash(dap)">
              <DapPhoto :dap="dap" size="thumb" />
            </a>
          </td>
          <td class="is-brand">{{ dap.brand }}</td>
          <td>
            <span class="table-model-line">
              <a class="link-button" :href="dapDetailHash(dap)">{{ dap.model }}</a>
              <SpecChip
                v-if="shouldShowTableStatus(dap.status)"
                :label="tableStatusLabel(dap.status)"
                :badge-class="getStatusBadgeMeta(dap.status).className"
                :title="getStatusBadgeMeta(dap.status).title"
              />
            </span>
            <span v-if="dap.variant" class="muted-block">{{ dap.variant }}</span>
          </td>
          <td class="is-numeric">{{ formatValue(dap.releaseYear) }}</td>
          <td class="is-numeric">{{ formatPrice(dap.msrpUsd) }}</td>
          <td class="is-numeric">{{ formatBattery(dap.batteryMah) }}</td>
          <td class="is-centered">
            <span
              class="table-boolean"
              :class="dap.has44mm ? 'table-boolean--yes' : 'table-boolean--no'"
              :aria-label="dap.has44mm ? 'Has 4.4mm output' : 'No 4.4mm output'"
              :title="dap.has44mm ? 'Has 4.4mm output' : 'No 4.4mm output'"
            >
              {{ dap.has44mm ? '✓' : '✕' }}
            </span>
          </td>
          <td><span class="table-ellipsis table-os" :title="formatValue(dap.os)">{{ formatValue(dap.os) }}</span></td>
          <td class="is-centered">
            <span class="table-ellipsis table-memory" :title="formatMemoryPair(dap)">
              {{ formatMemoryPair(dap) }}
            </span>
          </td>
          <td><span class="table-ellipsis table-dac" :title="formatValue(dap.dac)">{{ formatValue(dap.dac) }}</span></td>
          <td>
            <SpecChip
              :label="getVerificationBadgeMeta(dap.verificationStatus).label"
              :badge-class="getVerificationBadgeMeta(dap.verificationStatus).className"
              :title="getVerificationBadgeMeta(dap.verificationStatus).title"
            />
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
