<template>
  <AppLayout title="Songs">
    <div class="flex justify-end px-4">
      <Button @click="addSong">Add Song</Button>
    </div>
    <div>
      <CustomDatatable
        :data="musicData"
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
import { DeleteMusic, GetMusicByArtist } from "@/services/service-music";
import { Edit, Trash } from "lucide-vue-next";
import { h, reactive, ref, watch } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
// Pagination parameters
const page = ref(1);
const pageSize = ref(10);

const musicData = ref([]);
const totalItems = ref(0);

// Create reactive params object for the query
const queryParams = reactive({
  page: page.value,
  size: pageSize.value,
});

const { data, isLoading } = GetMusicByArtist(route.params.id);
const { mutateAsync } = DeleteMusic();
const columns = [
  {
    accessorKey: "s.n",
    header: "S.N",
    cell: (row) => {
      return (page.value - 1) * pageSize.value + row.row.index + 1;
    },
  },
  {
    accessorKey: "title",
    header: "Title",
  },
  {
    accessorKey: "album_name",
    header: "Album",
  },
  {
    accessorKey: "genre",
    header: "Genre",
  },
  {
    accessorKey: "action",
    header: "Action",
    cell: ({ row }) =>
      h("div", { class: "flex space-x-3" }, [
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
watch(
  data,
  (newData) => {
    if (newData) {
      musicData.value = newData.musics;
    }
  },
  {
    immediate: true,
  }
);

// Handle page change
function handlePageChange(newPage) {
  page.value = newPage;
}

// Handle page size change
function handlePageSizeChange(newSize) {
  pageSize.value = newSize;
  page.value = 1; // Reset to first page on size change
}

const addSong = () => {
  router.push(`/artists/${route.params.id}/songs/add`);
};

const editRow = (row) => {
  router.push(`/artists/${route.params.id}/songs/${row}`);
  // console.log("Edit row", row);
};

const deleteRow = async (row) => {
  await mutateAsync(row);
};
</script>
