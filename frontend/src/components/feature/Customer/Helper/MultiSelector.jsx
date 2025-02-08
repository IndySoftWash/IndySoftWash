import { useState, useEffect } from "react";
import { generateUniqueId } from "../../../../utils/UniqueIdGenerator";

const MultiSelector = ({ onDataChange, paramData }) => {
  const [properties, setProperties] = useState([
    { 
      propertyName: "", 
      uniqueid: generateUniqueId(),
      property: "", 
      buildings: "", 
      units: "", 
      billingAddress: "", 
      serviceAddress: "", 
      propertyType: [], 
      propertyFeatures: [], 
      note: "" 
    },
  ]);

 // On paramData update, set properties if paramData exists and is not empty
 useEffect(() => {
  if (paramData?.length >= 1) {
    const formattedProperties = paramData.map((item) => ({
      propertyName: item.propertyName || "",
      uniqueid: item.uniqueid || generateUniqueId(),
      property: item.property || "",
      buildings: item.buildings || 0,
      units: item.units || 0,
      billingAddress: item.billingAddress || "",
      serviceAddress: item.serviceAddress || "",
      propertyType: item.propertyType || [],
      propertyFeatures: item.propertyFeatures || [],
      note: item.note || "",
    }));
    setProperties(formattedProperties);
  }
}, [paramData]);

  const [errors, setErrors] = useState([]);

  const validateData = () => {
    const validationErrors = properties.map((property, index) => {
      const error = {};
      if (!property.propertyName) error.propertyName = "Company name is required";
      if (!property.property) error.property = "Property is required";
      if (!property.buildings) error.buildings = "# of Buildings is required";
      if (!property.units) error.units = "No. of Units is required";
      if (!property.billingAddress) error.billingAddress = "Billing Address is required";
      if (!property.serviceAddress) error.serviceAddress = "Service Address is required";
      if (property.propertyType.length === 0) error.propertyType = "At least one property type is required";
      if (property.propertyFeatures.length === 0) error.propertyFeatures = "At least one property feature is required";
      return error;
    });
    setErrors(validationErrors);
    return validationErrors.every((error) => Object.keys(error).length === 0);
  };

  const setSelection = (index, type, value) => {
    const updatedProperties = [...properties];
  
    // Create a new updated property object instead of mutating directly
    const updatedProperty = { ...updatedProperties[index] };
  
    if (type === "propertyType" || type === "propertyFeatures") {
      if (updatedProperty[type].includes(value)) {
        updatedProperty[type] = updatedProperty[type].filter((item) => item !== value);
      } else {
        updatedProperty[type] = [...updatedProperty[type], value];
      }
    } else {
      updatedProperty[type] = value;
    }
  
    // Replace the updated property in the array
    updatedProperties[index] = updatedProperty;
  
    setProperties(updatedProperties);
    onDataChange(updatedProperties); // Send updated data via props
  };
  

  const removeProperty = (index) => {
    const updatedProperties = properties.filter((_, i) => i !== index); // Remove the property at the specified index
    setProperties(updatedProperties);
    onDataChange(updatedProperties); // Send updated data via props
  };
  

  const addProperty = () => {
    setProperties([
      ...properties,
      {
        propertyName: "",
        uniqueid: generateUniqueId(),
        property: "",
        buildings: "",
        units: "",
        billingAddress: "",
        serviceAddress: "",
        propertyType: [],
        propertyFeatures: [],
        note: "",
      },
    ]);
  };

  useEffect(() => {
    // Validate data and send validation errors to the parent
    // validateData();
  }, [properties]);

  return (
    <>
      <div className="box-cs">
        {properties.map((property, index) => (
          <div key={index} className="mt-5">
            {(index + 1) !== 1 && (
              <div className={`py-4 d-flex cs-between ${(index + 1) !== 1 && 'cs-border'}`}>
                <h5 className="font-1 fw-700 pill-cs font-size-16">Property Details {index + 1}</h5>
                <button onClick={()=>removeProperty(index)} type="button" className="btn"><i class="fa-solid fa-xl fa-xmark"></i></button>
              </div>
            )}
            <div>
              <div className="header">
                <h5 className="font-1 fw-700 font-size-16">Property Details :</h5>
              </div>
              <div className="input-section my-2">
                <input
                  type="text"
                  placeholder="Property Name"
                  value={property.propertyName}
                  onChange={(e) => setSelection(index, "propertyName", e.target.value)}
                />
                {errors[index]?.propertyName && <div className="error text-danger">{errors[index].propertyName}</div>}
                <input
                  type="text"
                  placeholder="Management Company"
                  value={property.property}
                  onChange={(e) => setSelection(index, "property", e.target.value)}
                />
                {errors[index]?.property && <div className="error text-danger">{errors[index].property}</div>}
                <input
                  type="text"
                  placeholder="# of Buildings"
                  value={property.buildings}
                  onChange={(e) => setSelection(index, "buildings", e.target.value)}
                />
                {/* {errors[index]?.buildings && <div className="error text-danger">{errors[index].buildings}</div>} */}
                <input
                  type="number"
                  placeholder="No. Of Units"
                  value={property.units}
                  onChange={(e) => setSelection(index, "units", e.target.value)}
                />
                {errors[index]?.units && <div className="error text-danger">{errors[index].units}</div>}
              </div>
              <div className="input-section gtc-equal my-2">
                <input
                  type="text"
                  placeholder="Billing Address"
                  value={property.billingAddress}
                  onChange={(e) => setSelection(index, "billingAddress", e.target.value)}
                />
                {/* {errors[index]?.billingAddress && <div className="error text-danger">{errors[index].billingAddress}</div>} */}
                <input
                  type="text"
                  placeholder="Service Address"
                  value={property.serviceAddress}
                  onChange={(e) => setSelection(index, "serviceAddress", e.target.value)}
                />
                {/* {errors[index]?.serviceAddress && <div className="error text-danger">{errors[index].serviceAddress}</div>} */}
              </div>
            </div>

            <div className="pt-3">
              <div className="header">
                <h5 className="font-1 fw-700 font-size-16">Property Type</h5>
              </div>
              <div className="grid-3-cs my-2 align-items-stretch">
                <div className="input-section gtc-3">
                  {["2-Story Garden - Style", "4-Story Mid-rise", "High Rise", "3-Story Garden - Style", "5-Story Mid-rise", "Garden-rise"].map(
                    (type) => (
                      <div
                        key={type}
                        className={`checkbox-item ${property.propertyType.includes(type) ? "active" : ""}`}
                        onClick={() => setSelection(index, "propertyType", type)}
                      >
                        {property.propertyType.includes(type) && (
                          <i className="fa-light fa-circle-check fa-lg" style={{ color: "#ffffff" }} />
                        )}
                        {type}
                      </div>
                    )
                  )}
                </div>
                {/* {errors[index]?.propertyType && <div className="error text-danger">{errors[index].propertyType}</div>} */}
                <div className="input-section gtc-1 my-2">
                  <textarea
                    rows={3}
                    placeholder="Note"
                    value={property.note}
                    onChange={(e) => setSelection(index, "note", e.target.value)}
                  ></textarea>
                </div>
              </div>
            </div>

            <div className="pt-3">
              <div className="header">
                <h5 className="font-1 fw-700 font-size-16">Property Features</h5>
              </div>
              <div className="input-section">
                {["Vinyl Siding", "Hardie Board", "Ample Water Supply", "Ample Parking", "Brick Siding", "Breezeways", "Limited Water Supply", "Limited Parking"].map(
                  (feature) => (
                    <div
                      key={feature}
                      className={`checkbox-item ${property.propertyFeatures.includes(feature) ? "active" : ""}`}
                      onClick={() => setSelection(index, "propertyFeatures", feature)}
                    >
                      {property.propertyFeatures.includes(feature) && (
                        <i className="fa-light fa-circle-check fa-lg" style={{ color: "#ffffff" }} />
                      )}
                      {feature}
                    </div>
                  )
                )}
              </div>
              {/* {errors[index]?.propertyFeatures && <div className="error text-danger">{errors[index].propertyFeatures}</div>} */}
            </div>
          </div>
        ))}
      </div>

      <div className="my-3">
        <button type="button" className="filter-btn bg-theme-2" onClick={addProperty}>
          <i className="fa-light fa-xl fa-circle-plus" style={{ color: "#ffffff" }} /> &nbsp; Add Additional Property
        </button>
      </div>
    </>
  );
};

export default MultiSelector;
