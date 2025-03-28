<template>
  <!-- <HelloWorld /> -->
  <v-container fluid class="d-flex flex-column" style="padding: 0">
    <v-toolbar flat>
      <v-toolbar-title>Должности</v-toolbar-title>
    </v-toolbar>
    <positions_table ref="positions_table" />
  </v-container>
</template>

<script>
  //import employees_api from "@/modules/employees/employees_api";
  import positions_table from "@/modules/positions/positions_table.vue";

  export default {
  components: {
    positions_table,
  },
  data() {
    return {
      message: '',
    };
  },
  methods: {
    refreshPositions() {
      this.$refs.positions_table.fetchPositions();
    }
  },
  };
</script>