import { useEffect, useState } from "react";
import { generateUniqueId } from "../../../utils/UniqueIdGenerator";
import { useFormik } from "formik";
import { addEmployeeSchema } from "../../../schemas/addEmployeeSchema";
import { toast } from "react-toastify";
import { addEmployee, editEmployee } from "../../../services/EmployeeService";
import Spinner from "../../shared/Loader/Spinner";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { handleAddEmployee, handleUpdateEmployee } from "../../../redux/EmployeeDataSlice";

const AddEmployees = () => {

  const param = useParams();
  const {id, action} = param;
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const employeeDetail = useSelector((state) => state.EmployeeDataSlice.employees);

  const [loading, setLoading] = useState(false);
  const [profileImage, setProfileImage] = useState(null);

  useEffect(() => {
    if (id) {
      const employee = employeeDetail.find((item) => item.uniqueid === id);
      if (employee) {
        addEmployeeForm.setValues(employee);
        setProfileImage(employee.profileImage.s3Url);
      }
    }
  }, [id, employeeDetail, dispatch]);


  const addEmployeeForm = useFormik({
    initialValues: {
      uniqueid: generateUniqueId(),
      createDate: new Date().toISOString(),
      firstName: "",
      lastName: "",
      address: "",
      email: "",
      phone: "",
      role: "",
      status: "",
      password: "",
      profileImage: null,
    },
    validationSchema: addEmployeeSchema,
    onSubmit: async (values) => {
      setLoading(true);
      const formData = new FormData();
      formData.append("uniqueid", values.uniqueid);
      formData.append("createDate", values.createDate);
      formData.append("firstName", values.firstName);
      formData.append("lastName", values.lastName);
      formData.append("email", values.email);
      formData.append("phone", values.phone);
      formData.append("role", values.role);
      formData.append("status", values.status);
      formData.append("address", values.address);
      formData.append("password", values.password);

      try {
        if (id && action === 'edit') {
          if (profileImage) {
            formData.append("profileImage", profileImage);
          } else {
            formData.append("profileImage", JSON.stringify(values.profileImage));
          }
          const response = await editEmployee(formData);
          if (response.success) {
            toast.success(response.message);
            dispatch(handleUpdateEmployee(response.result));
            navigate('/employees');
          } else {
            toast.error(response.message);
          }
        } else {
          if (profileImage) {
            formData.append("profileImage", profileImage);
          }
          const response = await addEmployee(formData);
          if (response.success) {
            toast.success(response.message);
            dispatch(handleAddEmployee(response.result));
            navigate('/employees');
          } else {
            toast.error(response.message);
          }
        }
      } catch (error) {
        toast.error("An error occurred while processing your request.");
      } finally {
        setLoading(false);
      }
    }
  });

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setProfileImage(file);
    }
  };

  return (
    <>
        <section>
        <div className="container py-4">
          <div className="row">
            <form onSubmit={addEmployeeForm.handleSubmit}>
              <div className="col-md-12">
                
                <div className="head-filters">
                  <div className="part-1">
                    <h4 className="font-1 fw-700">{id ? "Edit Employee" : "Add New Employee"}</h4>
                  </div>
                  <div className="part-1 gtc-equal mob">
                    {!id && (
                      <button
                      type="button"
                      disabled={loading || action === 'view'}
                      className="filter-btn bg-theme-2"
                      onClick={() => addEmployeeForm.resetForm()}
                    >
                      <i
                        className="fa-regular fa-arrows-rotate-reverse fa-lg"
                        style={{ color: "#ffffff" }}
                      />{" "}
                      &nbsp; Reset All Fields
                    </button>
                    )}
                    <button
                      type="submit"
                      disabled={loading || action === 'view'}
                      className={`filter-btn txt-deco-none bg-theme-1 ${action === 'view' ? 'disabled' : ''}`}
                    >
                      {loading ? (
                        <Spinner />
                      ) : (
                        <>
                          <i
                            className="fa-light fa-circle-check fa-lg"
                            style={{ color: "#ffffff" }}
                          /> 
                          &nbsp; {id ? "Update Employee" : "Save Employee"}
                        </>
                      )}
                    </button>
                  </div>
                </div>

                <div className="pt-4">
                  <div className="box-cs">
                  <div className="profile-image-container">
                  <label htmlFor="profileImage" className="profile-image-label">
                    {
                      profileImage ? (
                        <img 
                          src={typeof profileImage === 'string' 
                            ? profileImage 
                            : URL.createObjectURL(profileImage)} 
                          alt="Profile" 
                          className="profile-image" 
                        />
                      ) : 
                      (
                        <div className="default-profile-image">+</div>
                      )
                    }
                  </label>
                  <input
                    type="file"
                    disabled={loading || action === 'view'}
                    id="profileImage"
                    name="profileImage"
                    accept="image/*"
                    className="hide-me"
                    onChange={handleImageChange}
                  />
                  <div className="content">
                    <h4 className="font-1">{addEmployeeForm?.values?.name || "Full Name"}</h4>
                    <p className="font-3">{addEmployeeForm?.values?.role || "Role"}</p>
                  </div>
                </div>
                    <div className="header pt-3">
                      <h5 className="font-1 fw-700 font-size-16">
                        Employee Details :
                      </h5>
                    </div>
                    <div className="input-section gtc-3 my-2">
                      <input disabled={loading || action === 'view'} type="text" name="firstName" placeholder="First Name" value={addEmployeeForm?.values?.firstName} onChange={addEmployeeForm.handleChange} onBlur={addEmployeeForm.handleBlur} id="" className={`${addEmployeeForm.errors.firstName && addEmployeeForm.touched.firstName ? "is-invalid" : ""} ${action === 'view' ? "input-disabled" : ""}`} />
                      <input disabled={loading || action === 'view'} type="text" name="lastName" placeholder="Last Name" value={addEmployeeForm?.values?.lastName} onChange={addEmployeeForm.handleChange} onBlur={addEmployeeForm.handleBlur} id="" className={`${addEmployeeForm.errors.lastName && addEmployeeForm.touched.lastName ? "is-invalid" : ""} ${action === 'view' ? "input-disabled" : ""}`} />
                      <input disabled={loading || action === 'view'} type="email" name="email" placeholder="Email Address" value={addEmployeeForm?.values?.email} onChange={addEmployeeForm.handleChange} onBlur={addEmployeeForm.handleBlur} id="" className={`${addEmployeeForm.errors.email && addEmployeeForm.touched.email ? "is-invalid" : ""} ${action === 'view' ? "input-disabled" : ""}`}   />
                      <input disabled={loading || action === 'view'} type="number" name="phone" placeholder="Phone Number" value={addEmployeeForm?.values?.phone} onChange={(e) => {addEmployeeForm.setFieldValue("phone", e.target.value)}} id="" className={`${addEmployeeForm.errors.phone && addEmployeeForm.touched.phone ? "is-invalid" : ""} ${action === 'view' ? "input-disabled" : ""}`} />
                      {/* <input type="text" name="status" placeholder="Status" value={addEmployeeForm?.values?.status} onChange={(e) => {addEmployeeForm.setFieldValue("status", e.target.value)}} id="" /> */}
                      {
                        !id && (
                          <input disabled={loading || action === 'view'} type="text" name="password" placeholder="Password" value={addEmployeeForm?.values?.password} onChange={(e) => {addEmployeeForm.setFieldValue("password", e.target.value)}} id="" className={`${addEmployeeForm.errors.password && addEmployeeForm.touched.password ? "is-invalid" : ""} ${action === 'view' ? "input-disabled" : ""}`} />
                        )
                      }
                      <select disabled={loading || action === 'view'} name="role" value={addEmployeeForm?.values?.role} onChange={addEmployeeForm.handleChange} onBlur={addEmployeeForm.handleBlur} className={`${addEmployeeForm.errors.role && addEmployeeForm.touched.role ? "is-invalid" : ""} ${action === 'view' ? "input-disabled" : ""}`}>
                        <option value="" label="Select Role" />
                        <option value="employee" label="Employee" />
                        <option value="admin" label="Admin" />
                      </select>
                      <textarea disabled={loading || action === 'view'} name="address" rows={3} id="address" placeholder="Address" value={addEmployeeForm?.values?.address} onChange={addEmployeeForm.handleChange} onBlur={addEmployeeForm.handleBlur} className={`${addEmployeeForm.errors.address && addEmployeeForm.touched.address ? "is-invalid" : ""} ${action === 'view' ? "input-disabled" : ""}`} />
                      {addEmployeeForm.errors.role && <div className="error">{addEmployeeForm.errors.role}</div>}
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </section>
    </>
  )
}

export default AddEmployees