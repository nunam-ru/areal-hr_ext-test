<template>
    <v-table>
      <thead>
        <tr>
          <th>Код</th>
          <th>Организация</th>
          <th>Комментарий</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in organizations" :key="item.id">
          <td>{{ item.id }}</td>
          <td>{{ item.name }}</td>
          <td>{{ item.comment }}</td>
          <td>
            <div class="action_buttons">
              <v-btn color="blue" @click="openEditDialog(item)" small
              >Изменить</v-btn
              >
              <v-btn color="blue" @click="openChangelogDialog(item)" small
              >История</v-btn
              >
              <v-btn color="red" @click="openDeleteDialog(item.id)" small
                >Удалить</v-btn
              >
            </div>
          </td>
        </tr>
      </tbody>
    </v-table>
  </template>
  
  <script>
  import OrganizationsApi from "./organizationsApi";
  export default {
    data() {
      return {
        organizations: [],
      };
    },
    mounted() {
      this.fetchOrganizations();
    },
    methods: {
      openEditDialog(item) {
        this.$emit("edit", item);
      },
      openDeleteDialog(id) {
        this.$emit("delete", id);
      },
      fetchOrganizations() {
        OrganizationsApi.getOrganizations().then((data) => {
            this.organizations = data;
          }).catch((err) => {
            console.log(err)
          });
      },
      fetchOrganizationsPage(page) {
        OrganizationsApi.getOrganizations(page).then((data) => {
            this.organizations = data;
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