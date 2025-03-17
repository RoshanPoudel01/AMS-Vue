<script setup lang="ts">
import Avatar from "@/components/ui/avatar/Avatar.vue";
import AvatarFallback from "@/components/ui/avatar/AvatarFallback.vue";
import AvatarImage from "@/components/ui/avatar/AvatarImage.vue";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLogout } from "@/services/service-auth";
import SidebarComponent from "../components/Sidebar/Sidebar.vue";

const { mutateAsync: logout } = useLogout();
</script>

<template>
  <div class="flex">
    <div class="flex-col flex-1">
      <SidebarComponent>
        <div class="flex align-start justify-between">
          <div class="flex-1 p-4">
            <p class="text-2xl font-bold text-gray-800">{{ title }}</p>
          </div>
          <div class="flex items-end p-4">
            <DropdownMenu>
              <DropdownMenuTrigger as-child>
                <Avatar class="cursor-pointer">
                  <AvatarImage
                    src="https://images.pexels.com/photos/30894155/pexels-photo-30894155/free-photo-of-contemplative-young-man-in-urban-setting.png?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                    alt="@unovue"
                  />
                  <AvatarFallback>RP</AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent class="w-42 mr-4">
                <DropdownMenuItem class="cursor-pointer">
                  <span>Change Password</span>
                </DropdownMenuItem>
                <DropdownMenuItem class="cursor-pointer" @click="logout">
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <slot />
      </SidebarComponent>
    </div>
  </div>
</template>

<script lang="ts">
export default {
  name: "AppLayout",
  props: {
    title: String,
  },
};
</script>
