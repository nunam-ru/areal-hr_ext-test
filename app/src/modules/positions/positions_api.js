import api from "@/shared/api/axios";

export default {
  getPositions() {
    return api
      .get("/positions")
      .then((response) => response.data)
      .catch((err) => {
        if (err.response && err.response.status === 401) {
          window.location.reload();
        }
        throw err;
      });
  },
};