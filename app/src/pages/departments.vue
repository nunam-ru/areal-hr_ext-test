<template>
  <!-- <HelloWorld /> -->
  <v-container fluid class="d-flex flex-column" style="padding: 0">
    <v-toolbar flat>
      <v-toolbar-title>Отделы</v-toolbar-title>
      <v-btn
        @click="openAddDialog(false)"
        variant="outlined"
        class="action_button white--text"
      >
        новый отдел
      </v-btn>
      <v-btn
        @click="openAddDialog(true)"
        variant="outlined"
        class="action_button white--text"
      >
        новый подотдел
      </v-btn>
    </v-toolbar>
    <DepartmentForm
      :dialog="dialog"
      :isAddMode="isAddMode"
      :is-sub-department-mode="isSubDepartmentMode"
      :departments="departments"
      :TableDepartment="TableDepartment"
      @update:dialog="dialog = $event"
      @save="refreshDepartments"
    />

    <DepartmentDeleteDialog
      :deleteDialog="deleteDialog"
      :deleteDepartmentId="deleteDepartmentId"
      @update:deleteDialog="deleteDialog = $event"
      @delete="refreshDepartments"
    />
    <departments_table ref="departments_table"
    @edit="openEditDialog"
    @delete="openDeleteDialog"
    @updateDepartments="handleUpdateDepartments"/>
  </v-container>
</template>

<script>
  import departments_api from "@/modules/departments/departments_api";
  import departments_table from "@/modules/departments/departments_table.vue";
  import DepartmentForm from "@/modules/departments/departments_form.vue";
  import DepartmentDeleteDialog from "@/modules/departments/departments_delete.vue";


  export default {
  components: {
    DepartmentForm,
    DepartmentDeleteDialog,
    departments_table,
  },
  data() {
    return {
      dialog: false,
      deleteDialog: false,
      isSubDepartmentMode: false,
      TableDepartment: {
        department_id: null,
        department_name: "",
        department_comment: "",
        parent_id: null,
        org_id: null,
      },
      deleteDepartmentId: 0,
      departments: [],
      isAddMode: false,
    };
  },
  methods: {
    handleUpdateDepartments(departments) {
      this.departments = departments;
    },
    refreshDepartments() {
      this.$refs.departments_table.fetchDepartments();
    },
    openAddDialog(isSubDepartmentMode) {
      this.isAddMode = true;
      this.isSubDepartmentMode = isSubDepartmentMode;
      this.TableDepartment = {
        department_name: "",
        department_comment: "",
        parent_id: null,
        org_id: null,
      };
      this.dialog = true;
    },
    openEditDialog(department) {
      this.isAddMode = false;
      this.isSubDepartmentMode = !!department.parent_department_name;
      this.TableDepartment = { ...department };
      this.dialog = true;
    },
    openDeleteDialog(id) {
      this.deleteDepartmentId = id;
      this.deleteDialog = true;
    },
  },
  };
</script>

<style lang="scss">
  .action_button{
    margin: 0 1%
  }
</style>
