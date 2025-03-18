<script setup lang="ts">
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  FlexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useVueTable,
  type ColumnDef,
} from "@tanstack/vue-table";
import { computed, defineEmits, defineProps } from "vue";

const props = defineProps({
  data: {
    type: Array,
    required: true,
  },
  columns: {
    type: Array as () => ColumnDef<unknown, any>[],
    required: true,
  },
  page: {
    type: Number,
    default: 1,
  },
  pageSize: {
    type: Number,
    default: 10,
  },
  totalItems: {
    type: Number,
    default: 0,
  },
});

// Emit events when page or pageSize changes
const emit = defineEmits(["update:page", "update:pageSize"]);

const table = useVueTable({
  get data() {
    return props.data;
  },
  columns: props.columns,
  getCoreRowModel: getCoreRowModel(),
  getPaginationRowModel: getPaginationRowModel(),
  pageCount: computed(() => Math.ceil(props.totalItems / props.pageSize)).value,
});
// Pagination handlers
function goToPage(page: number) {
  emit("update:page", Math.max(1, Math.min(page, table.getPageCount())));
}

function handlePageSizeChange(event: Event) {
  const newSize = Number((event.target as HTMLSelectElement).value);
  emit("update:pageSize", newSize);
}
</script>

<template>
  <Table class="min-w-full">
    <TableHeader>
      <TableRow
        v-for="headerGroup in table.getHeaderGroups()"
        :key="headerGroup.id"
      >
        <TableHead
          v-for="header in headerGroup.headers"
          :key="header.id"
          :colSpan="header.colSpan"
        >
          <FlexRender
            v-if="!header.isPlaceholder"
            :render="header.column.columnDef.header"
            :props="header.getContext()"
          />
        </TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      <TableRow
        v-for="row in table.getRowModel().rows"
        :key="row.id"
        class="hover:bg-gray-100"
      >
        <TableCell v-for="cell in row.getVisibleCells()" :key="cell.id">
          <FlexRender
            :render="cell.column.columnDef.cell"
            :props="cell.getContext()"
          />
        </TableCell>
      </TableRow>
    </TableBody>
  </Table>

  <!-- Pagination Controls -->
  <div class="flex justify-center mt-4">
    <div>
      <div class="flex items-center gap-2">
        <button
          class="border rounded p-1"
          @click="goToPage(1)"
          :disabled="page === 1"
        >
          «
        </button>
        <button
          class="border rounded p-1"
          @click="goToPage(page - 1)"
          :disabled="page === 1"
        >
          ‹
        </button>
        <button
          class="border rounded p-1"
          @click="goToPage(page + 1)"
          :disabled="page >= table.getPageCount()"
        >
          ›
        </button>
        <button
          class="border rounded p-1"
          @click="goToPage(table.getPageCount())"
          :disabled="page >= table.getPageCount()"
        >
          »
        </button>

        <span class="flex items-center gap-1">
          <div>Page</div>
          <strong>{{ page }} of {{ table.getPageCount() }}</strong>
        </span>

        <select :value="pageSize" @change="handlePageSizeChange">
          <option
            v-for="size in [10, 20, 30, 40, 50]"
            :key="size"
            :value="size"
          >
            Show {{ size }}
          </option>
        </select>
      </div>
      <div>{{ data.length }} Rows</div>
    </div>
  </div>
</template>
