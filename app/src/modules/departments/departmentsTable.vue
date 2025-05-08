<template>
    <v-table>
      <thead>
        <tr>
          <th class="table_col" v-for="[key, value] of Object.entries({
          'department_id': 'Код', 
          'department_name': 'Отдел', 
          'parent_name': 'Родитель',
          'department_comment': 'Комментарий',
          'organization_name': 'Организация'
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
        asc: {
          'department_id': 0, 
          'department_name': 0, 
          'parent_name': 0,
          'department_comment': 0,
          'organization_name': 0
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
          this.fetchDepartmentsPage(this.$route.query.page, field, 'desc');
        }
        else if (this.asc[field] === 2) {
          this.asc[field] = 0
          this.$router.push({path: this.$route.fullPath, query: {
            page: this.$route.query.page,}})
          this.fetchDepartmentsPage(this.$route.query.page);
        }
        else if (this.asc[field] === 0) {
          this.asc[field] = 1
          this.$router.push({path: this.$route.fullPath, query: {
            page: this.$route.query.page,
            sort_type: field,
            order_by: 'asc'
          } })
          this.fetchDepartmentsPage(this.$route.query.page, field, 'asc');
        }
      },
      fetchDepartments() {
        DepartmentsApi.getDepartments().then((data) => {
            this.departments = data.table;
            this.$emit("updateDepartments", this.departments);
          }).catch((err) => {
            console.log(err)
          });
      },
      fetchDepartmentsPage(page, sort_type, order_by) {
        DepartmentsApi.getDepartments(page, sort_type, order_by).then((data) => {
            this.departments = data.table;
            this.$parent.pagination.pages = Math.ceil(parseInt(data.pages[0].count) / this.$parent.pagination.itemsPerPage);
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