import api from "@/shared/api/axios";

export default {
  getDepartments() {
    return api
      .get("/departments")
      .then((response) => response.data)
      .catch((err) => {
        if (err.response && err.response.status === 401) {
          window.location.reload();
        }
        throw err;
      });
  },
};