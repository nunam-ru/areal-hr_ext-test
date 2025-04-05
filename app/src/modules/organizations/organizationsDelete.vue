<template>
    <v-dialog
      :model-value="deleteDialog"
      @update:model-value="$emit('update:deleteDialog', $event)"
      max-width="500px"
    >
      <v-card>
        <v-card-title class="headline">Подтверждение удаления</v-card-title>
        <v-card-text>Вы точно хотите удалить данную организацию?</v-card-text>
        <v-card-actions>
          <v-btn color="blue" text @click="closeDialog">Отмена</v-btn>
          <v-btn color="red" text @click="deleteOrganization">Удалить</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </template>
  
  <script>
  import OrganizationsApi from "./organizationsApi";
  export default {
    props: {
      deleteDialog: {
        type: Boolean,
        required: true,
      },
      deleteOrganizationId: {
        type: Number,
        required: true,
      },
    },
    emits: ["update:deleteDialog", "delete"],
    data() {
      return {
        localdeleteOrganizationId: this.deleteOrganizationId,
      };
    },
    watch: {
      deleteOrganizationId(newId) {
        this.localdeleteOrganizationId = newId;
      },
    },
    methods: {
      closeDialog() {
        this.$emit("update:deleteDialog", false);
      },
      deleteOrganization() {
        OrganizationsApi.deleteOrganization(this.localdeleteOrganizationId)
          .then(() => {
            this.$emit("delete");
            this.closeDialog();
            this.localdeleteOrganizationId = null;
          })
          .catch((err) => {
            console.log(err)    
        });
      },
    },
  };
  </script>
  