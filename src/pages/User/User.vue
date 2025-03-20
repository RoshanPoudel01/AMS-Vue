<template>
  <AppLayout title="Users">
    <div class="flex justify-end px-4">
      <Button @click="addUser">Add User</Button>
    </div>
    <div>
      <CustomDatatable
        :data="userData"
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
import { GetAllUsers, UseDeleteUser } from "@/services/service-users";
import { Edit, Trash } from "lucide-vue-next";
import { h, reactive, ref, watch } from "vue";

// Pagination parameters
const page = ref(1);
const pageSize = ref(10);

// Initialize refs for derived data
const userData = ref([]);
const totalItems = ref(0);

// Create reactive params object for the query
const queryParams = reactive({
  page: page.value,
  size: pageSize.value,
});

// Get data using the reactive params
const { data, isLoading } = GetAllUsers(queryParams);

//delete user api
const { mutateAsync } = UseDeleteUser();
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
      userData.value = newData.users || [];
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
  { accessorKey: "username", header: "User Name" },
  { accessorKey: "email", header: "Email" },
  { accessorKey: "role", header: "Role" },
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

// Handle page change
function handlePageChange(newPage) {
  page.value = newPage;
}

// Handle page size change
function handlePageSizeChange(newSize) {
  pageSize.value = newSize;
  page.value = 1; // Reset to first page on size change
}
const addUser = () => {
  router.push("/users/add");
};
function editRow(id) {
  router.push(`/users/${id}`);
}
function deleteRow(id) {
  mutateAsync(id);
}
</script>
