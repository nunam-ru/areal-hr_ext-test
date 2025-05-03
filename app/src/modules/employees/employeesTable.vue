<template>
    <v-table>
      <thead>
        <tr>
          <th class="table_col" v-for="[key, value] of Object.entries({
            'id': 'Код', 
            'last_name': 'Фамилия', 
            'first_name': 'Имя',
            'third_name': 'Отчество',
            'birth_date': 'Дата рождения',
            'address': 'Адрес',
            'passport_series': 'Паспорт',
            })"
            @click="sortHeader(key)"
          :class="{
              'sorted_asc': this.asc[key] === 1 || (this.$route.query.sort_type === key && this.$route.query.order_by === 'asc'),
              'sorted_desc': this.asc[key] === 2 || (this.$route.query.sort_type === key && this.$route.query.order_by === 'desc'),
              'not_sorted': this.asc[key] === 0
            }">{{ value }}
          </th>
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
          <td>{{ item.passport_series +' '+ item.passport_number}}</td>
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
        asc: {
          'id': 0, 
          'last_name': 0, 
          'first_name': 0,
          'third_name': 0,
          'birth_date': 0,
          'address': 0,
          'passport_series': 0,
        },
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
          this.fetchEmployeesPage(this.$route.query.page, field, 'desc');
        }
        else if (this.asc[field] === 2) {
          this.asc[field] = 0
          this.$router.push({path: this.$route.fullPath, query: {
            page: this.$route.query.page,}})
          this.fetchEmployeesPage(this.$route.query.page);
        }
        else if (this.asc[field] === 0) {
          this.asc[field] = 1
          this.$router.push({path: this.$route.fullPath, query: {
            page: this.$route.query.page,
            sort_type: field,
            order_by: 'asc'
          } })
          this.fetchEmployeesPage(this.$route.query.page, field, 'asc');
        }
      },
      fetchEmployees() {
        EmployeesApi.getEmployees().then((data) => {
            this.employees = data;
          }).catch((err) => {
            console.log(err)
          });
      },
      fetchEmployeesPage(page, sort_type, order_by) {
        EmployeesApi.getEmployees(page, sort_type, order_by).then((data) => {
            this.employees = data;
            this.$parent.pagination.pages = Math.ceil(parseInt(data[0].pages) / this.$parent.pagination.itemsPerPage);
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
  