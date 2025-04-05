<template>
    <v-dialog
      :model-value="dialog"
      @update:model-value="$emit('update:dialog', $event)"
      max-width="700px"
    >
      <v-card>
        <v-card-title class="headline">{{
          isEditMode ? "Изменить должность" : "Добавить должность"
        }}</v-card-title>
        <v-card-text>
          <v-form ref="form">
            <v-text-field
              v-model="localPosition.position_name"
              label="Название должности"
              :error-messages="errors.name"
              required
            ></v-text-field>
            <v-select
              v-model="localPosition.dep_id"
              :items="departments"
              item-title="department_name"
              item-value="department_id"
              label="Отдел"
              :error-messages="errors.dep_id"
              required
            ></v-select>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-btn color="blue" text @click="closeDialog">Отмена</v-btn>
          <v-btn color="blue" text @click="savePosition">
            {{ isEditMode ? "Сохранить" : "Добавить" }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </template>
  
  <script>
  import PositionApi from "./positionsApi";
  import DepartmentApi from "@/modules/departments/departmentsApi";
  export default {
    props: {
      dialog: {
        type: Boolean,
        required: true,
      },
      isEditMode: {
        type: Boolean,
        required: true,
      },
      TablePosition: {
        type: Object,
        required: true,
      },
    },
    data() {
      return {
        localPosition: { ...this.TablePosition },
        departments: [],
        errors: {},
      };
    },
    watch: {
      TablePosition: {
        handler(newPosition) {
          this.localPosition = { ...newPosition };
        },
        deep: true,
      },
    },
    emits: ["update:dialog", "save"],
    mounted() {
      this.fetchDepartments();
    },
    methods: {
      fetchDepartments() {
        DepartmentApi.getDepartments()
          .then((data) => {
            this.departments = data;
          })
          .catch((err) => {
            console.log(err)
            this.departments = [];
          });
      },
      closeDialog() {
        this.errors = [];
        this.$emit("update:dialog", false);
      },
      savePosition() {
        if (this.isEditMode) this.updatePosition();
        else this.addPosition();
      },
      addPosition() {
        PositionApi.addPosition({
          name: this.localPosition.position_name,
          dep_id: this.localPosition.dep_id,
        })
          .then(() => {
            this.errors = [];
            this.$emit("save");
            this.closeDialog();
            this.localPosition = [];
          })
          .catch((err) => {
            if (err.status == 400) {
              this.errors = err.data.errors;
            } else {
              console.log(err)
            }
          });
      },
      updatePosition() {
        PositionApi.updatePosition(this.localPosition.id, {
          name: this.localPosition.position_name,
          dep_id: this.localPosition.dep_id,
        })
          .then(() => {
            this.errors = [];
            this.$emit("save");
            this.closeDialog();
            this.localPosition = [];
          })
          .catch((err) => {
            if (err.status == 400) {
              this.errors = err.data.errors;
            } else {
              console.log(err)
            }
          });
      },
    },
  };
  </script>
  