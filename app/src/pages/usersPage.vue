<template>
  <!-- <HelloWorld /> -->
  <v-toolbar flat>
    <v-toolbar-title>Пользователи</v-toolbar-title>
    <v-btn
      @click="openAddDialog()"
      variant="outlined"
      class="action_button white--text"
      >Добавить</v-btn>
  </v-toolbar>

  <users_table
    ref="users_table"
    @edit="openEditDialog"
    @updateRole="openUpdateRoleDialog"
    @delete="openDeleteDialog"
    @reset="openResetPasswordDialog"
    @changelog="fetchUsrChangelog"
  />

  <UsersForm
    :dialog="dialog"
    :isAddMode="isAddMode"
    :isEditMode="isEditMode"
    :TableUsers="TableUsers"
    :resetPassword="resetPassword"
    @update:dialog="dialog = $event"
    @save="refreshUsers"
  />

  <UsersDeleteDialog
    :deleteDialog="deleteDialog"
    :deleteId="deleteUserId"
    @apply-delete="deleteRecord(deleteUserId)"
    @update:deleteDialog="deleteDialog = $event"
    @delete="refreshUsers"
  />

  <UsersUpdateRoleDialog
    :updateRoleDialog="updateRoleDialog"
    :TableUsers="TableUsers"
    @update:updateRoleDialog="updateRoleDialog = $event"
    @save="refreshUsers"
  />

  <changelogDialog
    :changelogDialog="changelogDialog"
    :changelog="usrChangelog"
    @update:changelogDialog="changelogDialog = $event"
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
  //import employees_api from "@/modules/employees/employees_api";
  import UsersApi from "@/modules/users/usersApi";
  import users_table from "@/modules/users/usersTable.vue";
  import UsersForm from "@/modules/users/usersForm.vue";
  import UsersDeleteDialog from "@/components/deleteDialog.vue";
  import UsersUpdateRoleDialog from "@/modules/users/usersUpdRole.vue";
  import changelogDialog from "@/components/changelogDialog.vue";


  export default {
  components: {
    users_table,
    UsersForm,
    UsersDeleteDialog,
    UsersUpdateRoleDialog,
    changelogDialog
  },
  data() {
    return {
      dialog: false,
      isAddMode: false,
      isEditMode: false,
      deleteDialog: false,
      changelogDialog: false,
      updateRoleDialog: false,
      resetPassword: false,
      deleteUserId: 0,
      TableUsers: {
        id: null,
        last_name: "",
        first_name: "",
        third_name: "",
        login: "",
        password: "",
      },
      usrChangelog: [],
      pagination: {
        page: 1,
        pages: 0,
        itemsPerPage: 10,
      },
    };
  },
  mounted() {
      this.$refs.users_table.fetchUsersPage(
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
      this.$refs.users_table.fetchUsersPage(
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
      this.$refs.users_table.fetchUsersPage(
        value, 
        this.$route.query.sort_type, 
        this.$route.query.order_by
      );
      this.page = value;
    },
    refreshUsers() {
      //this.$refs.users_table.fetchUsers();
      this.$refs.users_table.fetchUsersPage(
        this.$route.query.page, 
        this.$route.query.sort_type, 
        this.$route.query.order_by
      );
    },
    openAddDialog() {
      this.resetPassword = false;
      this.isEditMode = false;
      this.isAddMode = true;
      this.TableUsers = {
        id: null,
        last_name: "",
        first_name: "",
        third_name: "",
        login: "",
        password: "",
      };
      this.dialog = true;
    },
    openEditDialog(item) {
      this.resetPassword = false;
      this.isAddMode = false;
      this.isEditMode = true;
      this.TableUsers = { ...item };
      this.dialog = true;
    },
    openDeleteDialog(item) {
      // this.TableUsers = item;
      this.deleteUserId = item.id
      this.deleteDialog = true;
    },
    openResetPasswordDialog(item) {
      this.TableUsers = item;
      delete this.TableUsers.password;
      this.isAddMode = false;
      this.isEditMode = false;
      this.resetPassword = true;
      this.dialog = true;
    },
    openUpdateRoleDialog(item) {
      this.TableUsers = item;
      this.updateRoleDialog = true;
    },
    fetchUsrChangelog(item) {
      UsersApi
        .getUsrChangelog(item.id)
        .then((data) => {
          this.usrChangelog = data;
          this.changelogDialog = true;
        })
        .catch((err) => {
          console.log(err);
          this.usrChangelog = [];
        });
    },
    deleteRecord(item_id) {
      UsersApi.deleteUser(item_id).then(
          () => this.$refs.users_table.fetchUsersPage(
            this.$route.query.page, 
            this.$route.query.sort_type, 
            this.$route.query.order_by
          )
        )
    },
  },
  };
</script>