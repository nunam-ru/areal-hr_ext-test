<template>
  <!-- <HelloWorld /> -->
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
    :deleteId="deleteDepartmentId"
    @apply-delete="deleteRecord(deleteDepartmentId)"
    @update:deleteDialog="deleteDialog = $event"
    @delete="refreshDepartments"
  />

  <changelogDialog
    :changelogDialog="changelogDialog"
    :changelog="depChangelog"
    @update:changelogDialog="changelogDialog = $event"
  />

  <departmentsTable ref="departmentsTable"
    @edit="openEditDialog"
    @delete="openDeleteDialog"
    @updateDepartments="handleUpdateDepartments"
    @changelog="fetchDepChangelog"
  />
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
  import DepartmentsApi from "@/modules/departments/departmentsApi";
  import departmentsTable from "@/modules/departments/departmentsTable.vue";
  import DepartmentForm from "@/modules/departments/departmentsForm.vue";
  import DepartmentDeleteDialog from "@/components/deleteDialog.vue";
  import changelogDialog from "@/components/changelogDialog.vue";

  export default {
  components: {
    DepartmentForm,
    DepartmentDeleteDialog,
    departmentsTable,
    changelogDialog,
  },
  data() {
    return {
      dialog: false,
      deleteDialog: false,
      changelogDialog: false,
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
      depChangelog: [],
      isAddMode: false,
      pagination: {
        page: 1,
        pages: 0,
        itemsPerPage: 10,
      },
    };
  },
  mounted() {
      this.$refs.departmentsTable.fetchDepartmentsPage(
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
      this.$refs.departmentsTable.fetchDepartmentsPage(
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
      this.$refs.departmentsTable.fetchDepartmentsPage(
        value, 
        this.$route.query.sort_type, 
        this.$route.query.order_by
      );
      this.page = value;
    },
    handleUpdateDepartments(departments) {
      this.departments = departments;
    },
    refreshDepartments() {
      //this.$refs.departmentsTable.fetchDepartments();
      this.$refs.departmentsTable.fetchDepartmentsPage(
        this.$route.query.page, 
        this.$route.query.sort_type, 
        this.$route.query.order_by);
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
      this.isSubDepartmentMode = !!department.parent_name;
      this.TableDepartment = { ...department };
      this.dialog = true;
    },
    openDeleteDialog(id) {
      this.deleteDepartmentId = id;
      this.deleteDialog = true;
    },
    fetchDepChangelog(item) {
      DepartmentsApi.getDepChangelog(item.department_id)
        .then((data) => {
          this.depChangelog = data;
          this.changelogDialog = true;
        })
        .catch((err) => {
          console.log(err);
          this.depChangelog = [];
        });
    },
    deleteRecord(item_id) {
      DepartmentsApi.deleteDepartment(item_id).then(
        () => this.$refs.departmentsTable.fetchDepartmentsPage(
          this.$route.query.page, 
          this.$route.query.sort_type, 
          this.$route.query.order_by
      )
      )
    },
  },
  };
</script>
