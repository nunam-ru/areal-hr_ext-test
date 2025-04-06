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

    <EmployeesDetailsDialog
      :detailsDialog="detailsDialog"
      :TableEmployees="TableEmployees"
      @update:detailsDialog="detailsDialog = $event"
    />

    <EmployeesDeleteDialog
      :deleteDialog="deleteDialog"
      :TableEmployees="TableEmployees"
      @update:deleteDialog="deleteDialog = $event"
      @delete="refreshEmployees"
    />

    <changelogDialog
      :changelogDialog="changelogDialog"
      :changelog="empChangelog"
      @update:changelogDialog="changelogDialog = $event"
    />

    <EmployeesFilesDialog
      :filesDialog="filesDialog"
      :TableEmployees="TableEmployees"
      @update:filesDialog="filesDialog = $event"
    />

    <EmployeesForm
      :dialog="dialog"
      :isEditMode="isEditMode"
      :TableEmployees="TableEmployees"
      @save="refreshEmployees"
      @update:dialog="dialog = $event"
    />

    <employees_table ref="employees_table" 
      @edit="openEditDialog"
      @delete="openDeleteDialog"
      @DetailsDialog="openDetailsDialog"
      @FilesDialog="openFilesDialog"
      @changelog="fetchEmpChangelog"/>


  </v-container>
</template>

<script>
  import employeesApi from "@/modules/employees/employeesApi";
  import employees_table from "@/modules/employees/employeesTable.vue";
  import EmployeesForm from "@/modules/employees/employeesForm.vue";
  import changelogDialog from "@/components/changelogDialog.vue";
  import EmployeesDeleteDialog from "@/modules/employees/employeesDelete.vue"
  import EmployeesDetailsDialog from "@/modules/employees/employeesDetails.vue"
  import EmployeesFilesDialog from "@/modules/employees/employeesFiles.vue"

  export default {
  components: {
    employees_table,
    EmployeesForm,
    changelogDialog,
    EmployeesDeleteDialog,
    EmployeesDetailsDialog,
    EmployeesFilesDialog,
  },
  data() {
    return {
      dialog: false,
      isEditMode: false,
      detailsDialog: false,
      deleteDialog: false,
      filesDialog: false,
      changelogDialog: false,
      TableEmployees: {
        id: null,
        last_name: "",
        first_name: "",
        third_name: "",
        birth_date: null,
        passport_series: "",
        passport_number: "",
        passport_code: "",
        passport_by: "",
        passport_date: null,
        address: "",
        department_name: "",
        position_name: "",
        dep_id: null,
        pos_id: null,
        salary: null,
      },
      empChangelog: [],
    };
  },
  methods: {
    refreshEmployees() {
      this.$refs.employees_table.fetchEmployees();
    },
    openAddDialog() {
      this.isEditMode = false;
      this.TableEmployees = {
        id: null,
        last_name: "",
        first_name: "",
        third_name: "",
        birth_date: null,
        passport_series: "",
        passport_number: "",
        passport_code: "",
        passport_by: "",
        passport_date: null,
        address: "",
        department_name: "",
        position_name: "",
        dep_id: null,
        pos_id: null,
        salary: null,
      };
      this.dialog = true;
    },
    openEditDialog(item) {
      this.isEditMode = true;
      this.TableEmployees = {
        id: item.id,
        last_name: item.last_name,
        first_name: item.first_name,
        third_name: item.third_name,
        birth_date: new Date(item.birth_date),
        passport_series: item.passport_series,
        passport_number: item.passport_number,
        passport_code: item.passport_code,
        passport_by: item.passport_by,
        passport_date: new Date(item.passport_date),
        address: item.address,
        dep_id: item.dep_id,
        pos_id: item.pos_id,
        salary: parseFloat(item.salary.replace(/[$,]/g, "")),
      };
      this.dialog = true;
    },
    openDetailsDialog(item) {
      this.TableEmployees = { ...item };
      this.detailsDialog = true;
    },
    openDeleteDialog(item) {
      this.TableEmployees = item;
      this.deleteDialog = true;
    },
    openFilesDialog(item) {
      this.TableEmployees = item;
      this.filesDialog = true;
    },
    fetchEmpChangelog(item) {
      employeesApi
        .getEmpChangelog(item.id)
        .then((data) => {
          this.empChangelog = data;
          this.changelogDialog = true;
        })
        .catch((err) => {
          console.log(err)
          this.empChangelog = [];
        });
    },
  },
  };
</script>
