<template>
    <v-table>
      <thead>
        <tr>
          <th>Код</th>
          <th>Фамилия</th>
          <th>Имя</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in employees" :key="item.id">
          <td>{{ item.id }}</td>
          <td>{{ item.last_name }}</td>
          <td>{{ item.first_name }}</td>
        </tr>
      </tbody>
    </v-table>
  </template>
  
  <script>
  import EmployeesApi from "./employees_api";
  export default {
    data() {
      return {
        employees: [],
      };
    },
    mounted() {
      this.fetchEmployees();
    },
    methods: {
      fetchEmployees() {
        EmployeesApi.getEmployees().then((data) => {
            this.employees = data;
          }).catch((err) => {
            console.log(err)
          });
      },
    },
  };
  </script>

  <style>
  td, th {
    max-width: 150px;
  }
  </style>
  