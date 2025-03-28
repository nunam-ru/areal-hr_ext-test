import api from "@/shared/api/axios";

export default {
  getOrganizations() {
    return api
      .get("/organizations")
      .then((response) => response.data)
      .catch((err) => {
        if (err.response && err.response.status === 401) {
          window.location.reload();
        }
        throw err;
      });
  },
};