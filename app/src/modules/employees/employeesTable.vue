<template>
    <v-table>
      <thead>
        <tr>
          <th>Код</th>
          <th>Фамилия</th>
          <th>Имя</th>
          <th>Отчество</th>
          <th>Дата рождения</th>
          <th>Адрес</th>
          <th>Паспорт серия</th>
          <th>Номер</th>
          <th></th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in employees" :key="item.id">
          <td>{{ item.id }}</td>
          <td>{{ item.last_name }}</td>
          <td>{{ item.first_name }}</td>
          <td>{{ item.third_name }}</td>
          <td>{{ item.birth_date }}</td>
          <td>{{ item.address }}</td>
          <td>{{ item.passport_series }}</td>
          <td>{{ item.passport_number }}</td>
          <td class="fired_str">
            {{ item.fired == null ? "" : "Уволен" }}
          </td>
          <td>
          <div class="action_buttons">
            <v-btn color="blue" @click="openDetailsDialog(item)" small>
              Подробнее
            </v-btn>
            <v-btn
              color="blue"
              @click="openFilesDialog(item)"
              small
              :disabled="item.fired != null"
            >
              Файлы
            </v-btn>
            <v-btn
              color="blue"
              @click="openEditDialog(item)"
              small
              :disabled="item.fired != null"
            >
              Изменить
            </v-btn>
            <v-btn color="blue" @click="openChangelogDialog(item)" small
              >История</v-btn
            >
            <v-btn
              color="red"
              @click="openDeleteDialog(item)"
              small
              :disabled="item.fired != null"
            >
              Уволить
            </v-btn>
          </div>
        </td>
        </tr>
      </tbody>
    </v-table>
  </template>
  
  <script>
  import EmployeesApi from "./employeesApi";
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
      openEditDialog(item) {
        this.$emit("edit", item);
      },
      openDetailsDialog(item) {
        this.$emit("DetailsDialog", item);
      },
      openFilesDialog(item) {
        this.$emit("FilesDialog", item);
      },
      openDeleteDialog(item) {
        this.$emit("delete", item);
      },
      openChangelogDialog(item) {
        this.$emit("changelog", item);
      },
    },
  };
  </script>

  <style scoped>
  td, th {
    max-width: 200px;
  }

  th {
    background-color: rgb(238, 238, 238);
  }

  .fired_str {
    color: red;
    font-weight: bold;
  }

  .action_buttons {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 4px;
  padding: 10% 0;
  }
  </style>
  