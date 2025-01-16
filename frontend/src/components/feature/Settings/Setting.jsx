import React, { useState } from "react";
import { changePassword } from "../../../services/AdminService";
import { toast } from "react-toastify";
import Spinner from '../../shared/Loader/Spinner'


const Setting = () => {
  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState({
    oldPassword: false,
    newPassword: false,
    confirmPassword: false,
  });

  // Handle Input Changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Validate Fields
  const validate = () => {
    const errors = {};

    if (!formData.oldPassword) errors.oldPassword = "Old password is required.";
    if (!formData.newPassword) {
      errors.newPassword = "New password is required.";
    } else if (formData.newPassword.length < 1) {
      errors.newPassword = "Password must be at least 8 characters.";
    }

    if (!formData.confirmPassword) {
      errors.confirmPassword = "Please confirm your new password.";
    } else if (formData.confirmPassword !== formData.newPassword) {
      errors.confirmPassword = "Passwords do not match.";
    }

    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle Submit
  const handleSubmit = async(e) => {
    e.preventDefault();
    if (validate()) {
        setLoading(true)
        const response = await changePassword(formData)
        console.log(response)
        if(response.success) {
            setLoading(false)
            setFormData({
                oldPassword: "",
                newPassword: "",
                confirmPassword: "",
            })
            toast.success('Password Changed Successfully!')
        } else {
            setLoading(false)
            toast.success('Old Password is Incorrect')
        }
      // Add API call or further logic here
    }
  };

  // Toggle Password Visibility
  const togglePasswordVisibility = (field) => {
    setShowPassword({
      ...showPassword,
      [field]: !showPassword[field],
    });
  };

  return (
    <>
        <section>
            <div className="container py-4">
                <div className="row">
                    <div className="col-md-12">
                        <div className="head-filters">
                            <div className="part-1">
                            <h4 className="font-1 fw-700">Settings</h4>
                            </div>
                            <div className="part-1 gtc-1 mob">
                            <button
                                type="button"
                                className="filter-btn bg-theme-2"
                                onClick={() => setFormData({
                                oldPassword: "",
                                newPassword: "",
                                confirmPassword: "",
                                })}
                            >
                                <i
                                className="fa-regular fa-arrows-rotate-reverse fa-lg"
                                style={{ color: "#ffffff" }}
                                />
                                &nbsp; Reset All Fields
                            </button>
                            </div>
                        </div>

                        <div className="pt-4">
                            <div className="box-cs min-height-600">
                                <div className="gtc-1 cs-align-end grid-cs">
                                    <div className="grid-cs cs-align-end gtc-3">
                                        <div>
                                            <div className="header">
                                            <h5 className="font-1 fw-700 font-size-16">Security</h5>
                                            </div>
                                            <div className="grid-cs gtc-1 my-2">
                                            <div className="input-container-box">
                                                <input
                                                type={showPassword.oldPassword ? "text" : "password"}
                                                placeholder="Enter Old Password"
                                                className="width-100"
                                                name="oldPassword"
                                                value={formData.oldPassword}
                                                onChange={handleChange}
                                                />
                                                <i
                                                className={`fa ${showPassword.oldPassword ? "fa-eye-slash" : "fa-eye"}`}
                                                onClick={() => togglePasswordVisibility("oldPassword")}
                                                ></i>
                                            </div>
                                            {errors.oldPassword && <small className="text-danger">{errors.oldPassword}</small>}
                                            </div>
                                        </div>

                                        <div>
                                            <div className="grid-cs gtc-1 my-2">
                                            <div className="input-container-box">
                                                <input
                                                type={showPassword.newPassword ? "text" : "password"}
                                                placeholder="Enter New Password"
                                                className="width-100"
                                                name="newPassword"
                                                value={formData.newPassword}
                                                onChange={handleChange}
                                                />
                                                <i
                                                className={`fa ${showPassword.newPassword ? "fa-eye-slash" : "fa-eye"}`}
                                                onClick={() => togglePasswordVisibility("newPassword")}
                                                ></i>
                                            </div>
                                            {errors.newPassword && <small className="text-danger">{errors.newPassword}</small>}
                                            </div>
                                        </div>

                                        <div>
                                            <div className="grid-cs gtc-1 my-2">
                                            <div className="input-container-box">
                                                <input
                                                type={showPassword.confirmPassword ? "text" : "password"}
                                                placeholder="Confirm New Password"
                                                className="width-100"
                                                name="confirmPassword"
                                                value={formData.confirmPassword}
                                                onChange={handleChange}
                                                />
                                                <i
                                                className={`fa ${showPassword.confirmPassword ? "fa-eye-slash" : "fa-eye"}`}
                                                onClick={() => togglePasswordVisibility("confirmPassword")}
                                                ></i>
                                            </div>
                                            {errors.confirmPassword && <small className="text-danger">{errors.confirmPassword}</small>}
                                            </div>
                                        </div>
                                    </div>
                                    <button
                                    type="submit"
                                    className="filter-btn width-max txt-deco-none bg-theme-1"
                                    onClick={handleSubmit}
                                    >
                                    <i
                                        className="fa-light fa-circle-check fa-lg"
                                        style={{ color: "#ffffff" }}
                                    />
                                    &nbsp; Save Password {loading && (<Spinner />)}
                                    </button>
                                </div>
                                <div className="pt-4">
                                    <div className="grid-cs cs-align-end gtc-3">
                                        <div>
                                            <div className="header">
                                                <h5 className="font-1 fw-700 font-size-16">Integrations</h5>
                                            </div>
                                            <div className="grid-cs gtc-1 my-2">
                                                <div className="input-section gtc-1">
                                                    <input
                                                    type='text'
                                                    className='input-disabled'
                                                    placeholder="Coming Soon...."
                                                    name="integration"
                                                    // value={formData.oldPassword}
                                                    // onChange={handleChange}
                                                    />
                                                </div>
                                            </div>

                                            <div className="header mt-4">
                                            <h5 className="font-1 fw-700 font-size-16">Billing & Payments</h5>
                                            </div>
                                            <div className="grid-cs gtc-1 my-2">
                                            <div className="input-section gtc-1">
                                                <input
                                                type='text'
                                                className='input-disabled'
                                                placeholder="Coming Soon...."
                                                name="integration"
                                                // value={formData.oldPassword}
                                                // onChange={handleChange}
                                                />
                                            </div>
                                            </div>
                                        </div>

                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </section>
    </>
  );
};

export default Setting;
