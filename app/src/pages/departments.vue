<template>
  <!-- <HelloWorld /> -->
  <v-container fluid class="d-flex flex-column" style="padding: 0">
    <v-toolbar flat>
      <v-toolbar-title>Отделы</v-toolbar-title>
    </v-toolbar>
    <departments_table ref="departments_table" />
  </v-container>
</template>

<script>
  //import employees_api from "@/modules/employees/employees_api";
  import departments_table from "@/modules/departments/departments_table.vue";

  export default {
  components: {
    departments_table,
  },
  data() {
    return {
      message: '',
    };
  },
  methods: {
    refreshDepartments() {
      this.$refs.departments_table.fetchDepartments();
    }
  },
  };
</script>
