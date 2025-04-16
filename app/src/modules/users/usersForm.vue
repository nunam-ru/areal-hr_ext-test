<template>
    <v-dialog
      :model-value="dialog"
      @update:model-value="$emit('update:dialog', $event)"
      max-width="700px"
    >
      <v-card>
        <v-card-title class="headline">{{ getDialogTitle }}</v-card-title>
        <v-form ref="form">
          <v-card-text>
            <v-text-field
              v-if="!resetPassword"
              v-model="localUsers.last_name"
              label="Фамилия"
              :error-messages="errors.last_name"
              required
            ></v-text-field>
            <v-text-field
              v-if="!resetPassword"
              v-model="localUsers.first_name"
              label="Имя"
              :error-messages="errors.first_name"
              required
            ></v-text-field>
            <v-text-field
              v-if="!resetPassword"
              v-model="localUsers.third_name"
              label="Отчество"
              :error-messages="errors.third_name"
              required
            ></v-text-field>
            <v-text-field
              v-if="!resetPassword"
              v-model="localUsers.login"
              label="Логин"
              :error-messages="errors.login"
              required
              autocomplete="username"
            ></v-text-field>
            <v-text-field
              v-if="!isEditMode"
              :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
              :type="show1 ? 'text' : 'password'"
              v-model="localUsers.password"
              label="Пароль"
              :error-messages="errors.password"
              @click:append="show1 = !show1"
              required
              autocomplete="new-password"
            ></v-text-field>
            <v-text-field
              v-if="!isEditMode"
              :append-icon="show2 ? 'mdi-eye' : 'mdi-eye-off'"
              :type="show2 ? 'text' : 'password'"
              v-model="localUsers.checkPassword"
              label="Подтверждение пароля"
              :error-messages="errors.checkPassword"
              @click:append="show2 = !show2"
              required
              autocomplete="new-password"
            ></v-text-field>
          </v-card-text>
        </v-form>
        <v-card-actions>
          <v-btn color="blue" text @click="closeDialog">Отмена</v-btn>
          <v-btn color="blue" text @click="saveUsers">
            {{ isAddMode ? "Добавить" : "Сохранить" }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </template>
  <script>
  import UsersApi from "./usersApi";
  export default {
    props: {
      dialog: {
        type: Boolean,
        required: true,
      },
      isAddMode: {
        type: Boolean,
        required: true,
      },
      isEditMode: {
        type: Boolean,
        required: true,
      },
      resetPassword: {
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
        localUsers: { ...this.TableUsers },
        errors: {},
        show1: false,
        show2: false,
      };
    },
    watch: {
      TableUsers: {
        handler(newUsers) {
          this.localUsers = { ...newUsers };
        },
        deep: true,
      },
    },
    emits: ["update:dialog", "save"],
    computed: {
      getDialogTitle() {
        return this.resetPassword
          ? "Сброс пароля"
          : this.isAddMode
          ? "Добавить данные пользователя"
          : "Изменить данные пользователя";
      },
    },
    methods: {
      closeDialog() {
        this.errors = [];
        this.show1 = false;
        this.show2 = false;
        this.$emit("update:dialog", false);
      },
      saveUsers() {
        if (this.isAddMode) {
          if (this.localUsers.password == this.localUsers.checkPassword)
            this.addUser();
          else this.errors.checkPassword = "Пароль не совпадает";
        } else {
          if (this.resetPassword == true) {
            if (this.localUsers.password == this.localUsers.checkPassword)
              this.updateUser();
            else this.errors.checkPassword = "Пароль не совпадает";
          } else {
            this.updateUser();
          }
        }
      },
      addUser() {
        console.log(this.localUsers);
  
        UsersApi.addUser({
          last_name: this.localUsers.last_name,
          first_name: this.localUsers.first_name,
          third_name: this.localUsers.third_name,
          login: this.localUsers.login,
          password: this.localUsers.password,
        })
          .then(() => {
            this.errors = [];
            this.$emit("save");
            this.closeDialog();
            this.localUsers = [];
          })
          .catch((err) => {
            if (err.status == 400) {
              this.errors = err.data.errors;
            } else {
                console.log(err)
            }
          });
      },
      updateUser() {
        this.users = {};
        if (this.resetPassword) {
          this.users = {
            last_name: this.localUsers.last_name,
            first_name: this.localUsers.first_name,
            third_name: this.localUsers.third_name,
            login: this.localUsers.login,
            password: this.localUsers.password,
          };
        } else {
          this.users = {
            last_name: this.localUsers.last_name,
            first_name: this.localUsers.first_name,
            third_name: this.localUsers.third_name,
            login: this.localUsers.login,
          };
        }
  
        UsersApi.updateUser(this.localUsers.id, this.users, this.resetPassword)
          .then(() => {
            this.errors = [];
            this.$emit("save");
            this.closeDialog();
            this.localUsers = [];
          })
          .catch((err) => {
            if (err.status == 400) {
              this.errors = err.data.errors;
            } else {
                console.log(err)
            }
          });
      },
    },
  };
  </script>
  