<template>
  <!-- <HelloWorld /> -->
  <v-container fluid class="d-flex flex-column" style="padding: 0">
    <v-toolbar flat>
      <v-toolbar-title>Отделы</v-toolbar-title>
    </v-toolbar>
    <users_table ref="users_table" />
  </v-container>
</template>

<script>
  //import employees_api from "@/modules/employees/employees_api";
  import users_table from "@/modules/users/users_table.vue";

  export default {
  components: {
    users_table,
  },
  data() {
    return {
      message: '',
    };
  },
  methods: {
    refreshDepartments() {
      this.$refs.users_table.fetchDepartments();
    }
  },
  };
</script>