<template>
    <v-dialog
      :model-value="deleteDialog"
      @update:model-value="$emit('update:deleteDialog', $event)"
      max-width="500px"
    >
      <v-card>
        <v-card-title class="headline">Подтверждение удаления</v-card-title>
        <v-card-text>Вы точно хотите удалить данную должность?</v-card-text>
        <v-card-actions>
          <v-btn color="blue" text @click="closeDialog">Отмена</v-btn>
          <v-btn color="red" text @click="deletePosition">Удалить</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </template>
  
  <script>
  import PositionApi from "./positions_api";
  export default {
    props: {
      deleteDialog: {
        type: Boolean,
        required: true,
      },
      deletePositionId: {
        type: Number,
        required: true,
      },
    },
    data() {
      return {
        localdeletePositionId: this.deletePositionId,
      };
    },
    watch: {
      deletePositionId(newId) {
        this.localdeletePositionId = newId;
      },
    },
    emits: ["update:deleteDialog", "delete"],
    methods: {
      closeDialog() {
        this.$emit("update:deleteDialog", false);
      },
      deletePosition() {
        PositionApi.deletePosition(this.localdeletePositionId)
          .then(() => {
            this.$emit("delete");
            this.closeDialog();
            this.localdeletePositionId = null;
          })
          .catch((err) => {
            console.log(err)
          });
      },
    },
  };
  </script>
  