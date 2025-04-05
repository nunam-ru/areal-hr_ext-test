<template>
    <v-dialog
      :model-value="dialog"
      @update:model-value="$emit('update:dialog', $event)"
      max-width="700px"
    >
      <v-card>
        <v-card-title class="headline">
          {{ isEditMode ? "Изменить организацию" : "Добавить организацию" }}
        </v-card-title>
        <v-card-text>
          <v-form ref="form">
            <v-text-field
              v-model="localOrganization.name"
              label="Название организации"
              :error-messages="errors.name"
              required
            ></v-text-field>
            <v-textarea
              v-model="localOrganization.comment"
              label="Комментарий"
              :error-messages="errors.comment"
              required
            ></v-textarea>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-btn color="blue" text @click="closeDialog">Отмена</v-btn>
          <v-btn color="blue" text @click="saveOrganization">
            {{ isEditMode ? "Сохранить" : "Добавить" }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </template>
  
  <script>
  import OrganizationsApi from "./organizationsApi";
  
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
      organization: {
        type: Object,
        required: true,
      },
    },
    emits: ["update:dialog", "save"],
    data() {
      return {
        localOrganization: { ...this.organization },
        errors: {},
      };
    },
    watch: {
      organization: {
        handler(newOrganization) {
          this.localOrganization = { ...newOrganization };
        },
        deep: true,
      },
    },
    methods: {
      closeDialog() {
        this.errors = [];
        this.$emit("update:dialog", false);
      },
      saveOrganization() {
        if (this.isEditMode) {
          this.updateOrganization();
        } else {
          this.addOrganization();
        }
      },
      addOrganization() {
        OrganizationsApi.addOrganization({
          name: this.localOrganization.name,
          comment: this.localOrganization.comment,
        })
          .then(() => {
            this.errors = [];
            this.$emit("update:dialog", false);
            this.$emit("save");
            })
          .catch((err) => {
            if (err.status == 400) {
              this.errors = err.data.errors;
            } else {
              console.log(err)
            }
          });
      },
      updateOrganization() {
        OrganizationsApi.updateOrganization(this.localOrganization.id, {
          name: this.localOrganization.name,
          comment: this.localOrganization.comment,
        })
          .then(() => {
            this.errors = [];
            this.$emit("update:dialog", false);
            this.$emit("save");
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
  