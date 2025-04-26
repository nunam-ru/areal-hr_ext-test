import api from "@/shared/api/axios";
import router from "@/router/index";
import { useAuthStore } from "@/stores/useAuthStore";

export default {
  logIn(user) {
    const authStore = useAuthStore();
    return api
      .post("/login", user)
      .then((response) => {
        console.log("Успешный вход:", response.data);
        authStore.authenticateUser();
        if (response.data.user.roleName == "Администратор")
          router.push("/users");
        if (response.data.user.roleName == "Сотрудник")
          router.push("/employees");
      })
      .catch((err) => {
        throw err;
      });
  },
  logOut() {
    return api
      .post("/logout")
      .then((response) => {
        console.log(response.data.message);
        window.location.reload();
      })
      .catch((err) => {
        throw err;
      });
  },
  getUserRole() {
    return api
      .get("/user_role")
      .then((response) => {
        return response.data;
      })
      .catch(() => {});
  },
  getUserFullName() {
    return api
      .get("/user_fullname")
      .then((response) => {
        if (response.data && response.data.fullname) {
          const authStore = useAuthStore();
          authStore.authenticateUser();
          return response.data.fullname;
        } else {
          throw new Error(
            "Expected fullname but got: " + JSON.stringify(response.data)
          );
        }
      })
      .catch(() => {
        window.location.reload();
      });
  },
};
