<template>
    <v-table>
      <thead>
        <tr>
          <th class="table_col" v-for="[key, value] of Object.entries({
            'id': 'Код', 
            'last_name': 'Фамилия', 
            'first_name': 'Имя', 
            'third_name': 'Отчество', 
            'login': 'Логин', 
            'roles_name': 'Роль'
            })"
            @click="sortHeader(key)"
          :class="{
              'sorted_asc': this.asc[key] === 1 || (this.$route.query.sort_type === key && this.$route.query.order_by === 'asc'),
              'sorted_desc': this.asc[key] === 2 || (this.$route.query.sort_type === key && this.$route.query.order_by === 'desc'),
              'not_sorted': this.asc[key] === 0
            }">{{ value }}
          </th>
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
        asc: {
          'id': 0, 
          'last_name': 0, 
          'first_name': 0, 
          'third_name': 0, 
          'login': 0, 
          'roles_name': 0
        }
      };
    },
    methods: {
      sortHeader(field) {
        for (let [key, value] of Object.entries(this.asc)) {
          if (key != field) {
            this.asc[key] = 0
          }
        }
        if (this.asc[field] === 1) {
          this.asc[field] = 2
          this.$router.push({path: this.$route.fullPath, query: {
            page: this.$route.query.page,
            sort_type: field,
            order_by: 'desc'
          } })
          this.fetchUsersPage(this.$route.query.page, field, 'desc');
        }
        else if (this.asc[field] === 2) {
          this.asc[field] = 0
          this.$router.push({path: this.$route.fullPath, query: {
            page: this.$route.query.page,}})
          this.fetchUsersPage(this.$route.query.page);
        }
        else if (this.asc[field] === 0) {
          this.asc[field] = 1
          this.$router.push({path: this.$route.fullPath, query: {
            page: this.$route.query.page,
            sort_type: field,
            order_by: 'asc'
          } })
          this.fetchUsersPage(this.$route.query.page, field, 'asc');
        }
      },
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
      fetchUsersPage(page, sort_type, order_by) {
        UsersApi.getUsers(page, sort_type, order_by).then((data) => {
            this.users = data;
            this.$parent.pagination.pages = Math.ceil(parseInt(data[0].pages) / this.$parent.pagination.itemsPerPage);
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

  