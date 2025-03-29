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

    <organizations_table 
      ref="organizations_table"
      @edit="openEditDialog"
      @delete="openDeleteDialog" 
    />

  </v-container>
</template>

<script>
  import organizations_api from "@/modules/departments/departments_api";
  import organizations_table from "@/modules/organizations/organizations_table.vue";
  import OrganizationForm from "@/modules/organizations/organizations_form.vue";
  import OrganizationDeleteDialog from "@/modules/organizations/organizations_delete.vue";
  
  export default {
  components: {
    organizations_table,
    OrganizationForm,
    OrganizationDeleteDialog,
  },
  data() {
    return {
      dialog: false,
      isEditMode: false,
      deleteDialog: false,
      deleteOrganizationId: 0,
      TableOrganization: {
        id: null,
        name: "",
        comment: "",
      },
      organizations: [],
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
  },
  };
</script>