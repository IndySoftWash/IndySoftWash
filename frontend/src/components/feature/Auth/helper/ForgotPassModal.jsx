import { useRef, useState } from "react";
import Spinner from "../../../shared/Loader/Spinner";
import * as Yup from "yup";
import { useFormik } from "formik";
import { sendOTP, verifyOTP, resetPassword } from "../../../../services/AdminService";
import { useNavigate } from "react-router-dom";

const ForgotPassModal = ({ }) => {

    const navigate = useNavigate() 
    const clsModal = useRef()

  const [step, setStep] = useState(1); // Step 1: Email, Step 2: OTP, Step 3: Reset Password
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  
  // Email Step (Step 1) Form Validation
  const emailFormik = useFormik({
    initialValues: { email: "" },
    validationSchema: Yup.object({
      email: Yup.string().email("Invalid email format").required("Email is required"),
    }),
    onSubmit: async (formData) => {
        setEmail(formData?.email)
        localStorage.setItem('suds', formData?.email)
      setLoading(true);
      try {
        const response = await sendOTP(formData); // Send OTP
        if(response.success) {
            setStep(2); // Move to OTP step
            setLoading(false);
        }
      } catch (err) {
        setLoading(false);
        setError("Failed to send OTP. Please try again.");
      }
    },
  });

  // OTP Step (Step 2) Form Validation
  const otpFormik = useFormik({
    initialValues: { otp: "", email: localStorage.getItem('suds') },
    validationSchema: Yup.object({
      otp: Yup.string().required("OTP is required"),
    }),
    onSubmit: async (formData) => {
      setLoading(true);
      try {
        const response = await verifyOTP(formData); // Verify OTP
        if(response.success) {
            setStep(3); // Move to Reset Password step
            setLoading(false);
        }
      } catch (err) {
        setLoading(false);
        setError("Invalid OTP. Please try again.");
      }
    },
  });

  // Reset Password Step (Step 3) Form Validation
  const resetPasswordFormik = useFormik({
    initialValues: { password: "", confirmPassword: "", email: localStorage.getItem('suds') },
    validationSchema: Yup.object({
      password: Yup.string().min(4, "Password must be at least 4 characters").required("Password is required"),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref("password"), null], "Passwords must match")
        .required("Confirm Password is required"),
    }),
    onSubmit: async (formData) => {
      setLoading(true);
      try {
        const response = await resetPassword(formData); // Reset password
        if(response.success) {
            setLoading(false);
            setStep(1); // Reset to initial step
            setEmail("");
            setOtp("");
            setPassword("");
            setConfirmPassword("");
            localStorage.setItem('ddlj', response.token)
            localStorage.removeItem('suds')
            clsModal.current?.click()
            navigate('/')
        }
      } catch (err) {
        setLoading(false);
        setError("Failed to reset password. Please try again.");
      }
    },
  });

  return (
    <>
      <div
        className="modal fade"
        id="forgotPass"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog width-800 modal-dialog-centered">
          <div className="modal-content box-cs">
            <div className="modal-header">
              <h3 className="font-1">Forgot Password</h3>
            </div>

            {/* Progress Bar */}
            {/* <div className="modal-body">
              <div className="progress">
                <div
                  className="progress-bar"
                  role="progressbar"
                  style={{ width: step === 1 ? "33%" : step === 2 ? "66%" : "100%" }}
                  aria-valuenow={step === 1 ? "33" : step === 2 ? "66" : "100"}
                  aria-valuemin="0"
                  aria-valuemax="100"
                ></div>
              </div>
            </div> */}

            {/* Step 1: Email Input */}
            {step === 1 && (
              <div className="modal-body">
                <form onSubmit={emailFormik.handleSubmit}>
                  <div className="form-group">
                    <label htmlFor="email">Enter your Email</label>
                    <input
                      type="email"
                      className="form-control"
                      id="email"
                      placeholder="Email"
                      value={emailFormik.values.email}
                      onChange={emailFormik.handleChange}
                      onBlur={emailFormik.handleBlur}
                    />
                    {emailFormik.touched.email && emailFormik.errors.email && (
                      <div className="text-danger">{emailFormik.errors.email}</div>
                    )}
                  </div>
                  {error && <div className="text-danger">{error}</div>}
                  <div className="modal-footer">
                    <button
                      type="button"
                      className="filter-btn bg-theme-7"
                      data-bs-dismiss="modal"
                      disabled={loading}
                    >
                      Close
                    </button>
                    <button
                      type="submit"
                      className="filter-btn bg-theme-1"
                      disabled={loading || !emailFormik.isValid}
                    >
                      {loading ? <Spinner /> : "Send OTP"}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Step 2: OTP Input */}
            {step === 2 && (
              <div className="modal-body">
                <form onSubmit={otpFormik.handleSubmit}>
                  <div className="form-group">
                    <label htmlFor="otp">Enter OTP</label>
                    <input
                      type="text"
                      className="form-control"
                      id="otp"
                      placeholder="OTP"
                      value={otpFormik.values.otp}
                      onChange={otpFormik.handleChange}
                      onBlur={otpFormik.handleBlur}
                    />
                    {otpFormik.touched.otp && otpFormik.errors.otp && (
                      <div className="text-danger">{otpFormik.errors.otp}</div>
                    )}
                  </div>
                  {error && <div className="text-danger">{error}</div>}
                  <div className="modal-footer">
                    <button
                      type="button"
                      className="filter-btn bg-theme-7"
                      data-bs-dismiss="modal"
                      disabled={loading}
                    >
                      Close
                    </button>
                    <button
                      type="submit"
                      className="filter-btn bg-theme-1"
                      disabled={loading || !otpFormik.isValid}
                    >
                      {loading ? <Spinner /> : "Verify OTP"}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Step 3: Reset Password */}
            {step === 3 && (
              <div className="modal-body">
                <form onSubmit={resetPasswordFormik.handleSubmit}>
                  <div className="form-group">
                    <label htmlFor="password">New Password</label>
                    <input
                      type="password"
                      className="form-control"
                      id="password"
                      placeholder="New Password"
                      value={resetPasswordFormik.values.password}
                      onChange={resetPasswordFormik.handleChange}
                      onBlur={resetPasswordFormik.handleBlur}
                    />
                    {resetPasswordFormik.touched.password && resetPasswordFormik.errors.password && (
                      <div className="text-danger">{resetPasswordFormik.errors.password}</div>
                    )}
                  </div>
                  <div className="form-group">
                    <label htmlFor="confirmPassword">Confirm New Password</label>
                    <input
                      type="password"
                      className="form-control"
                      id="confirmPassword"
                      placeholder="Confirm New Password"
                      value={resetPasswordFormik.values.confirmPassword}
                      onChange={resetPasswordFormik.handleChange}
                      onBlur={resetPasswordFormik.handleBlur}
                    />
                    {resetPasswordFormik.touched.confirmPassword && resetPasswordFormik.errors.confirmPassword && (
                      <div className="text-danger">{resetPasswordFormik.errors.confirmPassword}</div>
                    )}
                  </div>
                  {error && <div className="text-danger">{error}</div>}
                  <div className="modal-footer">
                    <button
                      type="button"
                      className="filter-btn bg-theme-7"
                      data-bs-dismiss="modal"
                      disabled={loading}
                      ref={clsModal}
                    >
                      Close
                    </button>
                    <button
                      type="submit"
                      className="filter-btn bg-theme-1"
                      disabled={loading || !resetPasswordFormik.isValid}
                    >
                      {loading ? <Spinner /> : "Reset Password"}
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ForgotPassModal;
