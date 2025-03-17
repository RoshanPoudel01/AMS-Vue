<script setup lang="ts">
import CustomDatatable from "@/components/Datatable/DataTable.vue";
import { Button } from "@/components/ui/button";
import Dialog from "@/components/ui/dialog/Dialog.vue";
import DialogContent from "@/components/ui/dialog/DialogContent.vue";
import DialogHeader from "@/components/ui/dialog/DialogHeader.vue";
import DialogTrigger from "@/components/ui/dialog/DialogTrigger.vue";
import AppLayout from "@/layouts/AppLayout.vue";
import { ref } from "vue";
const defaultData = [
  {
    firstName: "tanner",
    lastName: "linsley",
    age: 24,
    visits: 100,
    status: "In Relationship",
    progress: 50,
  },
  {
    firstName: "tandy",
    lastName: "miller",
    age: 40,
    visits: 40,
    status: "Single",
    progress: 80,
  },
  {
    firstName: "joe",
    lastName: "dirte",
    age: 45,
    visits: 20,
    status: "Complicated",
    progress: 10,
  },
];

const columns = [
  {
    accessorKey: "firstName",
    header: "First Name",
  },
  {
    accessorKey: "lastName",
    header: "Last Name",
  },
  {
    accessorKey: "age",
    header: "Age",
  },
  {
    accessorKey: "visits",
    header: "Visits",
  },
  {
    accessorKey: "status",
    header: "Status",
  },
  {
    accessorKey: "progress",
    header: "Progress",
  },
];
const data = ref(defaultData);
</script>

<template>
  <AppLayout title="Users">
    <div class="flex justify-end p-4">
      <Dialog>
        <DialogTrigger as-child>
          <Button>Add User</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>Add User</DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
    <div>
      <CustomDatatable :data="data" :columns="columns" />
    </div>
  </AppLayout>
</template>
