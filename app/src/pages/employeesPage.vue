<template>
  <!-- <HelloWorld /> -->
  <v-container fluid class="d-flex flex-column" style="padding: 0">
    <v-toolbar flat>
      <v-toolbar-title>Сотрудники</v-toolbar-title>
      <v-btn
        @click="openAddDialog()"
        variant="outlined"
        class="white--text"
      >
        Добавить
      </v-btn>
    </v-toolbar>
    <employees_table ref="employees_table" />
  </v-container>
</template>

<script>
  //import employees_api from "@/modules/employees/employees_api";
  import employees_table from "@/modules/employees/employeesTable.vue";

  export default {
  components: {
    employees_table,
  },
  data() {
    return {
      message: '',
    };
  },
  methods: {
    refreshEmployees() {
      this.$refs.employees_table.fetchEmployees();
    }
  },
  };
</script>
