import { useFormik } from "formik";
import { useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { validationSchema } from '../../../../schemas/addPropertySchema'
import { addProperty } from "../../../../services/CustomerService";
import { generateUniqueId } from "../../../../utils/UniqueIdGenerator";
import { handleAddProperty } from "../../../../redux/AdminDataSlice";
import Spinner from '../../../shared/Loader/Spinner'

const AddPropertyModal = ({ customerid }) => {

    const clsModal = useRef();
    const dispatch = useDispatch();
    
    const [loading, setLoading] = useState(false);


    const formik = useFormik({
        initialValues: {
            uniqueid: generateUniqueId(),
            customerid,
            propertyName: "",
            property: "",
            buildings: "",
            units: "",
            billingAddress: "",
            serviceAddress: "",
            note: "",
            propertyType: [],
            propertyFeatures: [],
        },
        validationSchema,
        onSubmit: async(formData) => {
            const response = await addProperty(formData)
            if(response.success) {
                // console.log("hilll")
                dispatch(handleAddProperty(formData))
                clsModal.current.click();
            }
        },
    });
    
    const propertyTypes = [
        "2-Story Garden - Style", 
        "4-Story Mid-rise", 
        "High Rise", 
        "3-Story Garden - Style", 
        "5-Story Mid-rise", 
        "Garden-rise"
      ];
    
      const propertyFeatures = [
        "Vinyl Siding", 
        "Hardie Board", 
        "Ample Water Supply", 
        "Ample Parking", 
        "Brick Siding", 
        "Breezeways", 
        "Limited Water Supply", 
        "Limited Parking"
      ];
    
      const handlePropertyTypeChange = (type) => {
        const selectedTypes = formik.values.propertyType.includes(type)
          ? formik.values.propertyType.filter((item) => item !== type)
          : [...formik.values.propertyType, type];
    
        formik.setFieldValue('propertyType', selectedTypes);
      };
    
      const handlePropertyFeaturesChange = (feature) => {
        const selectedFeatures = formik.values.propertyFeatures.includes(feature)
          ? formik.values.propertyFeatures.filter((item) => item !== feature)
          : [...formik.values.propertyFeatures, feature];
    
        formik.setFieldValue('propertyFeatures', selectedFeatures);
      };
    


  return (
    <>
        <div
            className="modal fade"
            id="addProperty"
            tabIndex="-1"
            aria-labelledby="exampleModalLabel"
            aria-hidden="true"
        >
            <div className="modal-dialog width-800 modal-dialog-centered">
                <div className="modal-content box-cs">
                    <div className="modal-header">
                        
                    </div>
                    <form onSubmit={formik.handleSubmit}>
                    <div className="modal-body">
                        <div className="box-cs">
                            <div className="">
                                <div className={`py-3 ${formik.errors.propertyName ? 'cs-border' : ''}`}>
                                    <h5 className="font-1 fw-700 pill-cs font-size-16">Property Details</h5>
                                </div>

                                <div className="input-section gtc-equal my-2">
                                    <input
                                    type="text"
                                    name="propertyName"
                                    placeholder="Property Name"
                                    value={formik.values.propertyName}
                                    onChange={formik.handleChange}
                                    />
                                    {formik.errors.propertyName && formik.touched.propertyName && <div className="error text-danger">{formik.errors.propertyName}</div>}

                                    <input
                                    type="text"
                                    name="property"
                                    placeholder="Property"
                                    value={formik.values.property}
                                    onChange={formik.handleChange}
                                    />
                                    {formik.errors.property && formik.touched.property && <div className="error text-danger">{formik.errors.property}</div>}

                                    <input
                                    type="text"
                                    name="buildings"
                                    placeholder="# of Buildings"
                                    value={formik.values.buildings}
                                    onChange={formik.handleChange}
                                    />
                                    {formik.errors.buildings && formik.touched.buildings && <div className="error text-danger">{formik.errors.buildings}</div>}

                                    <input
                                    type="number"
                                    name="units"
                                    placeholder="No. Of Units"
                                    value={formik.values.units}
                                    onChange={formik.handleChange}
                                    />
                                    {formik.errors.units && formik.touched.units && <div className="error text-danger">{formik.errors.units}</div>}
                                </div>

                                <div className="input-section gtc-1 my-2">
                                    <input
                                    type="text"
                                    name="billingAddress"
                                    placeholder="Billing Address"
                                    value={formik.values.billingAddress}
                                    onChange={formik.handleChange}
                                    />
                                    {formik.errors.billingAddress && formik.touched.billingAddress && <div className="error text-danger">{formik.errors.billingAddress}</div>}

                                    <input
                                    type="text"
                                    name="serviceAddress"
                                    placeholder="Service Address"
                                    value={formik.values.serviceAddress}
                                    onChange={formik.handleChange}
                                    />
                                    {formik.errors.serviceAddress && formik.touched.serviceAddress && <div className="error text-danger">{formik.errors.serviceAddress}</div>}
                                </div>

                                <div className="pt-3">
                                    <div className="header">
                                    <h5 className="font-1 fw-700 font-size-16">Property Type</h5>
                                    </div>
                                    <div className="grid-cs gtc-1 my-2 align-items-stretch">
                                        <div className="input-section gtc-3">
                                            {propertyTypes.map((type) => (
                                            <div
                                                key={type}
                                                className={`checkbox-item ${formik.values.propertyType.includes(type) ? 'active' : ''}`}
                                                onClick={() => handlePropertyTypeChange(type)}
                                            >
                                                {formik.values.propertyType.includes(type) && (
                                                <i className="fa-light fa-circle-check fa-lg" style={{ color: "#ffffff" }} />
                                                )}
                                                {type}
                                            </div>
                                            ))}
                                        </div>
                                        <div className="input-section gtc-1 my-2">
                                            <textarea
                                            rows={3}
                                            name="note"
                                            placeholder="Note"
                                            value={formik.values.note}
                                            onChange={formik.handleChange}
                                            ></textarea>
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-3">
                                    <div className="header">
                                    <h5 className="font-1 fw-700 font-size-16">Property Features</h5>
                                    </div>
                                    <div className="input-section gtc-3">
                                    {propertyFeatures.map((feature) => (
                                        <div
                                        key={feature}
                                        className={`checkbox-item ${formik.values.propertyFeatures.includes(feature) ? 'active' : ''}`}
                                        onClick={() => handlePropertyFeaturesChange(feature)}
                                        >
                                        {formik.values.propertyFeatures.includes(feature) && (
                                            <i className="fa-light fa-circle-check fa-lg" style={{ color: "#ffffff" }} />
                                        )}
                                        {feature}
                                        </div>
                                    ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button
                        type="button"
                        className="filter-btn bg-theme-7"
                        data-bs-dismiss="modal"
                        ref={clsModal}
                        disabled={loading} // Disable button during loading
                        >
                        Close
                        </button>
                        <button
                        type="submit"
                        className="filter-btn bg-theme-1"
                        // onClick={deleteCustomerFunc}
                        disabled={loading} // Disable button during loading
                        >
                        {loading ? (
                            <Spinner />
                        ) : (
                            "Add Property"
                        )}
                        </button>
                    </div>
                    </form>
                </div>
            </div>
        </div>
    </>
  )
}

export default AddPropertyModal