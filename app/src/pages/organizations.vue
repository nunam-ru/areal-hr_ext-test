<template>
  <!-- <HelloWorld /> -->
  <v-container fluid class="d-flex flex-column" style="padding: 0">
    <v-toolbar flat>
      <v-toolbar-title>Организации</v-toolbar-title>
    </v-toolbar>
    <organizations_table ref="organizations_table" />
  </v-container>
</template>

<script>
  //import employees_api from "@/modules/employees/employees_api";
  import organizations_table from "@/modules/organizations/organizations_table.vue";

  export default {
  components: {
    organizations_table,
  },
  data() {
    return {
      message: '',
    };
  },
  methods: {
    refreshOrganizations() {
      this.$refs.organizations_table.fetchOrganizations();
    }
  },
  };
</script>