import { useFormik } from "formik"
import { loginValidation } from '../../../schemas/loginValidationSchema'
import { login } from "../../../services/AdminService"
import { useNavigate } from "react-router-dom"
import { useState } from "react"
import { toast, ToastContainer } from "react-toastify"
import Spinner from '../../shared/Loader/Spinner'
import ForgotPassModal from "./helper/ForgotPassModal"

const AdminLogin = () => {

  const navigate = useNavigate()

  const [errMsg, setErrMsg] = useState({state: false, message: ''})
  const [loading, setLoading] = useState(false)

  const loginForm = useFormik({
    validationSchema: loginValidation,
    initialValues: {
      email: '',
      password: ''
    },
    onSubmit: async(formData) => {
      setLoading(true)
      const response = await login(formData)
      if(response.success) {
        setLoading(false)
        localStorage.setItem('ddlj', response.token)
        navigate('/')
      } else {
        if(response.type === 'email') {
          setLoading(false)
          setErrMsg({state: true, message: 'Email is Invalid!'})
          setTimeout(()=>{
            setErrMsg({state: false, message: ''})
          }, 2000)
        } else if(response.type === 'password') {
          setLoading(false)
          setErrMsg({state: true, message: 'Password is Incorrect!'})
          setTimeout(()=>{
            setErrMsg({state: false, message: ''})
          }, 2000)
        } 
      }
    }
  })

  return (
    <>
          <div className="box-cs height-100vh p-0">
        <div className="container-fluid p-0">
            <div className="row m-0">
              <div className="col-md-4 p-0">
                <form className="h-100" onSubmit={loginForm.handleSubmit}>
                  <div className="login-layout h-100 w-100">
                    <div className="flex-cs justify-center w-100">
                        <img src="assets/img/logo.svg" alt="" />
                    </div>
                    
                      {errMsg?.state && (<small className="text-danger">{errMsg?.message}</small>)}
                      {(loginForm?.errors.password && loginForm.touched.password) ? (<small className="text-danger">{loginForm?.errors.password}</small>) : (loginForm?.errors.email && loginForm.touched.email) && (<small className="text-danger">{loginForm?.errors.email}</small>)}
                      <div className="input-section w-90 gtc-1">
                        <input type="email" className="cs-placeholder" required placeholder="Enter Email Address" name="email" id="" onChange={loginForm.handleChange} />
                        <input type="text" placeholder="Enter Password" className="cs-placeholder" name="password" id="" onChange={loginForm.handleChange} />
                        <button type="button" data-bs-toggle='modal' data-bs-target='#forgotPass' className="btn text-primary text-end">Forgot Password</button>
                      </div>
                      <div className=" w-90 flex-cs ">
                        <button type="submit" className="filter-btn w-25 bg-theme-1">Login {loading && <Spinner />}</button>
                      </div>
                    
                  </div>
                </form>
                </div>
                <div className="col-md-8 p-0">
                  <div className="w-100" style={{objectFit: 'cover'}}>
                    <img className="login-img" style={{objectFit: 'cover'}} src="assets/img/login.jpg" alt="" />
                  </div>
                </div>
            </div>
          </div>
        </div>
<ToastContainer />
<ForgotPassModal getEmail={loginForm?.values?.email} />
    </>
  )
}

export default AdminLogin