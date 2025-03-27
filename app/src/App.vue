<template>
  <v-app>
    <v-app-bar app color="#abcdef">
      <v-app-bar-title>
        <h3 class="text-h4 white--text">HR</h3>
      </v-app-bar-title>
    </v-app-bar>
    <Sidebar/>
    <v-main app>
      <router-view></router-view>
    </v-main>
  </v-app>
</template>

<script>
  import Sidebar from './components/Sidebar.vue';

  export default{
    components:
    {
      Sidebar
    }
  };
</script>


