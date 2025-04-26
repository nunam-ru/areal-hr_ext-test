<template>
    <v-navigation-drawer app v-model="drawer" permanent>
      <v-list>
        <v-list-item
          v-for="item in menuItems"
          :key="item.id"
          :to="item.route"
          router
        >
          <v-list-item-title>{{ item.name }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
  </template>

<script>
import authApi from "@/modules/auth/authApi";

export default {
  data() {
    return {
      drawer: true,
      menuItems: [
        { id: 1, 
          name: 'Организации', 
          route: '/organizations',
          roles: ["Сотрудник", "Администратор"], },
        { id: 2, 
          name: 'Отделы', 
          route: '/departments',
          roles: ["Сотрудник", "Администратор"], },
        { id: 3, 
          name: 'Должности', 
          route: '/positions',
          roles: ["Сотрудник", "Администратор"], },
        { id: 4, 
          name: 'Сотрудники', 
          route: '/employees',
          roles: ["Сотрудник", "Администратор"], },
        { id: 5, 
          name: 'Пользователи', 
          route: '/users',
          roles: ["Администратор"], },   
      ],
      logOutDialog: false,
    };
  },
  async mounted() {
    this.checkUserRole();
  },
  methods: {
    async checkUserRole() {
      const userRole = await authApi.getUserRole();
      this.menuItems = this.menuItems.filter(
        (item) => !item.roles || item.roles.includes(userRole.roleName)
      );
    },
    logOut() {
      this.logOutDialog = true;
    },
  },
};
</script>