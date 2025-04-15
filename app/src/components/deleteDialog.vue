<template>
    <v-dialog
      :model-value="deleteDialog"
      @update:model-value="$emit('update:deleteDialog', $event)"
      max-width="500px"
    >
      <v-card>
        <v-card-title class="headline">Подтверждение удаления</v-card-title>
        <v-card-text>Вы точно хотите удалить данную запись?</v-card-text>
        <v-card-actions>
          <v-btn color="blue" text @click="closeDialog">Отмена</v-btn>
          <v-btn color="red" text @click="deleteRecord">Удалить</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </template>
  
  <script>
  export default {
    props: {
      deleteDialog: {
        type: Boolean,
        required: true,
      },
      deleteId: {
        type: Number,
        required: true,
      },
    },
    emits: ["update:deleteDialog", "apply-delete", "delete"],
    data() {
      return {
        localDeleteId: this.deleteId,
      };
    },
    watch: {
      deleteId(newId) {
        this.localDeleteId = newId;
      },
    },
    methods: {
      closeDialog() {
        this.$emit("update:deleteDialog", false);
      },
      deleteRecord() {
        this.$emit('apply-delete')
        this.closeDialog();
        this.localDeleteId = null;
      },
    },
  };
  </script>
  