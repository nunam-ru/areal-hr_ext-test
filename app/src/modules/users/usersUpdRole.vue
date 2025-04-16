<template>
    <v-dialog
      :model-value="updateRoleDialog"
      @update:model-value="$emit('update:updateRoleDialog', $event)"
      max-width="500px"
    >
      <v-card>
        <v-card-title class="headline">Права администратора</v-card-title>
        <v-card-text>
          Вы уверены, что хотите выдать права пользователю
          {{ LocalUser.last_name }} {{ LocalUser.first_name }}?
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="closeDialog">Отмена</v-btn>
          <v-btn color="blue darken-1" text @click="updateRole"
            >Выдать права</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </template>
  
  <script>
  import UsersApi from "./usersApi";
  export default {
    props: {
      updateRoleDialog: {
        type: Boolean,
        required: true,
      },
      TableUsers: {
        type: Object,
        required: true,
      },
    },
    data() {
      return {
        LocalUser: { ...this.TableUsers },
      };
    },
    watch: {
      TableUsers: {
        handler(newUser) {
          this.LocalUser = { ...newUser };
        },
        deep: true,
      },
    },
    emits: ["update:updateRoleDialog", "save"],
    methods: {
      closeDialog() {
        this.$emit("update:updateRoleDialog", false);
      },
      updateRole() {
        UsersApi.updateRoleUser(this.LocalUser.id)
          .then(() => {
            this.closeDialog();
            this.$emit("save");
          })
          .catch((err) => {
            console.log(err)
          });
      },
    },
  };
  </script>
  