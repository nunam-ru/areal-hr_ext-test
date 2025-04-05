import { createRouter, createWebHistory } from "vue-router";
import Employees from "../pages/employeesPage.vue";
import Departments from "../pages/departmentsPage.vue";
import Organizations from "../pages/organizationsPage.vue";
import Positions from "../pages/positionsPage.vue";
import Users from "../pages/usersPage.vue";

const routes = [
  { path: "/employees", component: Employees },
  { path: "/departments", component: Departments },
  { path: "/organizations", component: Organizations },
  { path: "/positions", component: Positions },
  { path: "/users", component: Users },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.onError((err, to) => {
  if (err?.message?.includes?.('Failed to fetch dynamically imported module')) {
    if (!localStorage.getItem('vuetify:dynamic-reload')) {
      console.log('Reloading page to fix dynamic import error')
      localStorage.setItem('vuetify:dynamic-reload', 'true')
      location.assign(to.fullPath)
    } else {
      console.error('Dynamic import error, reloading page did not fix it', err)
    }
  } else {
    console.error(err)
  }
})

router.isReady().then(() => {
    localStorage.removeItem('vuetify:dynamic-reload')
  })

export default router;
