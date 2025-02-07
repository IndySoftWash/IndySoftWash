import { useEffect, useState, useRef } from "react";
import { frequencyDigit, frequencyDigitConverter } from '../../../../utils/frequencyDigitConverter'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';  // Import the default CSS for Toastify
import { getPerCleaningCost } from "../../../../utils/ArithematicCalculation";
import { formatNumberInput } from "../../../../utils/Formatter";


const ServiceAccordian = ({ property, service, onChangeData, getServiceid }) => {

  const fileInputRef = useRef([]);
  const [image, setImage] = useState([]);
  const [removeImage, setRemoveImage] = useState([]);
  const [removedImages, setRemovedImages] = useState([]);
  const [servicesData, setServicesData] = useState(
    service?.reduce((acc, curr) => {
      acc[curr.uniqueid] = { ...curr }; // Initialize the state with each service data
      return acc;
    }, {})
  );
  const [displayData, setDisplayData] = useState([])

  // Sync servicesData and displayData with the incoming service prop
  useEffect(() => {
    const serviceState = service?.reduce((acc, curr) => {
      acc[curr.uniqueid] = { ...curr };
      return acc;
    }, {});
    setServicesData(serviceState);
    setDisplayData(service); // Directly reflect the updated service array
  }, [service]);

// Function to toggle month selection
const toggleMonthSelection = (month, serviceUniqueId) => {
    setServicesData((prevServicesData) => {
      const updatedService = { ...prevServicesData[serviceUniqueId] };
  
      // Get the frequency object based on the activePlan
      const activePlanFrequency = updatedService.frequency?.find(
        (item) => item.name === updatedService.activePlan
      );
      const frequencyDigitValue = activePlanFrequency?.frequencyDigit; // Get the frequencyDigit
  
      if (!frequencyDigitValue) return prevServicesData; // Ensure there's a valid frequency value
  
      // Reset the months if activePlan has changed
      if (updatedService.activePlan !== prevServicesData[serviceUniqueId].activePlan) {
        updatedService.months = []; // Clear months when activePlan changes
      }
  
      // Check if the user has already selected or deselected the month
      let updatedSelectedMonths;
      if (updatedService.months?.includes(month)) {
        // Remove the month if already selected
        updatedSelectedMonths = updatedService.months.filter((item) => item !== month);
      } else {
        // Add month if not selected
        updatedSelectedMonths = [...(updatedService.months || []), month];
      }
  
      // Ensure the selected months match the required frequency (mandatory selection)
      if (updatedSelectedMonths.length > frequencyDigitValue) {
        // Show a Toast notification if the number of selected months exceeds the limit
        toast.error(`You can only select up to ${frequencyDigitValue} months.`);
        return prevServicesData;
      }
  
      // Update the service data with the newly selected months
      updatedService.months = updatedSelectedMonths;
  
      // Update the state with the updated selected months
      return {
        ...prevServicesData,
        [serviceUniqueId]: updatedService,
      };
    });
};

const handleInputChange = (e, serviceUniqueId, field) => {
    const { value } = e.target;
    setServicesData((prevServicesData) => {
      const updatedService = { ...prevServicesData[serviceUniqueId] };
      updatedService[field] = value;
      return {
        ...prevServicesData,
        [serviceUniqueId]: updatedService,
      };
    });
};

const handleFrequencyChange = (e, frequency, serviceUniqueId, field) => {
    const { value } = e.target;

    // Check if the value is a string (frequency name) or number (price)
    const isString = isNaN(value);

    setServicesData((prevServicesData) => {
        const updatedService = { ...prevServicesData[serviceUniqueId] };

        if (isString) {
            // Handle the case when the value is a string (frequency name)
            const frequencyExists = updatedService.frequency?.find(
                (item) => item.name === value
            );

            if (frequencyExists) {
                // If it exists, set it as the activePlan
                updatedService.activePlan = value;
            } else {
                // If it doesn't exist, create a new entry in the frequency array
                updatedService.frequency = [
                    ...(updatedService.frequency || []),
                    {
                        name: value,
                        price: 0,
                        frequencyDigit: frequencyDigitConverter[value] || 1, // Default to 1 if no converter value
                    },
                ];
                updatedService.activePlan = value;
            }
        } else {
            // Handle the case when the value is a number (price)
            updatedService.frequency = updatedService.frequency?.map((item) => {
                if (item.name === frequency) {
                    return {
                        ...item,
                        [field]: parseFloat(value), // Convert the value to a number before storing
                    };
                }
                return item;
            });
        }

        // Return the updated services data
        return {
            ...prevServicesData,
            [serviceUniqueId]: updatedService,
        };
    });
};

const resetMonths = (serviceUniqueId) => {
    setServicesData((prevServicesData) => {
      if (!prevServicesData[serviceUniqueId]) {
        console.error(`Service with ID ${serviceUniqueId} not found.`);
        return prevServicesData; // Return unchanged state if the service doesn't exist
      }
  
      // Create a copy of the specific service data and reset its months
      const updatedService = { 
        ...prevServicesData[serviceUniqueId], 
        months: [] // Reset the months to an empty array
      };
  
      // Return the updated state with the reset service
      return {
        ...prevServicesData,
        [serviceUniqueId]: updatedService,
      };
    });
};

useEffect(()=>{
    onChangeData(servicesData, image, removeImage)
}, [servicesData, image, removeImage])


const handleImageUpload = (event, serviceId) => {
  if (!event.target.files.length) return;

  const files = Array.from(event.target.files);
  const newImageFiles = files.map((file) => {
    const fileExtension = file.name.split(".").pop();
    const newFileName = `${serviceId}_${Date.now()}.${fileExtension}`;
    const renamedFile = new File([file], newFileName, { type: file.type });
    
    return {
      file: renamedFile,
      preview: URL.createObjectURL(file),
    };
  });

  setImage((prevImages) => ({
    ...prevImages,
    [serviceId]: [...(prevImages[serviceId] || []), ...newImageFiles],
  }));

  // Reset file input to allow re-upload of the same file
  if (fileInputRef.current[serviceId]) {
    fileInputRef.current[serviceId].value = "";
  }
};

const handleRemoveImage = (serviceId, index) => {
  setImage((prevImages) => {
    if (!prevImages[serviceId]) return prevImages;

    const updatedServiceImages = prevImages[serviceId].filter((_, i) => i !== index);

    if (updatedServiceImages.length === 0) {
      const { [serviceId]: _, ...rest } = prevImages;
      return rest;
    }

    return {
      ...prevImages,
      [serviceId]: updatedServiceImages,
    };
  });
};

const removeImageFromServer = (serviceId, imageId) => {
  setRemovedImages(prev => [...prev, imageId]);
  setRemoveImage((prevRemoveImage) => [...prevRemoveImage, { serviceId, imageId }]);
};

const recoverImage = (serviceId, imageId) => {
  setRemovedImages(prev => prev.filter(id => id !== imageId));
  setRemoveImage(prev => prev.filter(item => item.imageId !== imageId));
};

  return (
    <div className="accordion" id="servicesAccordion">
      {displayData?.map((value) => {
        const getFrequency = servicesData[value?.uniqueid]?.frequency?.find((item) => item.name === servicesData[value?.uniqueid]?.activePlan);
        const perCleaning = getPerCleaningCost(servicesData[value?.uniqueid]?.sqft, getFrequency?.price, servicesData[value?.uniqueid]?.quantity)
        const perMonth = ((perCleaning * getFrequency?.frequencyDigit) / 12 / property?.units).toFixed(2);
        return (
          <div className="accordion-item cs-accordian" key={value.uniqueid}>
            <h2 className="accordion-header cs-accordian-head" id={`heading-${value.uniqueid}`}>
              <button
                className="accordion-button cs-accordian-button"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target={`#collapse-${value.uniqueid}`}
                aria-expanded="true"
                aria-controls={`collapse-${value.uniqueid}`}
              >
                <div className="flex-cs cs-justify-between">
                  <h4>{value?.name}</h4>
                  <div className="table-profile">
                    <div className="gap-0">
                      {/* <button className={`btn ${window.innerWidth > 767 ? "" : "btn-sm"}`}>
                        <i
                          className={`fa-solid ${window.innerWidth > 767 ? "fa-lg" : "fal-sm"} fa-pen`}
                          style={{ color: "#00b69b" }}
                        />
                      </button> */}
                    <button className={`btn ${window.innerWidth > 767 ? "" : "btn-sm"}`} onClick={()=>getServiceid(value.uniqueid)} data-bs-toggle="modal" data-bs-target="#delete" >
                      <i
                        className={`fa-regular ${window.innerWidth > 767 ? "fa-lg" : "fal-sm"} fa-trash-can`}
                        style={{ color: "#f93c65" }}
                      />
                    </button>
                    </div>
                  </div>
                </div>
              </button>
            </h2>
            <div
              id={`collapse-${value.uniqueid}`}
              className="accordion-collapse collapse show"
              aria-labelledby={`heading-${value.uniqueid}`}
              data-bs-parent="#servicesAccordion"
            >
              <div className="accordion-body">
                <div className="accordian-content">
                  <div className="top-section">
                    <div className="header">
                      <h4>Service Item</h4>
                      <h4>Quantity</h4>
                      <h4>SQFT</h4>
                      <h4>Frequency</h4>
                      <h4>Price/SQFT</h4>
                    </div>
                    <div className="body">
                      <div className="part-1 input-section">
                        <input
                          className="width-100 input-"
                          type="text"
                          placeholder="Enter Service Name"
                          value={servicesData[value.uniqueid]?.name || ""}
                          onChange={(e) => handleInputChange(e, value.uniqueid, "name")}
                          
                        />
                        <input
                          className="width-100 input-"
                          type="number"
                          placeholder="Quantity"
                          value={servicesData[value.uniqueid]?.quantity || ""}
                          onChange={(e) => handleInputChange(e, value.uniqueid, "quantity")}
                          
                        />
                        <input
                          className="width-100 input-"
                          type="number"
                          placeholder="SQFT"
                          value={servicesData[value.uniqueid]?.sqft || ""}
                          onChange={(e) => handleInputChange(e, value.uniqueid, "sqft")}
                          
                        />
                        <select className="width-100" value={servicesData[value.uniqueid]?.activePlan || ""} onChange={(e) => {handleFrequencyChange(e, servicesData[value.uniqueid]?.activePlan, value.uniqueid, "activePlan"), resetMonths(value.uniqueid)}} name="" id="">
                            {
                                frequencyDigit?.map((item, itemIndex) => {
                                    return (<option key={itemIndex} value={item}>{item}</option>)
                                })
                            }
                        </select>
                        {/* <input
                          className="width-100 input-"
                          type="text"
                          placeholder="Frequency"
                          value={servicesData[value.uniqueid]?.activePlan || ""}
                          onChange={(e) => handleFrequencyChange(e, value.uniqueid, "activePlan")}
                          
                        /> */}
                        <input
                          className="width-100 input-"
                          onBlur={(e)=>formatNumberInput(e)}
                          type="number"
                          placeholder="$"
                          value={getFrequency?.price}
                          onChange={(e) => handleFrequencyChange(e, servicesData[value.uniqueid]?.activePlan, value.uniqueid, "price")}
                          
                        />
                      </div>
                      <div className="part-2 input-section">
                        <textarea
                          rows={5}
                          className="input-"
                          
                          placeholder="Note"
                          value={servicesData[value.uniqueid]?.description || ""}
                          onChange={(e) => handleInputChange(e, value.uniqueid, "description")}
                        ></textarea>
                        <div className="keys">
                          <h4>Price Per Clean =</h4>
                          <h4>Annual Investment =</h4>
                          <h4>Price Per Door/Month =</h4>
                        </div>
                        <div className="values input-section gtc-3">
                          <input
                            className="width-100 input-disabled"
                            disabled
                            type="number"
                            placeholder="$"
                            
                            value={perCleaning || ""}
                          />
                          <input
                            className="width-100 input-disabled"
                            disabled
                            type="number"
                            placeholder="$"
                            
                            value={perCleaning * getFrequency?.frequencyDigit || ""}
                          />
                          <input
                            className="width-100 input-disabled"
                            disabled
                            type="number"
                            placeholder="$"
                            
                            value={perMonth || ""}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="bottom-section width-100">
                    <div className="head">
                      <h4>Select Service Month(s): *</h4>
                    </div>
                    <div className="grid-cd width-100 input-section gtc-6">
                      {[
                        "January",
                        "February",
                        "March",
                        "April",
                        "May",
                        "June",
                        "July",
                        "August",
                        "September",
                        "October",
                        "November",
                        "December",
                      ].map((month) => (
                        <div
                          key={month}
                          className={`checkbox-item ${
                            servicesData[value?.uniqueid]?.months?.includes(month) ? "active" : ""
                          }`}
                          onClick={() => toggleMonthSelection(month, value.uniqueid)}
                        >
                          {servicesData[value.uniqueid]?.months?.includes(month) && (
                            <i className="fa-light fa-circle-check fa-lg" style={{ color: "#ffffff" }} />
                          )}
                          {month}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="input-section grid-cs gtc-4 width-100 cs-align-end">
                    {/* Show existing server images if any */}
                    {value.images && value.images.map((img, index) => (
                      <div 
                        key={`server-${index}`} 
                        className={`upload-box ${removedImages.includes(img.uniqueid) ? 'removed' : ''}`}
                      >
                        <img src={img.s3Url} alt="Service Image" />
                        {!removedImages.includes(img.uniqueid) ? (
                          <button
                            type="button"
                            className="btn btn-danger btn-sm cs-absolute"
                            onClick={() => removeImageFromServer(value.uniqueid, img.uniqueid)}
                          >
                            Remove
                          </button>
                        ) : (
                          <button
                            type="button"
                            className="btn btn-success btn-sm cs-absolute"
                            onClick={() => recoverImage(value.uniqueid, img.uniqueid)}
                          >
                            Recover
                          </button>
                        )}
                      </div>
                    ))}
                    
                    {/* Show newly uploaded images if any */}
                    {image[value.uniqueid]?.map((img, index) => (
                      <div key={`local-${index}`} className="upload-box">
                        <div className="image-preview-container">
                          <div className="image-preview">
                            <img src={img.preview} alt="Uploaded" />
                          </div>
                        </div>
                        <button
                          type="button"
                          className="btn btn-danger btn-sm cs-absolute"
                          onClick={() => handleRemoveImage(value.uniqueid, index)}
                        >
                          Remove
                        </button>
                      </div>
                    ))}

                    {/* Always show the upload box */}
                    <div
                      className="upload-box"
                      onClick={() => fileInputRef.current[value.uniqueid]?.click()}
                    >
                      <img src="/assets/img/camera.svg" alt="Camera Icon" className="camera-icon" />
                      <p>Upload Photos</p>
                    </div>

                    <input
                      id={`file-upload-${value.uniqueid}`}
                      ref={(el) => (fileInputRef.current[value.uniqueid] = el)}
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={(e) => handleImageUpload(e, value.uniqueid)}
                      className="file-input"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ServiceAccordian;
