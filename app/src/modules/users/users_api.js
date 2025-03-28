import api from "@/shared/api/axios";

export default {
  getUsers() {
    return api
      .get("/users")
      .then((response) => response.data)
      .catch((err) => {
        if (err.response && err.response.status === 401) {
          window.location.reload();
        }
        throw err;
      });
  },
};