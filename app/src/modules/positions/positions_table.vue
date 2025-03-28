<template>
    <v-table>
      <thead>
        <tr>
          <th>Код</th>
          <th>Должность</th>
          <th>Отдел</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in positions" :key="item.id">
          <td>{{ item.id }}</td>
          <td>{{ item.position_name }}</td>
          <td>{{ item.department_name }}</td>
        </tr>
      </tbody>
    </v-table>
  </template>
  
  <script>
  import PositionsApi from "./positions_api";
  export default {
    data() {
      return {
        positions: [],
      };
    },
    mounted() {
      this.fetchPositions();
    },
    methods: {
      fetchPositions() {
        PositionsApi.getPositions().then((data) => {
            this.positions = data;
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
  