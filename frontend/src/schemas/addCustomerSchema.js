import * as Yup from 'yup'

const validationSchema = Yup.object({
    cutomerType: Yup.string().required("Choose Customer Type"),
    contactMethod: Yup.string().required("Select Contact Method"),
    personalDetails: Yup.object({
        firstName: Yup.string().required("First Name is required"),
        lastName: Yup.string().required("Last Name is required"),
        email: Yup.string()
        .email("Invalid email address")
        .required("Email is required"),
        phone: Yup.number()
        .typeError("Phone must be a number")
        .required("Phone is required"),
        company: Yup.string().required("Company Name is required")
    })
  })

export { validationSchema }