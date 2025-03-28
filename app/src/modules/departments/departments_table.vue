<template>
    <v-table>
      <thead>
        <tr>
          <th>Код</th>
          <th>Отдел</th>
          <th>Родитель</th>
          <th>Комментарий</th>
          <th>Организация</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in departments" :key="item.id">
          <td>{{ item.department_id }}</td>
          <td>{{ item.department_name }}</td>
          <td>{{ item.parent_name }}</td>
          <td>{{ item.department_comment }}</td>
          <td>{{ item.organization_name }}</td>
        </tr>
      </tbody>
    </v-table>
  </template>
  
  <script>
  import DepartmentsApi from "./departments_api";
  export default {
    data() {
      return {
        departments: [],
      };
    },
    mounted() {
      this.fetchDepartments();
    },
    methods: {
      fetchDepartments() {
        DepartmentsApi.getDepartments().then((data) => {
            this.departments = data;
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
  