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
import { LoaderCircle } from "lucide-vue-next";
import { defineEmits, defineProps } from "vue";
import Button from "../ui/button/Button.vue";
import {
  Pagination,
  PaginationList,
  PaginationListItem,
} from "../ui/pagination";
import PaginationEllipsis from "../ui/pagination/PaginationEllipsis.vue";
import PaginationFirst from "../ui/pagination/PaginationFirst.vue";
import PaginationLast from "../ui/pagination/PaginationLast.vue";
import PaginationNext from "../ui/pagination/PaginationNext.vue";
import PaginationPrev from "../ui/pagination/PaginationPrev.vue";

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
  isLoading: {
    type: Boolean,
    default: false,
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
  get pageCount() {
    return Math.ceil(props.totalItems / props.pageSize);
  },
});

// Pagination handlers
function goToPage(page: number) {
  emit("update:page", Math.max(1, Math.min(page, table.getPageCount())));
}

// function handlePageSizeChange(event: Event) {
//   const newSize = Number((event.target as HTMLSelectElement).value);
//   emit("update:pageSize", newSize);
// }
</script>

<template>
  <div class="mt-2">
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
          class="even:bg-gray-300 hover:bg-gray-400"
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
    <div
      v-if="!props.isLoading && props.data.length === 0"
      class="flex justify-center items-center h-32"
    >
      <p class="text-gray-500">No data to display</p>
    </div>

    <div v-if="props.isLoading" class="flex justify-center items-center">
      <LoaderCircle v-if="props.isLoading" class="h-32 animate-spin" />
    </div>
    <div class="flex items-center mt-3 space-x-2 lg:space-x-8">
      <Pagination
        v-slot="{ page: currentPage }"
        :items-per-page="pageSize"
        :total="totalItems"
        :default-page="page"
        @update:page="goToPage"
      >
        <PaginationList v-slot="{ items }" class="flex items-center gap-1">
          <PaginationFirst />
          <PaginationPrev />
          <template v-for="(item, index) in items">
            <PaginationListItem
              v-if="item.type === 'page'"
              :key="index"
              :value="item.value"
              as-child
            >
              <Button
                class="w-9 h-9 p-0"
                :variant="item.value === currentPage ? 'default' : 'outline'"
              >
                {{ item.value }}
              </Button>
            </PaginationListItem>
            <PaginationEllipsis v-else :key="item.type" :index="index" />
          </template>
          <PaginationNext />
          <PaginationLast />
        </PaginationList>
      </Pagination>
    </div>
  </div>
</template>
