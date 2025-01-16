import * as Yup from 'yup'

const validationSchema = Yup.object({
    name: Yup.string().required("Enater Service Name"),
    type: Yup.string().required("Enater Service Type"),
    description: Yup.string().required("Enater Service Overview"),
})

export {validationSchema}