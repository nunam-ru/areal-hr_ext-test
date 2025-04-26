<template>
    <v-container class="fill-height">
      <v-row justify="center">
        <v-col cols="12" sm="8" md="6" lg="5">
          <v-card
            class="mx-auto pa-12 pb-8"
            elevation="8"
            max-width="448"
            rounded="lg"
          > 
          <v-card-text>HR-manager: вход в систему</v-card-text>
            <v-card-text v-if="error.message" class="error-message red--text">
              {{ error.message }}
            </v-card-text>
            <v-card-text>
              <v-form ref="form">
                <div class="text-subtitle-1 text-medium-emphasis"></div>
                <v-text-field
                  v-model="localUser.login"
                  density="compact"
                  placeholder="Логин"
                  prepend-inner-icon="mdi-account-outline"
                  variant="outlined"
                  autocomplete="username"
                  :error-messages="error.login"
                />
                <div
                  class="text-subtitle-1 text-medium-emphasis d-flex align-center justify-space-between"
                ></div>
  
                <v-text-field
                  v-model="localUser.password"
                  :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'"
                  :type="visible ? 'text' : 'password'"
                  density="compact"
                  placeholder="Пароль"
                  prepend-inner-icon="mdi-lock-outline"
                  variant="outlined"
                  autocomplete="current-password"
                  @click:append-inner="visible = !visible"
                  :error-messages="error.password"
                />
              </v-form>
            </v-card-text>
  
            <v-btn
              class="mb-8"
              color="blue"
              size="large"
              variant="tonal"
              block
              @click="logIn"
              >Войти</v-btn
            >
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </template>
  
<script>
import authApi from "@/modules/auth/authApi";

export default {
    data() {
        return {
        visible: false,
        localUser: { login: "", password: "" },
        error: {},
        };
    },
    methods: {
        logIn() {
        this.error = {};
        if (!this.localUser.login || !this.localUser.password) {
            if (!this.localUser.login)
            this.error.login = "Введите логин";
            if (!this.localUser.password)
            this.error.password = "Введите пароль";
        } else {
            authApi
            .logIn({ ...this.localUser })
            .then(() => {
                this.error = {};
                this.localUser = {};
            })
            .catch((err) => {
                this.error = { message: err.response.data.message };
            });
        }
        },
    },
};
</script>