<template>
    <v-table>
      <thead>
        <tr>
          <th>Код</th>
          <th>Фамилия</th>
          <th>Имя</th>
          <th>Отчество</th>
          <th>Логин</th>
          <th>Роль</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in users" :key="item.id">
          <td>{{ item.id }}</td>
          <td>{{ item.last_name }}</td>
          <td>{{ item.first_name }}</td>
          <td>{{ item.third_name }}</td>
          <td>{{ item.login }}</td>
          <td>{{ item.roles_name }}</td>
          <td>
            <div class="action_buttons">
              <v-btn color="blue" @click="openEditDialog(item)" small
            >Изменить</v-btn>
            <v-btn color="blue" @click="openUpdateRoleDialog(item)" small
              >Сделать админом</v-btn>
            <v-btn color="blue" @click="openResetPasswordDialog(item)" small
              >Сброс пароля</v-btn>
            <v-btn color="red" @click="openDeleteDialog(item)" small
              >Удалить</v-btn>
            <v-btn color="blue" @click="openChangelogDialog(item)" small
              >История</v-btn>
            </div>
          </td>
        </tr>
      </tbody>
    </v-table>
  </template>
  
  <script>
  import UsersApi from "./usersApi";
  export default {
    data() {
      return {
        users: [],
      };
    },
    mounted() {
      this.fetchUsers();
    },
    methods: {
      fetchUsers() {
        UsersApi.getUsers().then((data) => {
            this.users = data;
          }).catch((err) => {
            console.log(err)
          });
      },
      openEditDialog(item) {
        this.$emit("edit", item);
      },
      openDeleteDialog(id) {
        this.$emit("delete", id);
      },
      openResetPasswordDialog(item) {
        this.$emit("reset", item);
      },
      openUpdateRoleDialog(item) {
        this.$emit("updateRole", item);
      },
      fetchUsersPage(page) {
        UsersApi.getUsers(page).then((data) => {
            this.users = data;
          }).catch((err) => {
            console.log(err)
          });
      },
      openChangelogDialog(item) {
        this.$emit("changelog", item);
      },
    },
  };
  </script>

  