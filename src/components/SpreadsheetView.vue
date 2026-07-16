<script setup lang="ts">
import { computed, ref } from 'vue';
import { ArrowDown, ArrowUp, RotateCcw, Search } from 'lucide-vue-next';
import type { Dap } from '../types/dap';

const props = defineProps<{
  csv: string;
  daps: Dap[];
}>();

const emit = defineEmits<{
  openDap: [dap: Dap];
}>();

type Density = 'compact' | 'comfortable';
type SheetSort = { columnIndex: number | null; direction: 'asc' | 'desc' };

const searchTerm = ref('');
const density = ref<Density>('compact');
const sortState = ref<SheetSort>({ columnIndex: null, direction: 'asc' });
const columnWidths = ref<Record<number, number>>({});
const resizingColumn = ref<{ index: number; startX: number; startWidth: number } | null>(null);

function parseCsv(csv: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = '';
  let inQuotes = false;

  for (let index = 0; index < csv.length; index += 1) {
    const char = csv[index];
    const nextChar = csv[index + 1];

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        cell += '"';
        index += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }

    if (char === ',' && !inQuotes) {
      row.push(cell);
      cell = '';
      continue;
    }

    if ((char === '\n' || char === '\r') && !inQuotes) {
      if (char === '\r' && nextChar === '\n') index += 1;
      row.push(cell);
      rows.push(row);
      row = [];
      cell = '';
      continue;
    }

    cell += char;
  }

  if (cell.length || row.length) {
    row.push(cell);
    rows.push(row);
  }

  return rows;
}

const csvRows = computed(() => parseCsv(props.csv.trimEnd()));
const headers = computed(() => csvRows.value[0] ?? []);
const dataRows = computed(() => csvRows.value.slice(1).map((cells, index) => ({ cells, csvIndex: index })));
const normalizedSearch = computed(() => searchTerm.value.trim().toLowerCase());
const isSorted = computed(() => sortState.value.columnIndex !== null);

const filteredRows = computed(() => {
  if (!normalizedSearch.value) return dataRows.value;
  return dataRows.value.filter((row) => row.cells.some((cell) => cell.toLowerCase().includes(normalizedSearch.value)));
});

const displayedRows = computed(() => {
  const columnIndex = sortState.value.columnIndex;
  const rows = [...filteredRows.value];
  if (columnIndex === null) return rows;

  return rows.sort((a, b) => {
    const valueA = a.cells[columnIndex] ?? '';
    const valueB = b.cells[columnIndex] ?? '';
    const numericA = Number(valueA.replace(/[$,]/g, ''));
    const numericB = Number(valueB.replace(/[$,]/g, ''));
    const bothNumeric = valueA.trim() !== '' && valueB.trim() !== '' && !Number.isNaN(numericA) && !Number.isNaN(numericB);
    const result = bothNumeric
      ? numericA - numericB
      : valueA.localeCompare(valueB, undefined, { numeric: true, sensitivity: 'base' });
    return sortState.value.direction === 'asc' ? result : -result;
  });
});

const stickyLeftOffsets = computed(() => {
  const brandWidth = columnWidths.value[0] ?? 150;
  const modelWidth = columnWidths.value[1] ?? 170;
  return [0, brandWidth, brandWidth + modelWidth];
});

function sortColumn(columnIndex: number) {
  if (sortState.value.columnIndex !== columnIndex) {
    sortState.value = { columnIndex, direction: 'asc' };
    return;
  }

  sortState.value = {
    columnIndex,
    direction: sortState.value.direction === 'asc' ? 'desc' : 'asc',
  };
}

function restoreCsvOrder() {
  sortState.value = { columnIndex: null, direction: 'asc' };
}

function openRow(csvIndex: number) {
  const dap = props.daps[csvIndex];
  if (dap) emit('openDap', dap);
}

function handleCellClick(event: MouseEvent, columnIndex: number, csvIndex: number) {
  if (columnIndex < 3) {
    event.stopPropagation();
    return;
  }

  openRow(csvIndex);
}

function displayCell(value: string | undefined): string {
  return value ?? '';
}

function columnStyle(columnIndex: number) {
  const width = columnWidths.value[columnIndex];
  const defaultStickyWidths = [150, 170, 150];
  const resolvedWidth = width ?? (columnIndex < 3 ? defaultStickyWidths[columnIndex] : null);
  const style: Record<string, string> = {};

  if (resolvedWidth) {
    style.width = `${resolvedWidth}px`;
    style.minWidth = `${resolvedWidth}px`;
  }

  if (columnIndex < 3) {
    style.left = `${stickyLeftOffsets.value[columnIndex]}px`;
  }

  return style;
}

function startResize(event: PointerEvent, columnIndex: number) {
  const header = (event.currentTarget as HTMLElement).closest('th');
  if (!header) return;
  event.preventDefault();
  resizingColumn.value = {
    index: columnIndex,
    startX: event.clientX,
    startWidth: header.getBoundingClientRect().width,
  };
  window.addEventListener('pointermove', handleResize);
  window.addEventListener('pointerup', stopResize, { once: true });
}

function handleResize(event: PointerEvent) {
  const activeResize = resizingColumn.value;
  if (!activeResize) return;
  const nextWidth = Math.max(90, activeResize.startWidth + event.clientX - activeResize.startX);
  columnWidths.value = { ...columnWidths.value, [activeResize.index]: Math.round(nextWidth) };
}

function stopResize() {
  resizingColumn.value = null;
  window.removeEventListener('pointermove', handleResize);
}
</script>

<template>
  <main class="sheet-page">
    <header class="sheet-header">
      <div>
        <a class="sheet-back-link" href="#/">Back to database</a>
        <h1>Spreadsheet view</h1>
        <p>{{ displayedRows.length }} of {{ dataRows.length }} CSV rows. Read-only audit view.</p>
      </div>

      <div class="sheet-actions">
        <label class="sheet-search">
          <Search :size="16" aria-hidden="true" />
          <span class="sr-only">Search spreadsheet</span>
          <input v-model="searchTerm" type="search" placeholder="Search all CSV cells" />
        </label>
        <div class="segmented-control" aria-label="Row density">
          <button class="segmented-button sheet-density-button" :class="{ 'is-active': density === 'compact' }" type="button" @click="density = 'compact'">
            Compact
          </button>
          <button class="segmented-button sheet-density-button" :class="{ 'is-active': density === 'comfortable' }" type="button" @click="density = 'comfortable'">
            Comfortable
          </button>
        </div>
        <button class="btn btn-secondary" type="button" :disabled="!isSorted" @click="restoreCsvOrder">
          <RotateCcw :size="16" aria-hidden="true" />
          Restore CSV order
        </button>
      </div>
    </header>

    <section class="sheet-frame" aria-label="Raw CSV spreadsheet">
      <table class="sheet-table" :class="`sheet-table--${density}`">
        <thead>
          <tr>
            <th
              v-for="(header, columnIndex) in headers"
              :key="header"
              :class="[
                columnIndex < 3 ? `sheet-sticky sheet-sticky--${columnIndex}` : '',
                columnIndex === 2 ? 'sheet-sticky--last' : '',
              ]"
              :style="columnStyle(columnIndex)"
              scope="col"
            >
              <button class="sheet-sort-button" type="button" @click="sortColumn(columnIndex)">
                <span>{{ header }}</span>
                <ArrowUp v-if="sortState.columnIndex === columnIndex && sortState.direction === 'asc'" :size="13" aria-hidden="true" />
                <ArrowDown v-else-if="sortState.columnIndex === columnIndex" :size="13" aria-hidden="true" />
              </button>
              <span class="sheet-resize-handle" aria-hidden="true" @pointerdown="startResize($event, columnIndex)"></span>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="row in displayedRows"
            :key="row.csvIndex"
            tabindex="0"
            @keydown.enter.prevent="openRow(row.csvIndex)"
            @keydown.space.prevent="openRow(row.csvIndex)"
          >
            <td
              v-for="(header, columnIndex) in headers"
              :key="`${row.csvIndex}-${header}`"
              :class="[
                columnIndex < 3 ? `sheet-sticky sheet-sticky--${columnIndex}` : '',
                columnIndex === 2 ? 'sheet-sticky--last' : '',
                columnIndex < 3 ? 'sheet-copy-cell' : '',
                !displayCell(row.cells[columnIndex]) ? 'is-empty' : '',
              ]"
              :style="columnStyle(columnIndex)"
              @click="handleCellClick($event, columnIndex, row.csvIndex)"
            >
              <span>{{ displayCell(row.cells[columnIndex]) || 'empty' }}</span>
            </td>
          </tr>
        </tbody>
      </table>
    </section>
  </main>
</template>
