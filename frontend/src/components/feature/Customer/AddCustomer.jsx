import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import MultiSelector from "./Helper/MultiSelector";
import { useFormik } from "formik";
import { useDispatch, useSelector } from 'react-redux'
import { validationSchema } from '../../../schemas/addCustomerSchema'
import { handleAddCustomerDetail, handleUpdateCustomer } from "../../../redux/AdminDataSlice";
import { addCustomer, editCustomer } from "../../../services/CustomerService";
import { generateUniqueId } from '../../../utils/UniqueIdGenerator'
import Spinner from "../../shared/Loader/Spinner";

const AddCustomer = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const param = useParams();
  const { customerid } = param;

  const customerDetail = useSelector(state => state.AdminDataSlice.customers)

  const [image, setImage] = useState({ image1: "", image2: "" });
  const [getPropertyData, setGetPropertyData] = useState([])
  const [loading, setLoading] = useState(false)
  const [createDate, setCreateDate] = useState(() => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const dd = String(today.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  });

    const addCustomerForm = useFormik({
      // validationSchema : validationSchema,
        initialValues: {
          uniqueid: '',
        createDate,
        customerType: "",
        contactMethod: "",
        personalDetails: {
            firstName: "",
            lastName: "",
            email: "",
            phone: "",
            company: "",
            status: ""
        },
        property: [],
        additionalContact: {
            detail1: {
            fullname: "",
            title: "",
            email: "",
            phone: "",
            },
            detail2: {
            fullname: "",
            title: "",
            email: "",
            phone: "",
            },
        },
        // additionalInfo: image,
        additionalNotes: "",
        },
        onSubmit: async (formData) => {
          setLoading(true)
          if(customerid) {
            const response = await editCustomer(formData)
            if(response.success) {
              setLoading(false)
              dispatch(handleUpdateCustomer(response.result))
              navigate(`/customer-detail/${response.result?.uniqueid}`); 
            }
          } else {
            formData.uniqueid = generateUniqueId()
            const response = await addCustomer(formData)
            if(response.success) {
                setLoading(false)
                dispatch(handleAddCustomerDetail(response.result))
                navigate(`/customer-detail/${response.result?.uniqueid}`); 
              }
            }            
        },
    });

    // Fetch existing customer details and set form values
useEffect(() => {
  if (customerid && customerDetail?.length >= 1) {
    const filteredCustomerData = customerDetail?.find((value) => value.uniqueid === customerid);
    if (filteredCustomerData) {
      // Set form values using Formik's setValues method
      addCustomerForm.setValues({
        uniqueid: filteredCustomerData?.uniqueid || "",
        createDate: filteredCustomerData?.createDate || createDate,
        customerType: filteredCustomerData?.customerType || "",
        contactMethod: filteredCustomerData?.contactMethod || "",
        personalDetails: {
          firstName: filteredCustomerData?.personalDetails?.firstName || "",
          lastName: filteredCustomerData?.personalDetails?.lastName || "",
          email: filteredCustomerData?.personalDetails?.email || "",
          phone: filteredCustomerData?.personalDetails?.phone || "",
          company: filteredCustomerData?.personalDetails?.company || "",
        },
        // property: filteredCustomerData?.property || [],
        additionalContact: {
          detail1: {
            fullname: filteredCustomerData?.additionalContact?.detail1?.fullname || "",
            title: filteredCustomerData?.additionalContact?.detail1?.title || "",
            email: filteredCustomerData?.additionalContact?.detail1?.email || "",
            phone: filteredCustomerData?.additionalContact?.detail1?.phone || "",
          },
          detail2: {
            fullname: filteredCustomerData?.additionalContact?.detail2?.fullname || "",
            title: filteredCustomerData?.additionalContact?.detail2?.title || "",
            email: filteredCustomerData?.additionalContact?.detail2?.email || "",
            phone: filteredCustomerData?.additionalContact?.detail2?.phone || "",
          },
        },
        additionalNotes: filteredCustomerData?.additionalNotes || "",
      });
      setGetPropertyData(filteredCustomerData?.property || [])
    }
  }
}, [customerid, customerDetail]);

  const handleImageUpload = (event, type) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setImage({ ...image, [type]: imageUrl });
      addCustomerForm.setFieldValue(`additionalInfo.${type}`, imageUrl);
    }
  };

  const handleMultiSelectorChange = (companyInfo) => {
    addCustomerForm.setFieldValue("property", companyInfo);
    // console.log(companyInfo)
  };

  return (
    <>
      <section>
        <div className="container py-4">
          <div className="row">
            <form onSubmit={addCustomerForm.handleSubmit}>
              <div className="col-md-12">
                <div className="head-filters">
                  <div className="part-1">
                    <h4 className="font-1 fw-700">Add New Customer</h4>
                  </div>
                  <div className="part-1 gtc-equal mob">
                    <button
                      type="button"
                      className="filter-btn bg-theme-2"
                      onClick={() => addCustomerForm.resetForm()}
                    >
                      <i
                        className="fa-regular fa-arrows-rotate-reverse fa-lg"
                        style={{ color: "#ffffff" }}
                      />{" "}
                      &nbsp; Reset All Fields
                    </button>
                    <button
                      type="submit"
                      className="filter-btn txt-deco-none bg-theme-1"
                    >
                      {loading ? (
                        <Spinner />
                      ) : (
                        <>
                          <i
                            className="fa-light fa-circle-check fa-lg"
                            style={{ color: "#ffffff" }}
                          /> 
                          &nbsp; Save Customer
                        </>
                      )}
                    </button>
                  </div>
                </div>

                <div className="pt-4">
                  <div className="box-cs">
                    <div className="top-cs">
                      <div>
                        <div className="header">
                          <h5 className="font-1 fw-700 font-size-16">
                            Select Date :
                          </h5>
                        </div>
                        <div className="input-section gtc-1 my-2">
                          <input
                            type="date"
                            value={addCustomerForm.values.createDate}
                            onChange={(e) =>
                              addCustomerForm.setFieldValue(
                                "createDate",
                                e.target.value
                              )
                            }
                            placeholder="Select Date"
                            id="date-input"
                          />
                        </div>
                      </div>
                      <div>
                        <div className="header">
                          <h5 className="font-1 fw-700 font-size-16">
                            Customer Type :
                          </h5>
                          {
                            addCustomerForm.errors.customerType && addCustomerForm.touched.customerType && (<small className="text-danger">{addCustomerForm.errors.customerType}</small>)
                          }
                        </div>
                        <div className="input-section gtc-3 my-2">
                          {["commercial", "multifamily", "residential"].map(
                            (type) => (
                              <div
                                key={type}
                                className={`checkbox-item ${
                                  addCustomerForm.values.customerType === type
                                    ? "active"
                                    : ""
                                }`}
                                onClick={() =>
                                  addCustomerForm.setFieldValue(
                                    "customerType",
                                    type
                                  )
                                }
                              >
                                {addCustomerForm.values.customerType ===
                                  type && (
                                  <i
                                    className="fa-light fa-circle-check fa-lg"
                                    style={{ color: "#ffffff" }}
                                  />
                                )}
                                {type.charAt(0).toUpperCase() + type.slice(1)}
                              </div>
                            )
                          )}
                        </div>
                      </div>
                      <div>
                        <div className="header">
                          <h5 className="font-1 fw-700 font-size-16">
                            Preferred Contact Method :
                          </h5>
                          {
                            addCustomerForm.errors.contactMethod && addCustomerForm.touched.contactMethod && (<small className="text-danger">{addCustomerForm.errors.contactMethod}</small>)
                          }
                        </div>
                        <div className="input-section gtc-3 mob my-2">
                        {["Call", "Email", "Text"].map((method) => (
                          <div className="flex-cs" key={method}>
                            <input
                              className="form-check-input mt-0"
                              type="radio" // Changed to radio to reflect single selection
                              value={method}
                              checked={addCustomerForm.values.contactMethod === method}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  addCustomerForm.setFieldValue("contactMethod", method);
                                }
                              }}
                            />
                            <label>{method}</label>
                          </div>
                        ))}
                        </div>
                      </div>
                    </div>

                    <div className="header pt-3">
                      <h5 className="font-1 fw-700 font-size-16">
                        Personal Details :
                      </h5>
                    </div>
                    <div className="input-section gtc-3 my-2">
                    {["firstName", "lastName", "email", "phone", "company"].map((field) => (
                      <div key={field} className="form-group ">
                        <input
                          type={field === "phone" ? "number" : "text"}
                          className={`form-control ${addCustomerForm.errors.personalDetails?.[field] && addCustomerForm.touched.personalDetails?.[field] && 'is-invalid'}`}
                          placeholder={field
                            .split(/(?=[A-Z])/)
                            .join(" ")
                            .replace(/\b\w/g, (c) => c.toUpperCase())}
                          value={addCustomerForm.values.personalDetails[field]}
                          onChange={(e) =>
                            addCustomerForm.setFieldValue(
                              `personalDetails.${field}`,
                              e.target.value
                            )
                          }
                          // onBlur={() =>
                          //   addCustomerForm.setFieldTouched(`personalDetails.${field}`, true)
                          // }
                        />
                        {/* Display error message for the specific field */}
                        {addCustomerForm.errors.personalDetails?.[field] &&
                          addCustomerForm.touched.personalDetails?.[field] && (
                            <small className="text-danger">
                              {addCustomerForm.errors.personalDetails[field]}
                            </small>
                          )}
                      </div>
                    ))}
                    <select name="status" value={addCustomerForm?.values?.personalDetails?.status} onChange={(e) => {addCustomerForm.setFieldValue("personalDetails.status", e.target.value)}} id="">
                      <option value="">Select Customer Status</option>
                      <option value="lead">Lead</option>
                      <option value="current customer">Current Customer</option>
                      <option value="past customer">Past Customer</option>
                    </select>
                  </div>
                  </div>
                </div>

                <div className="pt-4">
                    <MultiSelector
                        onDataChange={handleMultiSelectorChange}
                        paramData={getPropertyData}
                    />
                </div>

                <div className="pt-4">
                    <div className="box-cs">
                        <div>
                        <div className="header">
                            <h5 className="font-1 fw-700 font-size-16">
                            Additional Contact Info :
                            </h5>
                        </div>
                        <div className="input-section my-2">
                            {["detail1", "detail2"].map((detailKey) =>
                            ["full Name", "title", "email", "phone"].map(
                                (field) => (
                                <input
                                    key={`${detailKey}-${field}`}
                                    type={
                                    field === "phone" ? "number" : field === "email" ? "email" : "text"
                                    }
                                    placeholder={field
                                    .split(/(?=[A-Z])/)
                                    .join(" ")
                                    .replace(/\b\w/g, (c) => c.toUpperCase())}
                                    value={
                                    addCustomerForm.values.additionalContact[
                                        detailKey
                                    ][field]
                                    }
                                    onChange={(e) =>
                                    addCustomerForm.setFieldValue(
                                        `additionalContact.${detailKey}.${field === 'full Name' ? 'fullname' : field}`,
                                        e.target.value
                                    )
                                    }
                                />
                                )
                            )
                            )}
                        </div>
                        </div>
                        <div className="top-cs pt-3 gtc-1">
                            <div className="grid-cs cs-align-end">
                                {/* <div>
                                    <div className="header">
                                        <h5 className="font-1 fw-700 font-size-16">Additional info :</h5>
                                    </div>
                                    <div className="input-section mt-2 gtc-1">
                                        <div className="upload-box" onClick={()=>document.getElementById('file-upload1').click()}>
                                            {image.image1 ? (

                                                <img src={image.image1} alt="Uploaded" />
                                            
                                                ) : (
                                                <>
                                                    <img 
                                                    src="/assets/img/camera.svg"
                                                    alt="Camera Icon"
                                                    className="camera-icon"
                                                    />
                                                    <p>Upload Photos</p>
                                                </>
                                                )
                                            }
                                        </div>
                                        <input
                                            id="file-upload1"
                                            type="file"
                                            accept="image/*"
                                            onChange={(e)=>{handleImageUpload(e, 'image1')}}
                                            className="file-input"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <div className="input-section gtc-1">
                                        <div className="upload-box" onClick={()=>document.getElementById('file-upload2').click()}>
                                            {image.image2 ? (

                                                <img src={image.image2} alt="Uploaded" />
                                            
                                                ) : (
                                                <>
                                                    <img
                                                    src="/assets/img/camera.svg"
                                                    alt="Camera Icon"
                                                    className="camera-icon"
                                                    />
                                                    <p>Upload Blue Print</p>
                                                </>
                                                )
                                            }
                                        </div>
                                        <input
                                            id="file-upload2"
                                            type="file"
                                            accept="image/*"
                                            onChange={(e)=>{handleImageUpload(e, 'image2')}}
                                            className="file-input"
                                        />
                                    </div>
                                </div> */}
                            </div>
                            <div className="grid-cs gtc-1">
                                <div className="header">
                                    <h5 className="font-1 fw-700 font-size-16">Additional Notes :</h5>
                                    
                                </div>
                                <div className="input-section gtc-1">
                                    <textarea name="additionalNotes" value={addCustomerForm?.values?.additionalNotes} onChange={(e) => {addCustomerForm.setFieldValue("additionalNotes", e.target.value)}} rows={4} placeholder="Note" id=""></textarea>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </section>
    </>
  );
};

export default AddCustomer;
