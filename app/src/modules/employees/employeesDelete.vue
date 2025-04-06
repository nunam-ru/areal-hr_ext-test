<template>
    <v-dialog
      :model-value="deleteDialog"
      @update:model-value="$emit('update:deleteDialog', $event)"
      max-width="500px"
    >
      <v-card>
        <v-card-title class="headline">Уволить сотрудника</v-card-title>
        <v-card-text>
          Вы уверены, что хотите уволить сотрудника
          {{ LocalEmployees.last_name }} {{ LocalEmployees.first_name }}?
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="closeDialog">Отмена</v-btn>
          <v-btn color="red darken-1" text @click="deleteEmployee"
            >Уволить</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </template>
  
  <script>
  import EmployeesApi from "./employeesApi";
  export default {
    props: {
      deleteDialog: {
        type: Boolean,
        required: true,
      },
      TableEmployees: {
        type: Object,
        required: true,
      },
    },
    data() {
      return {
        LocalEmployees: { ...this.TableEmployees },
      };
    },
    watch: {
      TableEmployees: {
        handler(newEmployee) {
          this.LocalEmployees = { ...newEmployee };
        },
        deep: true,
      },
    },
    emits: ["update:deleteDialog", "delete"],
    methods: {
      closeDialog() {
        this.$emit("update:deleteDialog", false);
      },
      deleteEmployee() {
        EmployeesApi.deleteEmployee(this.LocalEmployees.id)
          .then(() => {
            this.closeDialog();
            this.$emit("delete");
          })
          .catch((err) => {
            console.log(err)
          });
      },
    },
  };
  </script>
  