<template>
  <v-app>
    <Header v-if="isAuthenticated"/>
    <Sidebar v-if="isAuthenticated"/>
    <v-main app > <!--class="pa-4"-->
      <v-container fluid class="d-flex flex-column" style="padding: 0">
        <router-view></router-view>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
  import Sidebar from './components/SidebarComponent.vue';
  import Header from "./components/headerMain.vue";
  import { useAuthStore } from "@/stores/useAuthStore";

  export default{
    components:
    {
      Sidebar,
      Header,
    },
    computed: {
      isAuthenticated() {
        const authStore = useAuthStore();
        return authStore.isAuthenticated;
      },
    },
  };
</script>

<style lang="scss">
@use './styles/style.scss';
</style>

