import api from "@/shared/api/axios";

export default {
  getEmployees() {
    return api
      .get("/employees")
      .then((response) => response.data)
      .catch((err) => {
        if (err.response && err.response.status === 401) {
          window.location.reload();
        }
        throw err;
      });
  },
};