<template>
  <!-- <HelloWorld /> -->
  <v-toolbar flat>
    <v-toolbar-title>Организации</v-toolbar-title>
    <v-btn
      @click="openAddDialog"
      variant="outlined"
      class="action_button white--text"
    >
      Добавить
    </v-btn>
  </v-toolbar>

  <OrganizationForm
    :dialog="dialog"
    :isEditMode="isEditMode"
    :organization="TableOrganization"
    @update:dialog="dialog = $event"
    @save="refreshOrganizations"
  />

  <OrganizationDeleteDialog
    :deleteDialog="deleteDialog"
    :deleteId="deleteOrganizationId"
    @apply-delete="deleteRecord(deleteOrganizationId)"
    @update:deleteDialog="deleteDialog = $event"
    @delete="refreshOrganizations"
  />

  <changelogDialog
    :changelogDialog="changelogDialog"
    :changelog="orgChangelog"
    @update:changelogDialog="changelogDialog = $event"
  />
  
  <organizations_table 
    ref="organizations_table"
    @edit="openEditDialog"
    @delete="openDeleteDialog" 
    @changelog="fetchOrgChangelog"
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
  import OrganizationsApi from "@/modules/organizations/organizationsApi";
  import organizations_table from "@/modules/organizations/organizationsTable.vue";
  import OrganizationForm from "@/modules/organizations/organizationsForm.vue";
  //import OrganizationDeleteDialog from "@/modules/organizations/organizationsDelete.vue";
  import changelogDialog from "@/components/changelogDialog.vue";
  import OrganizationDeleteDialog from "@/components/deleteDialog.vue";
  
  export default {
  inheritAttrs: false,
  components: {
    organizations_table,
    OrganizationForm,
    OrganizationDeleteDialog,
    changelogDialog,
  },
  data() {
    return {
      dialog: false,
      isEditMode: false,
      deleteDialog: false,
      changelogDialog: false,
      deleteOrganizationId: 0,
      TableOrganization: {
        id: null,
        name: "",
        comment: "",
      },
      organizations: [],
      orgChangelog: [],
      pagination: {
        page: 1,
        pages: 0,
        itemsPerPage: 10,
      },
    }; 
  },
  created() {
    this.getOrgPages();
  },
  mounted() {
      this.$refs.organizations_table.fetchOrganizationsPage(
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
      this.$refs.organizations_table.fetchOrganizationsPage(
        value, 
        this.$route.query.sort_type, 
        this.$route.query.order_by
      );
      this.page = value;
    }
  }, 
  methods: {
    getOrgPages() {
      OrganizationsApi.getOrgPages().then((data) => {
          this.pagination.pages = Math.ceil(parseInt(data[0]['count']) / this.pagination.itemsPerPage);
          }).catch((err) => {
            console.log(err)
      });
    },
    nextPage(value){
      this.$router.push({path: this.$route.fullPath, query: {
        page: value,
        sort_type: this.$route.query.sort_type,
        order_by: this.$route.query.order_by,
      } })
      this.$refs.organizations_table.fetchOrganizationsPage(
        value, 
        this.$route.query.sort_type, 
        this.$route.query.order_by
      );
      this.page = value;
    },
    refreshOrganizations() {
      this.$refs.organizations_table.fetchOrganizationsPage(
        this.$route.query.page, 
        this.$route.query.sort_type, 
        this.$route.query.order_by
      );
    },
    openAddDialog() {
      this.isEditMode = false;
      this.TableOrganization = [];
      this.dialog = true;
    },
    openEditDialog(item) {
      this.isEditMode = true;
      this.TableOrganization = { ...item };
      this.dialog = true;
    },
    openDeleteDialog(id) {
      this.deleteOrganizationId = id;
      this.deleteDialog = true;
    },
    fetchOrgChangelog(item) {
      OrganizationsApi.getOrgChangelog(item.id)
        .then((data) => {
          this.orgChangelog = data;
          this.changelogDialog = true;
        })
        .catch((err) => {
          console.log(err);
          this.orgChangelog = [];
        });
    },
    deleteRecord(item_id) {
        OrganizationsApi.deleteOrganization(item_id).then(
          () => this.$refs.organizations_table.fetchOrganizationsPage(
            this.$route.query.page, 
            this.$route.query.sort_type, 
            this.$route.query.order_by
          )
        )
    },
    
  },
  };
</script>