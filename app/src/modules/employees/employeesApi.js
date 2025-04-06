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
  addEmployee(employee, files) {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append(`files`, file);
    });

    if (employee.last_name) 
      formData.append("last_name", employee.last_name);
    if (employee.first_name) 
      formData.append("first_name", employee.first_name);
    if (employee.third_name)
      formData.append("third_name", employee.third_name);
    if (employee.birth_date)
      formData.append("birth_date", employee.birth_date);
    if (employee.passport_series)
      formData.append("passport_series", employee.passport_series);
    if (employee.passport_number)
      formData.append("passport_number", employee.passport_number);
    if (employee.passport_code)
      formData.append("passport_code", employee.passport_code);
    if (employee.passport_by)
      formData.append("passport_by", employee.passport_by);
    if (employee.passport_date)
      formData.append("passport_date", employee.passport_date);
    if (employee.address) 
      formData.append("address", employee.address);
    if (employee.dep_id)
      formData.append("dep_id", employee.dep_id);
    if (employee.pos_id)
      formData.append("pos_id", employee.pos_id);
    if (employee.salary) 
      formData.append("salary", employee.salary);

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
    console.log(formData);

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