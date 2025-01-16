import * as Yup from 'yup'

const validationSchema = Yup.object({
    createDate: Yup.date().required('Date is required'),
    customer: Yup.string().required('Customer is required'),
    property: Yup.string().required('Property is required'),
    serviceItem: Yup.string().required('Service Item is required'),
    quantity: Yup.number().required('Quantity is required').positive(),
    sqft: Yup.number().required('Quantity is required').positive(),
  });

  export {validationSchema}