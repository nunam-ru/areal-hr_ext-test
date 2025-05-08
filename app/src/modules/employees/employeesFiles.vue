<template>
    <v-dialog
      :model-value="filesDialog"
      @update:model-value="$emit('update:filesDialog', $event)"
      max-width="600px"
    >
      <v-card>
        <v-card-title class="text-h5 bg-primary">
          <span class="white--text">Файлы сотрудника</span>
        </v-card-title>
  
        <v-card-text class="pt-4">
          <div v-if="employeeFiles.length > 0">
            <v-list>
              <v-list-item v-for="file in employeeFiles" :key="file.file_id">
                <div class="d-flex align-center justify-space-between">
                  <v-list-item-title class="text-subtitle-1">
                    {{ file.file_name }}
                  </v-list-item-title>
                  <div class="d-flex align-center">
                    <v-btn
                      icon
                      small
                      color="error"
                      @click="deleteFile(file)"
                      class="mr-2"
                    >
                      <v-icon>mdi-delete</v-icon>
                    </v-btn>
                    <v-btn icon small @click="downloadFile(file)">
                      <v-icon>mdi-download</v-icon>
                    </v-btn>
                  </div>
                </div>
              </v-list-item>
            </v-list>
          </div>
          <v-alert v-else type="info" text class="mb-4">
            У сотрудника пока нет загруженных файлов
          </v-alert>
          <v-file-input
            v-model="newFile"
            show-size
            truncate-length="25"
            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
            label="Выберите файл для загрузки"
            prepend-icon="mdi-paperclip"
            @change="uploadFile"
            class="mt-2"
          >
          </v-file-input>
        </v-card-text>
  
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="closeDialog"> Закрыть </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </template>
  
  <script>
  import EmployeesApi from "./employeesApi";
  
  export default {
    props: {
      filesDialog: {
        type: Boolean,
        required: true,
      },
      TableEmployees: {
        type: Object,
        required: true,
      },
    },
    data() {
      return {
        newFile: null,
        employeeFiles: [],
      };
    },
    emits: ["update:filesDialog"],
    watch: {
      filesDialog(newVal) {
        if (newVal) {
          this.fetchEmployeeFiles();
        }
      },
    },
    methods: {
      closeDialog() {
        this.$emit("update:filesDialog", false);
      },
      fetchEmployeeFiles() {
        EmployeesApi.getEmployeeFiles(this.TableEmployees.id)
          .then((data) => {
            this.employeeFiles = data;
          })
          .catch((err) => {
            console.log(err)
          });
      },
      uploadFile() {
        EmployeesApi.uploadEmployeeFile(this.TableEmployees, this.newFile)
          .then(() => {
            this.fetchEmployeeFiles();
            this.newFile = null;
          })
          .catch((err) => {
            console.log(err)
          });
      },
      deleteFile(file) {
        EmployeesApi.deleteEmployeeFile(file.file_id, file.filepath)
          .then(() => {
            this.fetchEmployeeFiles();
          })
          .catch((err) => {
            console.log(err)
          });
      },
      downloadFile(file) {
        EmployeesApi.downloadFile(file.file_id)
          .then((response) => {
            console.log(response)
            const blob = new Blob([response.data], {type: response.data.type});
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", file.file_name);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
          })
          .catch((err) => {
            console.log(err)
          });
      },
    },
  };
  </script>
  