import api from "@/shared/api/axios";

export default {
  getDepPages() {
    return api
      .get("/departments/pages")
      .then((response) => response.data)
      .catch((err) => {
        if (err.response && err.response.status === 401) {
          window.location.reload();
        }
        throw err;
      });
  },
  getDepartments(pageID) {
    return api
      .get("/departments", {params: {page: pageID}})
      .then((response) => response.data)
      .catch((err) => {
        if (err.response && err.response.status === 401) {
          window.location.reload();
        }
        throw err;
      });
  },
  addDepartment(department) {
    return api
      .post("/departments", department)
      .then((response) => response.data)
      .catch((err) => {
        if (err.response && err.response.status === 401) {
          window.location.reload();
        }
        if (err.response && err.response.status === 400) {
          throw err.response;
        }
        throw err;
      });
  },
  updateDepartment(id, department) {
    return api
      .put(`/departments/${id}`, department)
      .then((response) => response.data)
      .catch((err) => {
        if (err.response && err.response.status === 401) {
          window.location.reload();
        }
        if (err.response && err.response.status === 400) {
          throw err.response;
        }
        throw err;
      });
  },
  deleteDepartment(id) {
    return api
      .delete(`/departments/${id}`)
      .then(() => id)
      .catch((err) => {
        if (err.response && err.response.status === 401) {
          window.location.reload();
        }
        throw err;
      });
  },
  getDepChangelog(id) {
      return api
        .get(`/departments/changelog/${id}`)
        .then((response) => {
          if (Array.isArray(response.data)) {
            return response.data;
          } else {
            throw new Error("err: " + response.data);
          }
        })
        .catch((err) => {
          if (err.response && err.response.status === 401) {
            window.location.reload();
          }
          throw err;
        });
    }
};