<template>
  <AppLayout>
    <!-- <div class="flex justify-between items-center">
          <h1 class="text-2xl font-bold">Artists</h1>
        </div> -->
    <Card>
      <CardHeader>
        <CardTitle>Artist Details</CardTitle>
      </CardHeader>
      <CardContent>
        {{ console.log(artistData) }}
        <form @submit.prevent="onSubmit">
          <div class="grid sm:grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <FormField
              v-for="field in fields"
              :key="field.name"
              v-slot="{ componentField }"
              :name="field.name"
              :validate-on-blur="!isFieldDirty"
            >
              <FormItem>
                <FormLabel>{{ field.label }}</FormLabel>
                <FormControl v-if="field.type !== 'radiogroup'">
                  <Input
                    :type="field.type"
                    :placeholder="field.placeholder"
                    v-bind="componentField"
                  />
                </FormControl>
                <FormControl v-else-if="field.type === 'radiogroup'">
                  <div class="flex pt-2 space-x-4">
                    <div
                      v-for="option in field.options"
                      class="space-x-1"
                      :key="option.value"
                    >
                      <input
                        :id="option.value"
                        :name="field.name"
                        :value="option.value"
                        type="radio"
                        v-bind="componentField"
                      />
                      <label :for="option.value">{{ option.label }}</label>
                    </div>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
          </div>
          <Button type="submit">
            <Loader2 v-if="isPending" class="w-4 h-4 mr-2 animate-spin" />
            Add Artist
          </Button>
        </form>
      </CardContent>
    </Card>
  </AppLayout>
</template>
<script setup>
import Button from "@/components/ui/button/Button.vue";
import { CardHeader } from "@/components/ui/card";
import Card from "@/components/ui/card/Card.vue";
import CardContent from "@/components/ui/card/CardContent.vue";
import CardTitle from "@/components/ui/card/CardTitle.vue";
import { FormField } from "@/components/ui/form";
import FormControl from "@/components/ui/form/FormControl.vue";
import FormItem from "@/components/ui/form/FormItem.vue";
import FormLabel from "@/components/ui/form/FormLabel.vue";
import FormMessage from "@/components/ui/form/FormMessage.vue";
import Input from "@/components/ui/input/Input.vue";
import AppLayout from "@/layouts/AppLayout.vue";
import router from "@/router";
import { AddArtist, GetArtistById } from "@/services/service-artist";
import { toTypedSchema } from "@vee-validate/zod";
import { Loader2 } from "lucide-vue-next";
import { useForm } from "vee-validate";
import { ref, watch } from "vue";
import { useRoute } from "vue-router";
import * as z from "zod";

const route = useRoute();
const { data } = GetArtistById(route.params.id);
// const { data } = GetArtistById($route.params.id);
const { mutateAsync: addArtist, isPending } = AddArtist();
const artistData = ref({});
const formSchema = toTypedSchema(
  z.object({
    name: z
      .string({
        required_error: "Artist Name is required",
      })
      .min(8, "Artist Name must be at least 8 characters"),
    dob: z
      .string({
        required_error: "Date of Birth is required",
      })
      .refine(
        (value) => {
          return new Date(value).getFullYear() < 2020;
        },
        { message: "Artist should be at least 5 years old" }
      ),
    first_release_year: z
      .number({
        required_error: "First Release Year is required",
        invalid_type_error: "First Release Year is required",
      })
      .min(1800, "First Release Year must be at least in the 1800's")
      .max(
        new Date().getFullYear(),
        "First Release Year must be at most the current year"
      ),
    no_of_albums_released: z.number({
      required_error: "Number of Albums is required",
    }),
    address: z.string({
      required_error: "Address is required",
    }),
    gender: z.enum(["male", "female", "other"], {
      required_error: "Gender is required",
    }),
  })
);
const { handleSubmit, handleReset, resetField } = useForm({
  validationSchema: formSchema,
});
watch(
  data,
  (newData) => {
    if (newData) {
      artistData.value = newData.artist;
      resetField({
        name: "name",
        value: newData.name,
      });
    }
  },
  {
    immediate: true,
  }
);
const isFieldDirty = ref(false);

const onSubmit = handleSubmit(async (values) => {
  try {
    addArtist(values);
    handleReset();
  } catch (error) {
    console.error(error);
  }
  router.push("/artists");
});

const fields = [
  {
    name: "name",
    label: "Artist Name",
    placeholder: "Artist Name",
    type: "text",
  },
  {
    name: "dob",
    label: "Date of Birth",
    placeholder: "Date of Birth",
    type: "date",
  },
  {
    name: "first_release_year",
    label: "First Release Year",
    placeholder: "First Release Year",
    type: "number",
  },
  {
    name: "no_of_albums_released",
    label: "Number of Albums",
    placeholder: "Number of Albums",
    type: "number",
  },
  {
    name: "address",
    label: "Address",
    placeholder: "Address",
    type: "text",
  },
  {
    name: "gender",
    label: "Gender",
    type: "radiogroup",
    options: [
      {
        label: "Male",
        value: "male",
      },
      {
        label: "Female",
        value: "female",
      },
      {
        label: "Others",
        value: "other",
      },
    ],
  },
];
</script>
