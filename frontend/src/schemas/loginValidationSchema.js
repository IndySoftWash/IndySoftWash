import * as Yup from 'yup'


const loginValidation = Yup.object({
    email: Yup.string().required('Enter Email Address'),
    password: Yup.string().required('Enter Password'),
})

export {loginValidation}