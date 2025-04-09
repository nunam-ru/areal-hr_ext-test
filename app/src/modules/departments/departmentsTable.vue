<template>
    <v-table>
      <thead>
        <tr>
          <th>Код</th>
          <th>Отдел</th>
          <th>Родитель</th>
          <th>Комментарий</th>
          <th>Организация</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in departments" :key="item.id">
          <td>{{ item.department_id }}</td>
          <td>{{ item.department_name }}</td>
          <td>{{ item.parent_name }}</td>
          <td>{{ item.department_comment }}</td>
          <td>{{ item.organization_name }}</td>
          <td>
          <div class="action_buttons">
            <v-btn color="blue" @click="openEditDialog(item)" small
            >Изменить</v-btn
            >
            <v-btn color="blue" @click="openChangelogDialog(item)" small
              >История</v-btn
              >
            <v-btn color="red" @click="openDeleteDialog(item.department_id)" small
              >Удалить</v-btn
            >
          </div>
        </td>
        </tr>
      </tbody>
    </v-table>
  </template>
  
  <script>
  import DepartmentsApi from "./departmentsApi";
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
            this.$emit("updateDepartments", this.departments);
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

  <style scoped>
  td, th {
    max-width: 150px;
    font-size: 1em;
  }

  th {
    background-color: rgb(238, 238, 238);
  }

  .action_buttons {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 4px;
    padding: 10% 0;
  }
  </style>
  