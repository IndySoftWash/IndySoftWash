import React, { useEffect, useRef, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import Spinner from "../../shared/Loader/Spinner";
import { updateProfile, uploadProfileImage } from "../../../services/AdminService";
import { useDispatch, useSelector } from 'react-redux'
import { handleUpdateProfile, handleUpdateProfileImage } from "../../../redux/AdminDataSlice";

const Profile = () => {

    const dispatch = useDispatch()
    const imageRef = useRef();

    const [loading, setLoading] = useState(false)
    const [imageUploading, setImageUploading] = useState(false);


    const profileData = useSelector(state => state.AdminDataSlice.admin)

    const formik = useFormik({
        initialValues: {
        firstName: profileData?.firstName || "",
        lastName: "",
        email: "",
        phone: "",
        address: "",
        shirtSize: "",
        },
        validationSchema: Yup.object({
        firstName: Yup.string().required("First Name is required"),
        lastName: Yup.string().required("Last Name is required"),
        email: Yup.string()
            .email("Invalid email format")
            .required("Email is required"),
        phone: Yup.string()
            .matches(/^[0-9]{10}$/, "Phone number must be 10 digits")
            .required("Phone Number is required"),
        address: Yup.string().required("Address is required"),
        shirtSize: Yup.string().required("Please select a shirt size"),
        }),
        onSubmit: async(formData) => {
        console.log("Form Data", formData);
        setLoading(true)
            const response = await updateProfile(formData)
            if(response.success) {
                setLoading(false)
                dispatch(handleUpdateProfile(formData))
                formik.resetForm()
                toast.success('Profile Updated Successfully!')
            }
        },
    });

    const handleImageUpload = async (event) => {
        const file = event.target.files[0];
        if (!file) return;
    
        setImageUploading(true);
        const formData = new FormData();
        formData.append("profileImage", file);
    
        try {
          const response = await uploadProfileImage(formData); // Call upload API
            if (response.success) {
                toast.success("Image uploaded successfully!");
                dispatch(handleUpdateProfileImage({ profileImage: response.profileImage }));
            } else {
                toast.error("Failed to upload image!");
            }
            } catch (error) {
                console.error("Image upload error:", error);
                toast.error("Something went wrong while uploading the image.");
            } finally {
                setImageUploading(false);
            }
    };
    

    useEffect(()=>{
        if(profileData) {
            formik.setValues({
                firstName: profileData?.firstName || "",
                lastName: profileData?.lastName || "",
                email: profileData?.email || "",
                phone: profileData?.phone || "",
                address: profileData?.address || "",
                shirtSize: profileData?.shirtSize || "",
            });

        }
    }, [profileData])

  return (
        <section>
        <div className="container py-4">
            <div className="row">
            <div className="col-md-12">
                <div className="head-filters">
                <div className="part-1">
                    <h4 className="font-1 fw-700">My Profile</h4>
                </div>
                </div>

                <div className="pt-4">
                    <div className="box-cs min-height-600">

                        <div className="admin-profile">
                            <div className="profile-img">
                                <img src={profileData?.profileImage?.s3Url} alt="" />
                                <button className="btn" onClick={()=>imageRef.current?.click()}>{imageUploading ? (<Spinner />) : (<img src="/assets/img/edit-pencil.svg" alt="" />)}</button>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    ref={imageRef}
                                    style={{ display: "none" }}
                                />
                            </div>
                            <div className="profile-content">
                                <h3>{profileData?.firstName} {profileData?.lastName}</h3>
                                <span>Admin</span>
                            </div>
                        </div>

                        <form onSubmit={formik.handleSubmit} className="gtc-1 pt-4 cs-align-end grid-cs">
                        <div className="input-section cs-align-end gtc-3">
                            {/* First Name */}
                            <div>
                            <div className="header">
                                <h5 className="font-1 fw-700 font-size-16">User Information</h5>
                            </div>
                            <div className="mt-2">
                                <input
                                type="text"
                                name="firstName"
                                placeholder="Enter First Name"
                                className="form-control"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.firstName}
                                />
                                {formik.touched.firstName && formik.errors.firstName && (
                                <small className="text-danger">{formik.errors.firstName}</small>
                                )}
                            </div>
                            </div>

                            {/* Last Name */}
                            <div>
                            <div className="">
                                <input
                                type="text"
                                name="lastName"
                                placeholder="Enter Last Name"
                                className="form-control"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.lastName}
                                />
                                {formik.touched.lastName && formik.errors.lastName && (
                                <small className="text-danger">{formik.errors.lastName}</small>
                                )}
                            </div>
                            </div>

                            {/* Email */}
                            <div>                      
                                <div className="">
                                <input
                                type="email"
                                name="email"
                                placeholder="Enter Email"
                                className="form-control"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.email}
                                />
                                {formik.touched.email && formik.errors.email && (
                                <small className="text-danger">{formik.errors.email}</small>
                                )}
                            </div>
                            </div>

                            {/* Phone Number */}
                            <div>
                            <div className="">
                                <input
                                type="text"
                                name="phone"
                                placeholder="Enter Phone Number"
                                className="form-control"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.phone}
                                />
                                {formik.touched.phone && formik.errors.phone && (
                                <small className="text-danger">{formik.errors.phone}</small>
                                )}
                            </div>
                            </div>

                            {/* Address */}
                            <div>                      
                                <div className="">
                                <input
                                type="text"
                                name="address"
                                placeholder="Enter Address"
                                className="form-control"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.address}
                                />
                                {formik.touched.address && formik.errors.address && (
                                <small className="text-danger">{formik.errors.address}</small>
                                )}
                            </div>
                            </div>

                            {/* Shirt Size */}
                            <div>
                            <div className="">
                                <select
                                name="shirtSize"
                                className="width-100"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.shirtSize}
                                >
                                <option value="">Select Shirt Size</option>
                                <option value="S-28">S-28</option>
                                <option value="M-30">M-30</option>
                                <option value="L-32">L-32</option>
                                <option value="XL-42">XL-42</option>
                                </select>
                                {formik.touched.shirtSize && formik.errors.shirtSize && (
                                <small className="text-danger">{formik.errors.shirtSize}</small>
                                )}
                            </div>
                            </div>
                        </div>

                        {/* Buttons */}
                        <div className="buttons mt-4">
                            <button
                            type="submit"
                            className="filter-btn width-max txt-deco-none bg-theme-1"
                            >
                            <i
                                className="fa-light fa-circle-check fa-lg"
                                style={{ color: "#ffffff" }}
                            />
                            &nbsp; Save Information {loading && (<Spinner />)}
                            </button>
                        </div>
                        </form>
                    </div>
                </div>
            </div>
            </div>
        </div>
        </section>
  );
};

export default Profile;
