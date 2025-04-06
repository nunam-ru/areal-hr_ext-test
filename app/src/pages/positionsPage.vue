<template>
  <!-- <HelloWorld /> -->
  <v-container fluid class="d-flex flex-column" style="padding: 0">
    <v-toolbar flat>
      <v-toolbar-title>Должности</v-toolbar-title>

      <v-btn
        @click="openAddDialog()"
        variant="outlined"
        class="action_button white--text"
      >Добавить</v-btn>
    </v-toolbar>

    <PositionForm
      :dialog="dialog"
      :isEditMode="isEditMode"
      :TablePosition="TablePosition"
      @update:dialog="dialog = $event"
      @save="refreshPositions"
    />

    <PositionDeleteDialog
      :deleteDialog="deleteDialog"
      :deletePositionId="deletePositionId"
      @update:deleteDialog="deleteDialog = $event"
      @delete="refreshPositions"
    />

    <changelogDialog
      :changelogDialog="changelogDialog"
      :changelog="posChangelog"
      @update:changelogDialog="changelogDialog = $event"
    />

    <positions_table ref="positions_table"
      @edit="openEditDialog"
      @delete="openDeleteDialog" 
      @changelog="fetchPosChangelog"
    />

  </v-container>
</template>

<script>
  import PositionsApi from "@/modules/positions/positionsApi";
  import positions_table from "@/modules/positions/positionsTable.vue";
  import PositionForm from "@/modules/positions/positionsForm.vue";
  import PositionDeleteDialog from "@/modules/positions/positionsDelete.vue";
  import changelogDialog from "@/components/changelogDialog.vue";

  export default {
  components: {
    positions_table,
    PositionForm,
    PositionDeleteDialog,
    changelogDialog,
  },
  data() {
    return {
      dialog: false,
      isEditMode: false,
      deleteDialog: false,
      changelogDialog: false,
      deletePositionId: 0,
      TablePosition: {
        id: null,
        position_name: "",
        dep_id: null,
      },
      posChangelog: [],
    };
  },
  methods: {
    refreshPositions() {
      this.$refs.positions_table.fetchPositions();
    },
    openAddDialog() {
      this.TablePosition = [];
      this.isEditMode = false;
      this.dialog = true;
    },
    openEditDialog(item) {
      this.isEditMode = true;
      this.TablePosition = { ...item };
      this.dialog = true;
    },
    openDeleteDialog(id) {
      this.deletePositionId = id;
      this.deleteDialog = true;
    },
    fetchPosChangelog(item) {
      PositionsApi.getPosChangelog(item.id)
        .then((data) => {
          this.posChangelog = data;
          this.changelogDialog = true;
        })
        .catch((err) => {
          console.log(err);
          this.posChangelog = [];
        });
    },
  },
  };
</script>