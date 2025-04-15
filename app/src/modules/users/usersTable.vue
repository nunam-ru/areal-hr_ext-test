<template>
    <v-table>
      <thead>
        <tr>
          <th>Код</th>
          <th>Фамилия</th>
          <th>Имя</th>
          <th>Отчество</th>
          <th>Логин</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in users" :key="item.id">
          <td>{{ item.id }}</td>
          <td>{{ item.last_name }}</td>
          <td>{{ item.first_name }}</td>
          <td>{{ item.third_name }}</td>
          <td>{{ item.login }}</td>
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
    },
  };
  </script>

  