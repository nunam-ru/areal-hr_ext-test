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
  addOrganization(organization) {
    return api
      .post("/organizations", organization)
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
  updateOrganization(id, organization) {
    return api
      .put(`/organizations/${id}`, organization)
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
  deleteOrganization(id) {
    return api
      .delete(`/organizations/${id}`)
      .then(() => id)
      .catch((err) => {
        if (err.response && err.response.status === 401) {
          window.location.reload();
        }
        throw err;
      });
  },
  getOrgChangelog(id) {
    return api
      .get(`/organizations/changelog/${id}`)
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