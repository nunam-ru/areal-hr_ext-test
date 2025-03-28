<template>
    <v-table>
      <thead>
        <tr>
          <th>Код</th>
          <th>Организация</th>
          <th>Комментарий</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in organizations" :key="item.id">
          <td>{{ item.id }}</td>
          <td>{{ item.name }}</td>
          <td>{{ item.comment }}</td>
        </tr>
      </tbody>
    </v-table>
  </template>
  
  <script>
  import OrganizationsApi from "./organizations_api";
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
      fetchOrganizations() {
        OrganizationsApi.getOrganizations().then((data) => {
            this.organizations = data;
          }).catch((err) => {
            console.log(err)
          });
      },
    },
  };
  </script>

  <style scoped>
  td, th {
    max-width: 150px;
  }

  th {
    background-color: rgb(238, 238, 238);
  }
  </style>
  