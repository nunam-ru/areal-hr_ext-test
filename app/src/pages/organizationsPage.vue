<template>
  <!-- <HelloWorld /> -->
  <v-container fluid class="d-flex flex-column" style="padding: 0">
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
      :deleteOrganizationId="deleteOrganizationId"
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

  </v-container>
</template>

<script>
  import OrganizationsApi from "@/modules/organizations/organizationsApi";
  import organizations_table from "@/modules/organizations/organizationsTable.vue";
  import OrganizationForm from "@/modules/organizations/organizationsForm.vue";
  import OrganizationDeleteDialog from "@/modules/organizations/organizationsDelete.vue";
  import changelogDialog from "@/components/changelogDialog.vue";
  
  export default {
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
    };
  },
  methods: {
    refreshOrganizations() {
      this.$refs.organizations_table.fetchOrganizations();
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
  },
  };
</script>