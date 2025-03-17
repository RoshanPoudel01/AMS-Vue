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
  useVueTable,
  type ColumnDef,
} from "@tanstack/vue-table";
import { ref, watchEffect } from "vue";
const props = defineProps({
  data: {
    type: Array,
    required: true,
  },
  columns: {
    type: Array as () => ColumnDef<unknown, any>[],
    required: true,
  },
});

// Create a reactive reference for the table data
const tableData = ref(props.data);

// Watch for changes in the data prop
watchEffect(() => {
  tableData.value = props.data;
});

// Initialize the table
const table = useVueTable({
  get data() {
    return tableData.value;
  },
  columns: props?.columns,
  getCoreRowModel: getCoreRowModel(),
});

// Expose the table to the parent component
defineExpose({
  table,
});
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
</template>

<style scoped>
.custom-datatable table {
  border: 1px solid lightgray;
  width: 100%;
}

.custom-datatable tbody {
  border-bottom: 1px solid lightgray;
}

.custom-datatable th {
  border-bottom: 1px solid lightgray;
  border-right: 1px solid lightgray;
  padding: 2px 4px;
  background-color: #f1f1f1;
}

.custom-datatable td {
  padding: 6px 8px;
  border-right: 1px solid lightgray;
}

.custom-datatable tfoot {
  color: gray;
}

.custom-datatable tfoot th {
  font-weight: normal;
}
</style>
