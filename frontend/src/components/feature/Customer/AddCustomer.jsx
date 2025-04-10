import { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import MultiSelector from "./Helper/MultiSelector";
import { useFormik } from "formik";
import { useDispatch, useSelector } from 'react-redux'
import { validationSchema } from '../../../schemas/addCustomerSchema'
import { handleAddCustomerDetail, handleUpdateCustomer } from "../../../redux/AdminDataSlice";
import { addCustomer, editCustomer } from "../../../services/CustomerService";
import { generateUniqueId } from '../../../utils/UniqueIdGenerator'
import Spinner from "../../shared/Loader/Spinner";
import { toast } from "react-toastify";
import InputWithLabel from "../../shared/Field/InputField";
import SelectWithLabel from "../../shared/Field/SelectField";
import ErrorTooltip from "../../shared/Tooltip/ErrorTooltip";

const AddCustomer = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const param = useParams();
  const { customerid } = param;

  const customerDetail = useSelector(state => state.AdminDataSlice.customers)

  const [images, setImages] = useState([]);
  const [validate, setValidate] = useState(false)
  const [triggerValidate, setTriggerValidate] = useState(0)
  const [getPropertyData, setGetPropertyData] = useState([])
  const [loading, setLoading] = useState(false)
  const [createDate, setCreateDate] = useState(() => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const dd = String(today.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  });

  const fileInputRef = useRef(null);
  const [removedImages, setRemovedImages] = useState([]);
  const [errors, setErrors] = useState({});

  const validateAddCustomer = () => {
    const validationErrors = {};
    if (!addCustomerForm.values.personalDetails.firstName) {
      validationErrors.firstName = "First Name is required";
    }
    if (!addCustomerForm.values.personalDetails.email) {
      validationErrors.email = "Email is required";
    }
    if (!addCustomerForm.values.personalDetails.phone) {
      validationErrors.phone = "Phone is required";
    } else if (addCustomerForm.values.personalDetails.phone.length !== 10) {
      validationErrors.phone = "Phone number must be exactly 10 digits";
    }
    if (!addCustomerForm.values.personalDetails.company) {
      validationErrors.company = "Company is required";
    }
    if (!addCustomerForm.values.customerType) {
      validationErrors.customerType = "Customer Type is required";
    }
    if (!addCustomerForm.values.contactMethod) {
      validationErrors.contactMethod = "Contact Method is required";
    }
    // Validate Customer Status
    if (!addCustomerForm.values.personalDetails.status) {
      validationErrors.status = "Customer Status is required";
    }
    // Validate Source
    if (!addCustomerForm.values.source) {
      validationErrors.source = "Source is required";
    }

    // Validate additional contact fields
    ["detail1", "detail2"].forEach((detailKey) => {
      if (!addCustomerForm.values.additionalContact[detailKey].fullname) {
        validationErrors[`${detailKey}.fullname`] = "Full Name is required";
      }
      if (!addCustomerForm.values.additionalContact[detailKey].title) {
        validationErrors[`${detailKey}.title`] = "Title is required";
      }
      if (!addCustomerForm.values.additionalContact[detailKey].email) {
        validationErrors[`${detailKey}.email`] = "Email is required";
      }
      if (!addCustomerForm.values.additionalContact[detailKey].phone) {
        validationErrors[`${detailKey}.phone`] = "Phone is required";
      } else if (addCustomerForm.values.additionalContact[detailKey].phone.length !== 10) {
        validationErrors[`${detailKey}.phone`] = "Phone number must be exactly 10 digits";
      }
    });

    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };

  const addCustomerForm = useFormik({
    initialValues: {
      uniqueid: generateUniqueId(),
      createDate,
      customerType: "",
      contactMethod: "",
      source: "",
      images: [],
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
      additionalNotes: "",
    },
    onSubmit: async (formData) => {
      setLoading(true);
      setTriggerValidate(triggerValidate + 1);

      if (!validateAddCustomer()) {
        setLoading(false);
        toast.error("Fill the required fields");
        return;
      }
      
      if (customerid) {
        const vformData = new FormData();
        vformData.append('customerData', JSON.stringify(formData));
        vformData.append('removedImages', JSON.stringify(removedImages));
        
        images.forEach(img => {
          vformData.append('images', img.file);
        });
        const response = await editCustomer(vformData);
        if (response.success) {
          setLoading(false);
          toast.success("Customer updated successfully");
          dispatch(handleUpdateCustomer(response.result));
          navigate(`/customer-detail/${response.result?.uniqueid}`);
        } else {
          toast.error("Customer updated failed");
          setLoading(false);
        }
      } else {
        if (!formData.uniqueid) { 
          formData.uniqueid = generateUniqueId();
        }

        const vformData = new FormData();
        vformData.append('customerData', JSON.stringify(formData));
        
        images.forEach(img => {
          vformData.append('images', img.file);
        });

        const response = await addCustomer(vformData);
        if (response.success) {
          setLoading(false);
          toast.success("Customer added successfully");
          dispatch(handleAddCustomerDetail(response.result));
          navigate(`/customer-detail/${response.result?.uniqueid}`);
        } else {
          toast.error("Customer added failed");
          setLoading(false);
        }
      }
    },
  });

  useEffect(() => {
    if (customerid && customerDetail?.length >= 1) {
      const filteredCustomerData = customerDetail?.find((value) => value.uniqueid === customerid);
      if (filteredCustomerData) {
        addCustomerForm.setValues({
          uniqueid: filteredCustomerData?.uniqueid || "",
          createDate: filteredCustomerData?.createDate || createDate,
          customerType: filteredCustomerData?.customerType || "",
          contactMethod: filteredCustomerData?.contactMethod || "",
          source: filteredCustomerData?.source || "",
          images: filteredCustomerData?.images || [],
          personalDetails: {
            firstName: filteredCustomerData?.personalDetails?.firstName || "",
            lastName: filteredCustomerData?.personalDetails?.lastName || "",
            email: filteredCustomerData?.personalDetails?.email || "",
            phone: filteredCustomerData?.personalDetails?.phone || "",
            company: filteredCustomerData?.personalDetails?.company || "",
            status: filteredCustomerData?.personalDetails?.status
          },
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

  const handleMultiSelectorChange = (companyInfo) => {
    addCustomerForm.setFieldValue("property", companyInfo);
  };

  const handleImageUpload = (event) => {
    const files = event.target.files;
    const acceptedFormats = ['image/jpeg', 'image/png', 'image/svg+xml', 'image/webp'];
    const maxSize = 2 * 1024 * 1024; // 2MB in bytes
  
    const validImages = [];
  
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
  
      if (file.size > maxSize) {
        toast.warn(`File ${file.name} exceeds the 2MB size limit.`);
        continue;
      }
  
      if (!acceptedFormats.includes(file.type)) {
        toast.warn(`File ${file.name} is not an accepted format. Please upload JPEG, PNG, SVG, or WEBP.`);
        continue;
      }
  
      validImages.push({
        file,
        preview: URL.createObjectURL(file)
      });
    }
  
    setImages(prev => [...prev, ...validImages]);
  };

  const handleRemoveImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const removeImageFromServer = (imageId) => {
    setRemovedImages(prev => [...prev, imageId]);
  };

  const recoverImage = (imageId) => {
    setRemovedImages(prev => prev.filter(id => id !== imageId));
  };

  const options = [
    'lead',
    'current customer',
    'past customer'
  ]

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
                            errors.customerType && (
                              <ErrorTooltip 
                                message={errors.customerType}
                                visible={true}
                              />
                            )
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
                            errors.contactMethod && (
                              <ErrorTooltip 
                                message={errors.contactMethod}
                                visible={true}
                              />
                            )
                          }
                        </div>
                        <div className="input-section gtc-3 mob my-2">
                        {["Call", "Email", "Text"].map((method) => (
                          <div className="flex-cs" key={method}>
                            <input
                              className="form-check-input mt-0"
                              type="radio"
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
                    {["firstName", "email", "phone", "company"].map((field) => (
                      <div key={field} className="form-group position-rel">
                        <InputWithLabel 
                          type={field === "phone" ? "number" : "text"}
                          label={field === "firstName" ? 'Full Name' : field
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
                        />
                        {errors[field] && (
                          <ErrorTooltip 
                            message={errors[field]}
                            visible={true}
                          />
                        )}
                        {/* Display error message for the specific field */}
                      </div>
                    ))}
                    <div className="width-100 position-rel">
                      <SelectWithLabel 
                        label='Select Customer Status'
                        name='status'
                        value={addCustomerForm?.values?.personalDetails?.status}
                        onChange={(e) => {addCustomerForm.setFieldValue("personalDetails.status", e.target.value)}}
                        options={options}
                      />
                      {errors.status && (
                        <ErrorTooltip 
                          message={errors.status}
                          visible={true}
                        />
                      )}
                    </div>
                    <div className="width-100 position-rel">
                      <InputWithLabel 
                        type="text"
                        name='source'
                        label="Source"
                        value={addCustomerForm?.values?.source} 
                        onChange={(e) => {addCustomerForm.setFieldValue("source", e.target.value)}}
                      />
                      {errors.source && (
                        <ErrorTooltip 
                          message={errors.source}
                          visible={true}
                        />
                      )}
                    </div>
                    </div>
                  </div>
                </div>

                <div className="pt-4">
                    <MultiSelector
                        onDataChange={handleMultiSelectorChange}
                        paramData={getPropertyData}
                        triggerValidate={triggerValidate}
                        validate={validate}
                        setValidate={setValidate}
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
                              ["full Name", "title", "email", "phone"].map((field) => (
                                <div key={field} className="form-group position-rel">
                                  <InputWithLabel 
                                    type={field === "phone" ? "number" : field === "email" ? "email" : "text"}
                                    label={field.split(/(?=[A-Z])/).join(" ").replace(/\b\w/g, (c) => c.toUpperCase())}
                                    value={addCustomerForm.values.additionalContact[detailKey][field === 'full Name' ? 'fullname' : field]}
                                    onChange={(e) =>
                                      addCustomerForm.setFieldValue(
                                        `additionalContact.${detailKey}.${field === 'full Name' ? 'fullname' : field}`,
                                        e.target.value
                                      )
                                    }
                                  />
                                  {errors[`${detailKey}.${field === 'full Name' ? 'fullname' : field}`] && (
                                    <ErrorTooltip 
                                      message={errors[`${detailKey}.${field === 'full Name' ? 'fullname' : field}`]}
                                      visible={true}
                                    />
                                  )}
                                </div>
                              ))
                            )}
                        </div>
                        </div>
                        <div className="top-cs pt-3 gtc-1">
                            <div className="grid-cs cs-align-end">
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
                        <div className="input-section pt-4 grid-cs gtc-4 width-100 cs-align-end">
                          {addCustomerForm.values.images?.map((img, index) => (
                            <div 
                              key={`server-${index}`} 
                              className={`upload-box ${removedImages.includes(img.uniqueid) ? 'removed' : ''}`}
                            >
                              <img src={img.s3Url} alt="Service Image" className="preview-image" />
                              {!removedImages.includes(img.uniqueid) ? (
                                <button
                                  type="button"
                                  className="btn btn-danger btn-sm cs-absolute"
                                  onClick={() => removeImageFromServer(img.uniqueid)}
                                >
                                  Remove
                                </button>
                              ) : (
                                <button
                                  type="button"
                                  className="btn btn-danger btn-sm cs-absolute"
                                  onClick={() => recoverImage(img.uniqueid)}
                                >
                                  Recover
                                </button>
                              )}
                            </div>
                          ))}
                          
                          {images.map((img, index) => (
                            <div key={`local-${index}`} className="upload-box ">
                              <img src={img.preview} alt="Preview" className="preview-image" />
                              <button
                                type="button"
                                className="btn btn-danger btn-sm remove-btn"
                                onClick={() => handleRemoveImage(index)}
                              >
                                Remove
                              </button>
                            </div>
                          ))}

                          <div className="upload-box" onClick={() => fileInputRef.current?.click()}>
                            <img src="/assets/img/camera.svg" alt="Camera Icon" className="camera-icon" />
                            <p>Upload Photos</p>
                            <ErrorTooltip 
                              message={"The image should be less then 2mb"}
                              visible={ true }
                            />
                          </div>

                          <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={handleImageUpload}
                            className="file-input"
                            style={{ display: 'none' }}
                          />
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
