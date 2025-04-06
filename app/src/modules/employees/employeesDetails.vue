<template>
    <v-dialog
      :model-value="detailsDialog"
      @update:model-value="$emit('update:dialog', $event)"
      max-width="500px"
    >
      <v-card>
        <v-card-title class="headline"
          >Подробная информация о сотруднике</v-card-title
        >
        <v-card-text>
          <v-list>
            <v-list-item>
              <v-list-item-title>Дата рождения</v-list-item-title>
              <v-list-item-subtitle>{{
                TableEmployees.birth_date
              }}</v-list-item-subtitle>
            </v-list-item>
            <v-list-item>
              <v-list-item-title>Серия паспорта</v-list-item-title>
              <v-list-item-subtitle>{{
                TableEmployees.passport_series
              }}</v-list-item-subtitle>
            </v-list-item>
            <v-list-item>
              <v-list-item-title>Номер паспорта</v-list-item-title>
              <v-list-item-subtitle>{{
                TableEmployees.passport_number
              }}</v-list-item-subtitle>
            </v-list-item>
            <v-list-item>
              <v-list-item-title>Код подразделения</v-list-item-title>
              <v-list-item-subtitle>{{
                TableEmployees.passport_code
              }}</v-list-item-subtitle>
            </v-list-item>
            <v-list-item>
              <v-list-item-title>Кем выдан</v-list-item-title>
              <v-list-item-subtitle>{{
                TableEmployees.passport_by
              }}</v-list-item-subtitle>
            </v-list-item>
            <v-list-item>
              <v-list-item-title>Дата выдачи</v-list-item-title>
              <v-list-item-subtitle>{{
                TableEmployees.passport_date
              }}</v-list-item-subtitle>
            </v-list-item>
            <v-list-item>
              <v-list-item-title>Адрес</v-list-item-title>
              <v-list-item-subtitle>{{
                TableEmployees.address
              }}</v-list-item-subtitle>
            </v-list-item>
          </v-list>
        </v-card-text>
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
      detailsDialog: {
        type: Boolean,
        required: true,
      },
      TableEmployees: {
        type: Object,
        required: true,
      },
    },
    emits: ["update:detailsDialog"],
    methods: {
      closeDialog() {
        this.$emit("update:detailsDialog", false);
      },
    },
  };
  </script>
  