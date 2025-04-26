import { defineStore } from "pinia";

export const useAuthStore = defineStore("authStore", {
  state: () => ({
    isAuthenticated: false,
  }),
  actions: {
    authenticateUser() {
      this.isAuthenticated = true;
    },
    disableAuthentication() {
      this.isAuthenticated = false;
    },
  },
});
