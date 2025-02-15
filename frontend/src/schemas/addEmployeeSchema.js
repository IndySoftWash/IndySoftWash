import * as Yup from "yup";

export const addEmployeeSchema = Yup.object({
    firstName: Yup.string().required("First Name is required"),
    email: Yup.string().email("Invalid email address").required("Email is required"),
    phone: Yup.string().required("Phone is required"),
    role: Yup.string().required("Role is required"),
    password: Yup.string().required("Password is required"),
  })