import * as Yup from 'yup' 

const validationSchema = Yup.object({
    propertyName: Yup.string().required("Property Name is required"),
    property: Yup.string().required("Property is required"),
    buildings: Yup.string().required("# of Buildings is required"),
    units: Yup.number()
      .typeError("Units must be a number")
      .required("No. Of Units is required"),
    billingAddress: Yup.string().required("Billing Address is required"),
    serviceAddress: Yup.string().required("Service Address is required"),
    note: Yup.string().optional(),
    propertyType: Yup.array().min(1, "Property Type is required"),
    propertyFeatures: Yup.array().min(1, "Select at least one feature"),
  });

export {validationSchema}