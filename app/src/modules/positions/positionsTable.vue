<template>
    <v-table>
      <thead>
        <tr>
          <th>Код</th>
          <th>Должность</th>
          <th>Отдел</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in positions" :key="item.id">
          <td>{{ item.id }}</td>
          <td>{{ item.position_name }}</td>
          <td>{{ item.department_name }}</td>
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
  import PositionsApi from "./positionsApi";
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
      fetchPositionsPage(page) {
        PositionsApi.getPositions(page).then((data) => {
            this.positions = data;
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
      openChangelogDialog(item) {
        this.$emit("changelog", item);
      },
    },
  };
  </script>