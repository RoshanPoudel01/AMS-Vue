<template>
  <AppLayout title="Artists">
    <div class="flex justify-end p-4">
      <Dialog>
        <DialogTrigger as-child>
          <Button>Add Artist</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>Add Artist</DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
    <div>
      <CustomDatatable
        :data="artistsData"
        :columns="columns"
        :totalItems="16"
        :page="pageParams.page"
        :pageSize="pageParams.pageSize"
        @update:page="handlePageChange"
        @update:pageSize="handlePageSizeChange"
      />
    </div>
  </AppLayout>
</template>

<script setup>
import CustomDatatable from "@/components/Datatable/DataTable.vue";
import { Button } from "@/components/ui/button";
import Dialog from "@/components/ui/dialog/Dialog.vue";
import DialogContent from "@/components/ui/dialog/DialogContent.vue";
import DialogHeader from "@/components/ui/dialog/DialogHeader.vue";
import DialogTrigger from "@/components/ui/dialog/DialogTrigger.vue";
import AppLayout from "@/layouts/AppLayout.vue";
import { GetAllArtists } from "@/services/service-artist";
import { reactive, ref, toRefs, watch } from "vue";

// Pagination parameters
let pageParams = reactive({
  page: 1,
  pageSize: 10,
});

// Initialize refs for derived data
const artistsData = ref([]);
const totalItems = ref(0);
const { page, pageSize } = toRefs(pageParams);

const { data, refetch } = GetAllArtists({
  page: page.value,
  size: pageSize.value,
});

// Update local refs whenever data changes
watch(
  data,
  (newData) => {
    if (newData) {
      // Extract the artists array from the response
      artistsData.value = newData.artists || [];
      // Extract pagination metadata
      totalItems.value = newData.meta?.total_entries || 0;
      console.log("Total items:", totalItems.value);
    }
  },
  { immediate: true }
);

// Define table columns
const columns = [
  { accessorKey: "name", header: "Name" },
  { accessorKey: "dob", header: "DOB" },
  { accessorKey: "gender", header: "Gender" },
  { accessorKey: "address", header: "Address" },
  { accessorKey: "first_release_year", header: "First Release Year" },
  { accessorKey: "no_of_albums_released", header: "Total Albums" },
  { accessorKey: "music_count", header: "Total Songs" },
];

// Handle page change
function handlePageChange(newPage) {
  pageParams.page = newPage;
}

// Handle page size change
function handlePageSizeChange(newSize) {
  pageParams.pageSize = newSize;
  pageParams.page = 1; // Reset to first page on size change
}
</script>
