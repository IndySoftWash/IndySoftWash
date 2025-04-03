import { useState } from "react"
import { generateUniqueId } from "../../../../utils/UniqueIdGenerator"
import { useSelector } from 'react-redux'
import { frequencyDigitConverter } from "../../../../utils/frequencyDigitConverter"
import ToggleButton from "../../../shared/Buttons/ToggleButton"
import { formatNumberInput } from "../../../../utils/Formatter"
import { useEffect } from "react"
import { toast } from "react-toastify"
import ErrorTooltip from "../../../shared/Tooltip/ErrorTooltip"

const MultiSelector = ({ onDataChange }) => {


    const adminData = useSelector(state => state.AdminDataSlice.admin)

    const [services, setServices] = useState([])
    const [serviceToggle, setServiceToggle] = useState([true])
    const [initialValues, setInitialValues] = useState([{
        serviceItem: '',
        serviceUniqueid: generateUniqueId() || '',
        type: '',
        quantity: '',
        sqft: '',
        description: '',
        additionalInfo: [],
        frequency: [
            {
                name: 'one-off',
                price: null
            },
            {
                name: 'annual',
                price: null
            },
            {
                name: 'bi-annual',
                price: null
            },
            {
                name: 'bi-quarterly',
                price: null
            },
            {
                name: 'monthly',
                price: null
            },
            {
                name: 'bi-weekly',
                price: null
            },
            {
                name: 'quarterly',
                price: null
            }
        ],
    }])

    useEffect(()=>{
        if(adminData) {
            setServices(adminData?.customServices)
        }
    }, [adminData])

    // const handleImageUpload = (event, index) => {
    //     const files = Array.from(event.target.files); // Get all selected files
    //     const newImageFiles = files.map((file) => ({
    //         file,
    //         preview: URL.createObjectURL(file), // Generate a preview URL for the image
    //     }));
    
    //     setInitialValues((prevData) => {
    //         const updatedData = [...prevData]; // Clone the main array to avoid mutating the state
    
    //         // Ensure the object at the specified index exists
    //         if (!updatedData[index]) {
    //             updatedData[index] = {}; // Initialize the object if it doesn't exist
    //         }
    
    //         // Update the `additionalInfo` field inside the object at the specified index
    //         updatedData[index] = {
    //             ...updatedData[index], // Preserve existing properties of the object
    //             additionalInfo: updatedData[index].additionalInfo
    //                 ? [...updatedData[index].additionalInfo, ...newImageFiles] // Append new files if `additionalInfo` already exists
    //                 : newImageFiles, // Initialize with new files if `additionalInfo` doesn't exist
    //         };
    
    //         return updatedData; // Update the state with the modified array
    //     });
    // };    
    
    const handleImageUpload = (event, index) => {
        const files = Array.from(event.target.files); // Get all selected files
        const acceptedFormats = ['image/jpeg', 'image/png', 'image/svg+xml', 'image/webp'];
        const maxSize = 2 * 1024 * 1024; // 2MB in bytes
    
        // Create an array to hold valid images
        const newImageFiles = [];
    
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
    
            // Check file size
            if (file.size > maxSize) {
                toast.warn(`File ${file.name} exceeds the 2MB size limit.`);
                continue; // Skip this file
            }
    
            // Check file type
            if (!acceptedFormats.includes(file.type)) {
                toast.warn(`File ${file.name} is not an accepted format. Please upload JPEG, PNG, SVG, or WEBP.`);
                continue; // Skip this file
            }
    
            // If the file is valid, add it to the newImageFiles array
            newImageFiles.push({
                file,
                preview: URL.createObjectURL(file), // Generate a preview URL for the image
            });
        }
    
        // console.log("New Image Files:", newImageFiles); // Debugging: Check valid images
    
        setInitialValues((prevData) => {
            const updatedData = [...prevData]; // Clone the main array to avoid mutating the state
    
            // Ensure the object at the specified index exists
            if (!updatedData[index]) {
                updatedData[index] = {}; // Initialize the object if it doesn't exist
            }
    
            // Update the `additionalInfo` field inside the object at the specified index
            updatedData[index] = {
                ...updatedData[index], // Preserve existing properties of the object
                additionalInfo: updatedData[index].additionalInfo
                    ? [...updatedData[index].additionalInfo, ...newImageFiles] // Append new files if `additionalInfo` already exists
                    : newImageFiles, // Initialize with new files if `additionalInfo` doesn't exist
            };
    
            console.log("Updated Data:", updatedData); // Debugging: Check updated data
    
            return updatedData; // Update the state with the modified array
        });
    };
    
    const handleRemoveImage = (index, dataIndex) => {
        setInitialValues((prevData) => {
            // Make a deep copy of the previous data to avoid mutating state directly
            const updatedData = [...prevData];
    
            // Access the correct data object by `dataIndex` and ensure `additionalInfo` exists
            const targetAdditionalInfo = updatedData[dataIndex]?.additionalInfo || [];
    
            // Remove the image at the specified `index`
            const updatedAdditionalInfo = targetAdditionalInfo.filter((_, i) => i !== index);
    
            // Update the `additionalInfo` field for the specific object
            updatedData[dataIndex] = {
                ...updatedData[dataIndex],
                additionalInfo: updatedAdditionalInfo,
            };
    
            return updatedData; // Return the updated array
        });
    };    

    const toggleService = (event, index) => {
        if (adminData) {
            const data = services?.find((service) => service.name === event);
            if (data) {
                // Map through frequencies and update `price` for matching frequencies in `data.frequency`
                const updatedFrequencies = initialValues[index]?.frequency?.map((freq) => {
                const matchedFrequency = data?.frequency?.find((item) => item.name === freq.name);
                return {
                    ...freq,
                    price: matchedFrequency ? matchedFrequency.price : freq.price,
                    frequencyDigit: matchedFrequency ? frequencyDigitConverter[matchedFrequency.name] : frequencyDigitConverter[freq.name]
                };
                });
        
                // Update the serviceItem, type, description, and frequency for the correct index
                setInitialValues((prevValues) => {
                const updatedValues = [...prevValues]; // Copy the current state to modify it
                updatedValues[index] = {
                    ...updatedValues[index], // Preserve other properties
                    type: data?.type || '',
                    description: data?.description || '',
                    frequency: updatedFrequencies, // Update frequency
                };
        
                return updatedValues; // Return the new state with the updated values
                });
        
            }
        }
    };

    const handleFrequencyChange = (name, value, index) => {
        // Parse the value as a float, and fallback to 0 if invalid
        const parsedValue = parseFloat(value) || 0;
    
        setInitialValues((prevValues) => {
            const updatedValues = [...prevValues]; // Copy the current state to modify it
    
            // Ensure the frequency array exists for the given index
            const currentFrequencies = updatedValues[index]?.frequency || [];
    
            // Update the specific frequency by name
            const updatedFrequencies = currentFrequencies.map((freq) =>
                freq.name === name
                    ? { ...freq, price: parsedValue, frequencyDigit: frequencyDigitConverter[name] }
                    : freq
            );
    
            // Update the state with updated frequencies at the specific index
            updatedValues[index] = {
                ...updatedValues[index], // Preserve other properties
                frequency: updatedFrequencies, // Update only the frequency array
            };
    
            return updatedValues; // Return the updated state
        });
    };
    

    const getToggle = (value, index) => {
        setServiceToggle((prev) =>
            prev.map((item, idx) => (idx === index ? (value === 'auto' ? true : false) : item))
        );
    
        // Update initialValues at the specified index
        setInitialValues((prev) => {
            const updatedValues = [...prev]; // Create a copy of the current state
            updatedValues[index] = {
                ...updatedValues[index], // Preserve other properties at the given index
                type: '',  // Reset type for the specific index
                description: '',  // Reset description for the specific index
                serviceItem: '',  // Reset serviceItem for the specific index
            };
    
            return updatedValues; // Return the updated state
        });
    };

    const updateValues = (field, value, index) => {
        setInitialValues((prev) => {
            const updatedValues = [...prev]; // Create a copy of the current state
            updatedValues[index] = {
                ...updatedValues[index], // Preserve other properties at the given index
                [field] : value
            };
    
            return updatedValues; // Return the updated state
        });
    }

    useEffect(()=>{onDataChange(initialValues)}, [initialValues])

    const addServices = () => {
        setServiceToggle((prev) => [...serviceToggle, true])
        setInitialValues((prevData) => [
            ...prevData,
            {
                serviceItem: '',
                serviceUniqueid: generateUniqueId(),
                type: '',
                quantity: '',
                sqft: '',
                description: '',
                additionalInfo: [],
                frequency: [
                    {
                        name: 'one-off',
                        price: null
                    },
                    {
                        name: 'annual',
                        price: null
                    },
                    {
                        name: 'bi-annual',
                        price: null
                    },
                    {
                        name: 'bi-quarterly',
                        price: null
                    },
                    {
                        name: 'monthly',
                        price: null
                    },
                    {
                        name: 'bi-weekly',
                        price: null
                    },
                    {
                        name: 'quarterly',
                        price: null
                    }
                ],
            },
        ]);
    };
    
    const removeService = (indexToRemove) => {
        setServiceToggle((prev) => prev.filter((_, index) => index !== indexToRemove)); // Remove the toggle state for the corresponding index
    
        setInitialValues((prevData) => prevData.filter((_, index) => index !== indexToRemove)); // Remove the service entry for the corresponding index
    };    


  return (
    <>
        {
            initialValues?.length >= 0 &&
            initialValues?.map((value, index) => {
                return (
                    <>
                    <div key={index} className="box-cs mt-4">
                        <div className="row gap-20">
                            <div className="col-md-12">
                                <div className="service-header-repeater">
                                    <h4 className="font-1 fw-700">Add Service {index > 0 && index+1}</h4>
                                    <div className='toggle-section'>
                                        <ToggleButton toggle={getToggle} index={index} />
                                        {
                                            index > 0 && <button type='button' onClick={()=>removeService(index)} className='btn btn-danger'>Remove <i class="fa-solid fa-trash-can-slash" style={{color: '#fff'}} /></button>
                                        }
                                    </div>
                                </div>
                            </div>
                        <div className="col-md-8">

                            <div className="grid-cs gtc-1 pt-3">
                            <div className="gtc-3 cs-align-end grid-cs">
                                <div>
                                <div className="header">
                                    <h5 className="font-1 fw-700 font-size-16">Details :</h5>
                                </div>
                                <div className="input-section gtc-1 my-2">
                                    {
                                    serviceToggle[index] ? (
                                        <select onChange={(event)=>{updateValues('serviceItem', event.target.value, index), toggleService(event.target.value, index)}} name="serviceItem" id="">
                                        <option value="">Service item</option>
                                        {
                                            services && services?.map((service, serviceIndex) => {
                                            return (
                                                <option key={serviceIndex}>{service.name}</option>
                                            )
                                            })
                                        }
                                        </select>
                                    ) : (
                                        <input type="text" onChange={(event)=>updateValues('serviceItem', event.target.value, index)}  value={initialValues[index]?.serviceItem} placeholder='Service item' name="serviceItem" id="" />
                                    )
                                    }
                                </div>
                                </div>

                                <div>
                                <div className="input-section gtc-1 my-2">
                                    <input type="text" onChange={(event)=>updateValues('type', event.target.value, index)} disabled={serviceToggle[index]} className={serviceToggle[index] && 'input-disabled'} value={initialValues[index]?.type} placeholder='Type' name="type" id="" />
                                </div>
                                </div>

                                <div>
                                <div className="input-section gtc-1 my-2">
                                    <input type="number" value={initialValues[index]?.quantity} onChange={(event)=>updateValues('quantity', event.target.value, index)} placeholder='Quantity' name="quantity" id="" />
                                </div>
                                </div>
                            </div>
                            <div className="grid-cs gtc-1-2">
                                <div className="input-section gtc-1 my-2">
                                <input type="number"  onChange={(event)=>updateValues('sqft', event.target.value, index)} value={initialValues[index]?.sqft} placeholder='SQFT' name="sqft" id="" />
                                </div>
                                <div className="input-section gtc-1 my-2">
                                <input type="text" onChange={(event)=>updateValues('description', event.target.value, index)} disabled={serviceToggle[index]} className={serviceToggle[index] && 'input-disabled'} value={initialValues[index]?.description} placeholder='Description' name="description" id="" />
                                </div>
                            </div>
                            </div>

                        <div className="pt-3">
                            <div className="">
                                <div className="header">
                                <h5 className="font-1 fw-700 font-size-16">Additional info :</h5>
                                </div>
                                <div className="input-section grid-cs gtc-3 cs-align-end mt-2">
                                {value?.additionalInfo?.length > 0 ? 
                                    value?.additionalInfo?.map((image, imageIndex) => (
                                <div
                                    className="upload-box"
                                    onClick={() => document.getElementById('file-upload').click()}
                                >
                                    <div className="image-preview-container">
                                        <div key={imageIndex} className="image-preview">
                                            <img src={image.preview} alt="Uploaded" />
                                            <button
                                            type="button"
                                            className="btn btn-danger btn-sm cs-absolute"
                                            onClick={() => handleRemoveImage(imageIndex, index)}
                                            >
                                            Remove
                                            </button>
                                        </div>
                                        </div>
                                    </div>
                                        )) : (
                                        <>
                                        <div
                                            className="upload-box"
                                            onClick={() => document.getElementById(`file-upload-${index}`).click()}
                                        >
                                            <img
                                            src="/assets/img/camera.svg"
                                            alt="Camera Icon"
                                            className="camera-icon"
                                            />
                                            <p>Upload Photos</p>
                                            <ErrorTooltip
                                                message={"The image should be less then 2mb"}
                                                visible={ true }
                                            />
                                        </div>
                                    </>
                                    )}
                                </div>
                                <input
                                    id={`file-upload-${index}`}
                                    type="file"
                                    accept="image/*"
                                    multiple // Allow selecting multiple files
                                    onChange={(e)=>handleImageUpload(e, index)}
                                    className="file-input"
                                />
                            </div>
                        </div>

                        </div>
                        <div className="col-md-4">
                            <div className="frequency-layout">
                            <div className="content">
                                <div className="gtc-3-1 width-100">
                                <h4 className="font-1 font-size-16 fw-700">Frequency Options</h4>
                                <h4 className="font-1 font-size-16 fw-700">Price</h4>
                                </div>
                                {value?.frequency?.map((freq, freqIndex) => (
                                <div key={freqIndex}>
                                    <div className="property">
                                    <p>{freq?.name?.replace(/([A-Z])/g, ' $1')?.replace(/^./, str => str.toUpperCase())}</p>
                                    </div>
                                    <input
                                    type="number"
                                    onBlur={(e)=>formatNumberInput(e)}
                                    placeholder="$"
                                    name={freq.name}
                                    value={freq.price === 0 ? null : freq.price}
                                    onChange={(e) => handleFrequencyChange(freq.name, e.target.value, index)}
                                    />
                                </div>
                                ))}
                            </div>
                            </div>

                        </div>
                        </div>
                    </div>
                    </>
                )
            })
        }
        <div className="my-3">
            <button type="button" className="filter-btn bg-theme-2" onClick={addServices}>
                <i className="fa-light fa-xl fa-circle-plus" style={{ color: "#ffffff" }} /> &nbsp; Add Additional Service
            </button>
        </div>
    </>
  )
}

export default MultiSelector