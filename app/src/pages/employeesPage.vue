<template>
  <!-- <HelloWorld /> -->
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
    :deleteId="deleteEmployeeId"
    @apply-delete="deleteRecord(deleteEmployeeId)"
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


  <div class="pageContent">
    <v-pagination 
    v-model="pagination.page"
    :length="pagination.pages"
    :total-visible="5"
    :page="pagination.page"
    @input="nextPage"></v-pagination>
    </div>
</template>

<script>
  import employeesApi from "@/modules/employees/employeesApi";
  import employees_table from "@/modules/employees/employeesTable.vue";
  import EmployeesForm from "@/modules/employees/employeesForm.vue";
  import changelogDialog from "@/components/changelogDialog.vue";
  import EmployeesDeleteDialog from "@/components/deleteDialog.vue"
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
      deleteEmployeeId: 0,
      empChangelog: [],
      pagination: {
        page: 1,
        pages: 0,
        itemsPerPage: 10,
      },
    };
  },
  mounted() {
      this.$refs.employees_table.fetchEmployeesPage(
        this.$route.query.page, 
        this.$route.query.sort_type, 
        this.$route.query.order_by
      );
      this.pagination.page = !parseInt(this.$route.query.page) ? this.pagination.page : parseInt(this.$route.query.page)
  },
  watch: {
    "pagination.page": function(value) {
      this.$router.push({path: this.$route.fullPath, query: {
        page: value,
        sort_type: this.$route.query.sort_type,
        order_by: this.$route.query.order_by,
      } })
      this.$refs.employees_table.fetchEmployeesPage(
        value, 
        this.$route.query.sort_type, 
        this.$route.query.order_by
      );
      this.page = value;
    }
  }, 
  methods: {
    nextPage(value){
      this.$router.push({path: this.$route.fullPath, query: {
        page: value,
        sort_type: this.$route.query.sort_type,
        order_by: this.$route.query.order_by,
      } })
      this.$refs.employees_table.fetchEmployeesPage(
        value, 
        this.$route.query.sort_type, 
        this.$route.query.order_by
      );
      this.page = value;
    },
    refreshEmployees() {
      //this.$refs.employees_table.fetchEmployees();
      this.$refs.employees_table.fetchEmployeesPage(
        this.$route.query.page, 
        this.$route.query.sort_type, 
        this.$route.query.order_by
      );
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
        // birth_date: new Date(item.birth_date),
        birth_date: new Date(`${item.birth_date.split('.')[2]}-\
        ${item.birth_date.split('.')[1]}-\
        ${item.birth_date.split('.')[0]}`),
        passport_series: item.passport_series,
        passport_number: item.passport_number,
        passport_code: item.passport_code,
        passport_by: item.passport_by,
        // passport_date: new Date(item.passport_date),
        passport_date: new Date(`${item.passport_date.split('.')[2]}-\
        ${item.passport_date.split('.')[1]}-\
        ${item.passport_date.split('.')[0]}`),
        address: item.address,
        dep_id: item.department_id,
        pos_id: item.position_id,
        salary: parseFloat(item.salary.replace(/[$,]/g, "")),
      };
      this.dialog = true;
    },
    openDetailsDialog(item) {
      this.TableEmployees = { ...item };
      this.detailsDialog = true;
    },
    openDeleteDialog(item) {
      //this.TableEmployees = item;
      this.deleteEmployeeId = item.id
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
    deleteRecord(item_id) {
      employeesApi.deleteEmployee(item_id).then(
        () => this.$refs.employees_table.fetchEmployeesPage(
          this.$route.query.page, 
          this.$route.query.sort_type, 
          this.$route.query.order_by
      )
      )
    },
  },
  };
</script>
