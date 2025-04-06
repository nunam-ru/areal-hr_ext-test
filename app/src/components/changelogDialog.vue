<template>
    <v-dialog
      :model-value="changelogDialog"
      @update:model-value="$emit('update:changelogDialog', $event)"
      max-width="1000px"
    >
      <v-card>
        <v-card-title class="headline">История записи</v-card-title>
        <v-table>
          <thead>
            <tr>
              <th>Код</th>
              <th>Дата операции</th>
              <th>Автор</th>
              <th>Было</th>
              <th>Стало</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in changelog" :key="item.id">
              <td>{{ item.id }}</td>
              <td>{{ item.changelog_date }}</td>
              <td>{{ item.full_name }}</td>
              <td v-html="formatChStr(item.oldvalue)"></td>
              <td v-html="formatChStr(item.newvalue)"></td>
            </tr>
          </tbody>
        </v-table>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="closeDialog">Закрыть</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </template>
  
  <script>
  export default {
    props: {
      changelogDialog: {
        type: Boolean,
        required: true,
      },
      changelog: {
        type: Object,
        required: true,
      },
    },
    emits: ["update:changelogDialog"],
    data() {
      return {};
    },
    methods: {
      closeDialog() {
        this.$emit("update:changelogDialog", false);
      },
      formatChStr(value) {
        if (!value) return "";
        return value.replace(/\n/g, "<br>");
      },
    },
  };
  </script>
  