<template>
  <AppLayout title="Artists">
    <div class="flex justify-end space-x-5 px-4">
      <Button variant="secondary">
        <ImportIcon class="w-5 h-5" />
        Import</Button
      >
      <Button variant="secondary" @click="handleExport">
        <ImportIcon class="w-5 h-5 rotate-180" />
        Export</Button
      >
      <Button @click="addArtist">Add Artist</Button>
    </div>
    <div>
      <CustomDatatable
        :data="artistsData"
        :columns="columns"
        :totalItems="totalItems"
        :page="page"
        :pageSize="pageSize"
        :isLoading="isLoading"
        @update:page="handlePageChange"
        @update:pageSize="handlePageSizeChange"
      />
    </div>
  </AppLayout>
</template>

<script setup>
import CustomDatatable from "@/components/Datatable/DataTable.vue";
import { Button } from "@/components/ui/button";
import AppLayout from "@/layouts/AppLayout.vue";
import router from "@/router";
import {
  DeleteArtist,
  ExportArtists,
  GetAllArtists,
} from "@/services/service-artist";
import { Edit, ImportIcon, Music, Trash } from "lucide-vue-next";
import { h, reactive, ref, watch } from "vue";

// Pagination parameters
const page = ref(1);
const pageSize = ref(10);

// Initialize refs for derived data
const artistsData = ref([]);
const totalItems = ref(0);

// Create reactive params object for the query
const queryParams = reactive({
  page: page.value,
  size: pageSize.value,
});

// Get data using the reactive params
const { data, isLoading } = GetAllArtists(queryParams);
const { refetch } = ExportArtists(false);
const { mutateAsync } = DeleteArtist();
// Watch for page/pageSize changes and update query params
watch([page, pageSize], ([newPage, newSize]) => {
  queryParams.page = newPage;
  queryParams.size = newSize;
});

// Update local refs whenever data changes
watch(
  data,
  (newData) => {
    if (newData) {
      // Extract the artists array from the response
      artistsData.value = newData.artists || [];
      // Extract pagination metadata
      totalItems.value = newData.meta?.total_entries;
    }
  },
  { immediate: true }
);

// Define table columns
const columns = [
  {
    accessorKey: "s.n",
    header: "S.N",
    cell: (row) => {
      return (page.value - 1) * pageSize.value + row.row.index + 1;
    },
  },
  { accessorKey: "name", header: "Name" },
  { accessorKey: "dob", header: "DOB" },
  { accessorKey: "gender", header: "Gender" },
  { accessorKey: "address", header: "Address" },
  { accessorKey: "first_release_year", header: "First Release Year" },
  { accessorKey: "no_of_albums_released", header: "Total Albums" },
  { accessorKey: "music_count", header: "Total Songs" },
  {
    accessorKey: "action",
    header: "Action",
    cell: ({ row }) =>
      h("div", { class: "flex space-x-3" }, [
        h(Music, {
          class: "w-5 h-5 cursor-pointer text-blue-500 hover:text-blue-700",
          onClick: () => getSongs(row?.original?.id),
        }),
        h(Edit, {
          class: "w-5 h-5 cursor-pointer text-blue-500 hover:text-blue-700",
          onClick: () => editRow(row?.original?.id),
        }),
        h(Trash, {
          class: "w-5 h-5 cursor-pointer text-red-500 hover:text-red-700",
          onClick: () => deleteRow(row?.original?.id),
        }),
      ]),
  },
];

// Handle page change
function handlePageChange(newPage) {
  page.value = newPage;
}

// Handle page size change
function handlePageSizeChange(newSize) {
  pageSize.value = newSize;
  page.value = 1; // Reset to first page on size change
}

function handleExport() {
  refetch();
}

const getSongs = (id) => {
  router.push(`/artists/${id}/songs`);
};
const addArtist = () => {
  router.push("/artists/add");
};
const editRow = (row) => {
  router.push(`/artists/${row}`);
};

const deleteRow = async (row) => {
  try {
    await mutateAsync(row);
  } catch (error) {
    console.error(error);
  }
};
</script>
