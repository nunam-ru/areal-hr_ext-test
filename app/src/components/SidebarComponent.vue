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
export default {
    data() {
        return {
            drawer: true,
            menuItems: [
                { id: 1, 
                    name: 'Организации', 
                    route: '/organizations' },
                { id: 2, 
                    name: 'Отделы', 
                    route: '/departments' },
                { id: 3, 
                    name: 'Должности', 
                    route: '/positions' },
                { id: 4, 
                    name: 'Сотрудники', 
                    route: '/employees' },
                { id: 5, 
                    name: 'Пользователи', 
                    route: '/users' },
                
            ]
        };
    }
};
</script>