<template>
    <v-dialog
      :model-value="logOutDialog"
      @update:model-value="$emit('update:logOutDialog', $event)"
      max-width="500px"
    >
      <v-card>
        <v-card-title class="headline">Выход</v-card-title>
        <v-card-text>
            Вы точно хотите выйти из аккаунта?
        </v-card-text>
        <v-card-actions>
          <v-btn color="blue" text @click="closeDialog">Отмена</v-btn>
          <v-btn color="red" text @click="logOut">Выйти</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </template>
  
  <script>
  import authApi from "@/modules/auth/authApi";
  
  export default {
    props: {
      logOutDialog: {
        type: Boolean,
        required: true,
      },
    },
    emits: ["update:logOutDialog"],
    methods: {
      closeDialog() {
        this.$emit("update:logOutDialog", false);
      },
      logOut() {
        authApi
          .logOut()
          .then(() => {
            this.closeDialog();
          })
          .catch((err) => {
            console.log(err)
        });
      },
    },
  };
  </script>
  