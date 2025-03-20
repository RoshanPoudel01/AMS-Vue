<template>
  <div
    class="flex justify-center items-center h-screen bg-gradient-to-r from-gray-300 via-gray-500 to-gray-700"
  >
    <Card class="p-5 w-[440px]">
      <CardHeader class="text-center px-0">
        <CardTitle class="text-xl"> Login to your account </CardTitle>
      </CardHeader>
      <form @submit="onSubmit" class="space-y-3">
        <FormField
          v-for="field in fields"
          :key="field.name"
          v-slot="{ componentField }"
          :name="field.name"
          :validate-on-blur="!isFieldDirty"
        >
          <FormItem>
            <FormLabel>{{ field.label }}</FormLabel>
            <FormControl>
              <Input
                :type="field.type"
                :placeholder="field.placeholder"
                v-bind="componentField"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>
        <div class="flex items-center justify-between">
          <Button :disabled="isPending" type="submit">
            <Loader2 v-if="isPending" class="w-4 h-4 mr-2 animate-spin" />
            Submit
          </Button>
          <RouterLink to="/register">
            <p class="text-blue-500 hover:underline">Register</p>
          </RouterLink>
        </div>
      </form>
    </Card>
  </div>
</template>

<script setup>
import { Button } from "@/components/ui/button";
import Card from "@/components/ui/card/Card.vue";
import CardHeader from "@/components/ui/card/CardHeader.vue";
import CardTitle from "@/components/ui/card/CardTitle.vue";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useLogin } from "@/services/service-auth";
import { ref } from "vue";

import { toTypedSchema } from "@vee-validate/zod";
import { Loader2, LucideEyeClosed } from "lucide-vue-next";
import { useForm } from "vee-validate";
import * as z from "zod";

const formSchema = toTypedSchema(
  z.object({
    username: z
      .string({
        required_error: "Username is required",
        invalid_type_error: "Username must be a string",
      })
      .min(1, "Username is required")
      .max(50, "Username must be at most 50 characters"),
    password: z
      .string({
        required_error: "Password is required",
      })
      .min(8, "Password must be at least 8 characters")
      .max(16, "Password must be at most 16 characters"),
  })
);

const isFieldDirty = ref(false);

const { handleSubmit, handleReset } = useForm({
  validationSchema: formSchema,
});

const { mutateAsync: login, isPending } = useLogin();

const onSubmit = handleSubmit(async (values) => {
  try {
    await login(values);
    handleReset();
  } catch (error) {
    console.error(error);
  }
});

const fields = [
  {
    name: "username",
    label: "Username",
    placeholder: "Username",
    type: "text",
  },
  {
    name: "password",
    label: "Password",
    placeholder: "Password",
    type: "password",
    icon: LucideEyeClosed,
  },
];
</script>
