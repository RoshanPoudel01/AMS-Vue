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
      <CustomDatatable
        :data="users.users ?? []"
        :columns="columns"
        :totalItems="users?.meta?.total_entries"
        :page="users?.meta?.current_page"
      />
    </div>
  </AppLayout>
</template>

<script>
import CustomDatatable from "@/components/Datatable/DataTable.vue";
import { Button } from "@/components/ui/button";
import Dialog from "@/components/ui/dialog/Dialog.vue";
import DialogContent from "@/components/ui/dialog/DialogContent.vue";
import DialogHeader from "@/components/ui/dialog/DialogHeader.vue";
import DialogTrigger from "@/components/ui/dialog/DialogTrigger.vue";
import AppLayout from "@/layouts/AppLayout.vue";
import { GetAllUsers } from "@/services/service-users";
import { defineComponent, ref, watchEffect } from "vue";

export default defineComponent({
  name: "UserManagement",
  components: {
    CustomDatatable,
    Button,
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTrigger,
    AppLayout,
  },
  setup() {
    const { data } = GetAllUsers({
      page: 1,
      size: 10,
    });
    const users = ref([]);

    // Watch the data and update users ref when it changes
    watchEffect(() => {
      users.value = data.value || [];
    });
    const columns = ref([
      { accessorKey: "username", header: "User Name" },
      { accessorKey: "email", header: "Email" },
    ]);

    return {
      users,
      columns,
    };
  },
});
</script>
