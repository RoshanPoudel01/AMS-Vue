<script setup lang="ts">
import { RouterView } from "vue-router";
import Toaster from "./components/ui/toast/Toaster.vue";
</script>

<template>
  <router-view :key="$route.fullPath" />
  <Toaster />
</template>
