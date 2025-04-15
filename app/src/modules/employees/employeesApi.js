import api from "@/shared/api/axios";

export default {
  getEmpPages() {
    return api
      .get("/employees/pages")
      .then((response) => response.data)
      .catch((err) => {
        if (err.response && err.response.status === 401) {
          window.location.reload();
        }
        throw err;
      });
  },
  getEmployees(pageID) {
    return api
      .get("/employees", {params: {page: pageID}})
      .then((response) => response.data)
      .catch((err) => {
        if (err.response && err.response.status === 401) {
          window.location.reload();
        }
        throw err;
      });
  },
  addEmployee(employee, files) {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append(`files`, file);
    });

    for (let el in employee) {
      if (['department_name', 'position_name', 'id'].includes(el)) {
        continue
      }
      if (el != null || ''){
        formData.append(el, employee[el]);
      }
    }
    
    return api
      .post("/employees", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
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
  updateEmployee(id, employee) {
    delete employee.id;
    return api
      .put(`/employees/${id}`, employee)
      .then(() => id)
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
  deleteEmployee(id) {
    return api
      .post(`/employees/${id}`)
      .then(() => id)
      .catch((err) => {
        if (err.response && err.response.status === 401) {
          window.location.reload();
        }
        throw err;
      });
  },
  getEmpChangelog(id) {
    return api
      .get(`/employees/changelog/${id}`)
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
  },
  getEmployeeFiles(employeeId) {
    return api
      .get(`/files/${employeeId}`)
      .then((response) => response.data)
      .catch((err) => {
        if (err.response && err.response.status === 401) {
          window.location.reload();
        }
        throw err;
      });
  },
  uploadEmployeeFile(Employee, file) {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("last_name", Employee.last_name);
    formData.append("first_name", Employee.first_name);
    formData.append("third_name", Employee.third_name);

    return api
      .post(`/files/${Employee.id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => response.data)
      .catch((err) => {
        if (err.response && err.response.status === 401) {
          window.location.reload();
        }
        throw err;
      });
  },
  deleteEmployeeFile(fileId, filepath) {
    return api
      .delete(`/files/${fileId}`, {
        params: { filepath },
      })
      .then(() => fileId)
      .catch((err) => {
        if (err.response && err.response.status === 401) {
          window.location.reload();
        }
        throw err;
      });
  },
  downloadFile(fileId) {
    return api.get(`/files/download/${fileId}`, {
      responseType: "blob",
    });
  },
};