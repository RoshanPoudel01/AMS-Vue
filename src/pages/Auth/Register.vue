<template>
  <div
    class="flex justify-center items-center h-screen bg-gradient-to-r from-gray-300 via-gray-500 to-gray-700"
  >
    <Card class="p-5 w-[440px]">
      <CardHeader class="text-center px-0">
        <CardTitle class="text-xl"> Register to AML </CardTitle>
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
          <RouterLink to="/login">
            <p class="text-blue-500 hover:underline">Login</p>
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
import { ref } from "vue";

import router from "@/router";
import { AddUser } from "@/services/service-users";
import { toTypedSchema } from "@vee-validate/zod";
import { Loader2, LucideEyeClosed } from "lucide-vue-next";
import { useForm } from "vee-validate";
import * as z from "zod";

const formSchema = z
  .object({
    email: z
      .string({
        required_error: "Email is required",
        invalid_type_error: "Email must be a string",
      })
      .email("Email must be a valid email address"),
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
    confirmPassword: z
      .string({
        required_error: "Confirm Password is required",
      })
      .min(8, "Confirm Password must be at least 8 characters")
      .max(16, "Confirm Password must be at most 16 characters"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

const isFieldDirty = ref(false);

const { handleSubmit, handleReset, errors } = useForm({
  validationSchema: toTypedSchema(formSchema),
});
const { mutateAsync: addUser, isPending } = AddUser();

const onSubmit = handleSubmit(async (values) => {
  try {
    await addUser({
      email: values.email,
      username: values.username,
      password: values.password,
    });
  } catch (error) {
    console.error(error);
  }
  handleReset();
  router.push("/login");
});

const fields = [
  {
    name: "email",
    label: "Email",
    placeholder: "Email",
    type: "email",
  },
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
  {
    name: "confirmPassword",
    label: "Confirm Password",
    placeholder: "Confirm Password",
    type: "password",
    icon: LucideEyeClosed,
  },
];
</script>
