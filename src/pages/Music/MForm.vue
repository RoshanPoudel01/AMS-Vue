<template>
  <AppLayout>
    <Card>
      <CardHeader>
        <CardTitle>Music Details</CardTitle>
      </CardHeader>
      <CardContent>
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
            Add Music
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
import { AddMusic } from "@/services/service-music";
import { toTypedSchema } from "@vee-validate/zod";
import { Loader2 } from "lucide-vue-next";
import { useForm } from "vee-validate";
import { ref } from "vue";
import { useRoute } from "vue-router";
import * as z from "zod";

const route = useRoute();
const { mutateAsync: addMusic, isPending } = AddMusic();
const formSchema = toTypedSchema(
  z.object({
    title: z.string({
      required_error: "Title is required",
    }),
    album_name: z.string({
      required_error: "Album Name is required",
    }),
    genre: z.enum(["rock", "jazz", "classic", "country"], {
      required_error: "Genre is required",
    }),
  })
);
const isFieldDirty = ref(false);

const { handleSubmit, handleReset, errors } = useForm({
  validationSchema: formSchema,
});

const onSubmit = handleSubmit(async (values) => {
  try {
    await addMusic({
      ...values,
      artist_id: route.params.id,
    });
    handleReset();
  } catch (error) {
    console.error(error);
  }
  router.push(`/artists/${route.params.id}/songs`);
});

const fields = [
  {
    name: "title",
    label: "Title",
    placeholder: "Title",
    type: "text",
  },
  {
    name: "album_name",
    label: "Album Name",
    placeholder: "Album Name",
    type: "text",
  },

  {
    name: "genre",
    label: "Genre",
    type: "radiogroup",
    options: [
      {
        label: "Rock",
        value: "rock",
      },
      {
        label: "Country",
        value: "country",
      },
      {
        label: "Classic",
        value: "classic",
      },
      {
        label: "Jazz",
        value: "jazz",
      },
    ],
  },
];
</script>
