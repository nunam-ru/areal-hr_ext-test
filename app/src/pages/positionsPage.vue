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
      :deleteId="deletePositionId"
      @apply-delete="deleteRecord(deletePositionId)"
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
  import PositionsApi from "@/modules/positions/positionsApi";
  import positions_table from "@/modules/positions/positionsTable.vue";
  import PositionForm from "@/modules/positions/positionsForm.vue";
  import PositionDeleteDialog from "@/components/deleteDialog.vue";
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
      pagination: {
        page: 1,
        pages: 0,
        itemsPerPage: 10,
      },
    };
  },
  created() {
    this.getPosPages();
  },
  mounted() {
      this.$refs.positions_table.fetchPositionsPage(this.$route.query.page);
      this.pagination.page = !parseInt(this.$route.query.page) ? this.pagination.page : parseInt(this.$route.query.page)
  },
  watch: {
    "pagination.page": function(value) {
      this.$router.push({path: this.$route.fullPath, query: {page: value} })
      this.$refs.positions_table.fetchPositionsPage(value);
      this.page = value;
    }
  }, 
  methods: {
    getPosPages() {
      PositionsApi.getPosPages().then((data) => {
          this.pagination.pages = Math.ceil(parseInt(data[0]['count']) / this.pagination.itemsPerPage);
          }).catch((err) => {
            console.log(err)
      });
    },
    nextPage(value){
      this.$router.push({path: this.$route.fullPath, query: {page: value} })
      this.$refs.positions_table.fetchPositionsPage(value);
      this.page = value;
    },
    refreshPositions() {
      // this.$refs.positions_table.fetchPositions();
      this.$refs.positions_table.fetchPositionsPage(this.$route.query.page);
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
    deleteRecord(item_id) {
        PositionsApi.deletePosition(item_id).then(
          () => this.$refs.positions_table.fetchPositionsPage(this.$route.query.page)
        )
    },
  },
  };
</script>