import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import { generateUniqueId } from "../../../utils/UniqueIdGenerator";
import { addCustomService, updateCustomService } from "../../../services/ServicesService";
import { useDispatch, useSelector } from "react-redux";
import { handleAddCustomService, handleUpdateCustomService } from "../../../redux/AdminDataSlice";
import Spinner from "../../shared/Loader/Spinner";
import { toast } from "react-toastify";
import { validationSchema } from '../../../schemas/addServiceSchema'
import { formatNumberInput } from "../../../utils/Formatter";

const AddService = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const param = useParams();
  const { serviceid, role } = param;

  const customServiceData = useSelector((state) => state.AdminDataSlice.admin);

  const [isEditable, setIsEditable] = useState(role !== "view");
  const [loading, setLoading] = useState(false)
  const [initialValues, setInitialValues] = useState({
    uniqueid: generateUniqueId(),
    createDate: new Date().toISOString().split("T")[0], // Generate today's date
    name: "",
    type: "",
    description: "",
    frequency: [],
  });

  useEffect(() => {
    if (serviceid && role) {
      const getService = customServiceData?.customServices?.find(
        (value) => value.uniqueid === serviceid
      );
      if (getService) {
        setInitialValues({
          ...initialValues,
          ...getService, // Populate fields from the existing service
        });
      }
      setIsEditable(role === "edit");
    }
  }, [serviceid, role, customServiceData]);

  const frequencyDigitConverter = {
    "one-off": 1,
    quarterly: 4,
    "bi-quarterly": 8,
    annual: 1,
    "bi-annual": 2,
    "bi-weekly": 26,
    monthly: 12,
  };

    const serviceForm = useFormik({
        validationSchema,
        initialValues,
        enableReinitialize: true, // Allow dynamic updates to initialValues
        onSubmit: async (formData) => {

            setLoading(true)
            if(serviceid && role) {
                const response = await updateCustomService(formData)
                if (response.success) {
                    setLoading(false)
                    toast.success('Service Updated Successfully!')
                    dispatch(handleUpdateCustomService(response?.result));
                    navigate(`/services`);
                }
            } else {
                const response = await addCustomService(formData);
                if (response.success) {
                    setLoading(false)
                    toast.success('Service Added Successfully!')
                    dispatch(handleAddCustomService(response?.result));
                    navigate(`/services`);
                }
            }
        },
    });

  const handleFrequencyChange = (name, value) => {
    const updatedFrequency = serviceForm.values.frequency.filter(
      (item) => item.name !== name
    );

    if (value) {
      updatedFrequency.push({
        name,
        price: parseFloat(value),
        frequencyDigit: frequencyDigitConverter[name],
      });
    }

    serviceForm.setFieldValue("frequency", updatedFrequency);
  };

  return (
    <>
      <section>
        <div className="container py-4">
          <div className="row">
            <form onSubmit={serviceForm.handleSubmit}>
              <div className="col-md-12">
                <div className="head-filters">
                  <div className="part-1">
                    <h4 className="font-1 fw-700">
                      {role === "view"
                        ? "View Custom Service"
                        : role === "edit"
                        ? "Edit Custom Service"
                        : "Create Custom Service"}
                    </h4>
                  </div>
                  <div className="part-1 gtc-equal mob">
                    {isEditable && (
                      <>
                        <button
                          type="button"
                          className="filter-btn bg-theme-2"
                          onClick={() => serviceForm.resetForm()}
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
                          <i
                            className="fa-light fa-circle-check fa-lg"
                            style={{ color: "#ffffff" }}
                          />{" "}
                          &nbsp; Save Service { loading && (<Spinner />) }
                        </button>
                      </>
                    )}
                  </div>
                </div>

                <div className="pt-4">
                  <div className="box-cs min-height-600">
                    <div className="gtc-equal cs-align-end grid-cs">
                      <div className="grid-cs cs-align-end gtc-equal">
                        <div>
                          <div className="header">
                            <h5 className="font-1 fw-700 font-size-16">
                              Details :
                            </h5>
                          </div>
                            {
                              serviceForm.errors.name && serviceForm.touched.name && (<small className="text-danger">{serviceForm.errors.name}</small>)
                            }
                          <div className="input-section gtc-1 my-2">
                            <input
                              type="text"
                              className={`${!isEditable ? 'input-disabled' : ''} ${serviceForm.errors.name && serviceForm.touched.name && 'is-invalid'}`}
                              placeholder="Name"
                              name="name"
                              value={serviceForm.values.name}
                              onChange={serviceForm.handleChange}
                              disabled={!isEditable}
                            />
                          </div>
                        </div>

                        <div>
                          {
                            serviceForm.errors.type && serviceForm.touched.type && (<small className="text-danger">{serviceForm.errors.type}</small>)
                          }
                          <div className="input-section gtc-1 my-2">
                            <input
                              type="text"
                              className={`${!isEditable ? 'input-disabled' : ''} ${serviceForm.errors.type && serviceForm.touched.type && 'is-invalid'}`}
                              placeholder="Type"
                              name="type"
                              value={serviceForm.values.type}
                              onChange={serviceForm.handleChange}
                              disabled={!isEditable}
                            />
                          </div>
                        </div>
                      </div>

                      <div>
                        {
                          serviceForm.errors.description && serviceForm.touched.description && (<small className="text-danger">{serviceForm.errors.description}</small>)
                        }
                        <div className="input-section gtc-1 my-2">
                          <input
                            type="text"
                            className={`${!isEditable ? 'input-disabled' : ''} ${serviceForm.errors.description && serviceForm.touched.description && 'is-invalid'}`}
                            placeholder="Service Overview"
                            name="description"
                            value={serviceForm.values.description}
                            onChange={serviceForm.handleChange}
                            disabled={!isEditable}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="pt-4">
                        <div className="service-add-layout">
                            <div className="frequency-layout bg-white">
                                <div className='content'>
                                    <div className='gtc-3-1 width-100'>
                                        <h4 className="font-1 font-size-16 fw-700">Frequency Options</h4>
                                        <h4 className="font-1 font-size-16 fw-700">Price</h4>
                                    </div>
                                    <div>
                                        <div className="property">
                                            <p>One-Off</p>
                                        </div>
                                        <input
                                            type="text"
                                            onBlur={(e) => formatNumberInput(e)}
                                            disabled={!isEditable}
                                            className={`${!isEditable ? 'input-disabled' : ''}`}
                                            value={parseFloat(serviceForm.values.frequency.find(item => item.name === 'one-off')?.price) || null}
                                            onChange={(e) => handleFrequencyChange('one-off', e.target.value)}
                                            placeholder='$'
                                            name="one-off"
                                        />
                                    </div>
                                    <div>
                                        <div className="property">
                                            <p>Annual</p>
                                        </div>
                                        <input
                                            type="text"
                                            onBlur={(e) => formatNumberInput(e)}
                                            disabled={!isEditable}
                                            className={`${!isEditable ? 'input-disabled' : ''}`}
                                            value={parseFloat(serviceForm.values.frequency.find(item => item.name === 'annual')?.price) || null}
                                            onChange={(e) => handleFrequencyChange('annual', e.target.value)}
                                            placeholder='$'
                                            name="annual"
                                        />
                                    </div>
                                    <div>
                                        <div className="property">
                                            <p>Bi-Annual</p>
                                        </div>
                                        <input
                                            type="text"
                                            onBlur={(e) => formatNumberInput(e)}
                                            disabled={!isEditable}
                                            className={`${!isEditable ? 'input-disabled' : ''}`}
                                            value={parseFloat(serviceForm.values.frequency.find(item => item.name === 'bi-annual')?.price) || null}
                                            onChange={(e) => handleFrequencyChange('bi-annual', e.target.value)}
                                            placeholder='$'
                                            name="bi-annual"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="frequency-layout bg-white">
                                <div className='content'>
                                    <div className='gtc-3-1 width-100'>
                                        <h4 className="font-1 font-size-16 fw-700">Frequency Options</h4>
                                        <h4 className="font-1 font-size-16 fw-700">Price</h4>
                                    </div>
                                    <div>
                                        <div className="property">
                                            <p>Quarterly</p>
                                        </div>
                                        <input
                                            type="text"
                                            onBlur={(e) => formatNumberInput(e)}
                                            disabled={!isEditable}
                                            className={`${!isEditable ? 'input-disabled' : ''}`}
                                            value={parseFloat(serviceForm.values.frequency.find(item => item.name === 'quarterly')?.price) || null}
                                            onChange={(e) => handleFrequencyChange('quarterly', e.target.value)}
                                            placeholder='$'
                                            name="quarterly"
                                        />
                                    </div>
                                    <div>
                                        <div className="property">
                                            <p>Bi-Quarterly</p>
                                        </div>
                                        <input
                                            type="text"
                                            onBlur={(e) => formatNumberInput(e)}
                                            disabled={!isEditable}
                                            className={`${!isEditable ? 'input-disabled' : ''}`}
                                            value={parseFloat(serviceForm.values.frequency.find(item => item.name === 'bi-quarterly')?.price) || null}
                                            onChange={(e) => handleFrequencyChange('bi-quarterly', e.target.value)}
                                            placeholder='$'
                                            name="bi-quarterly"
                                        />
                                    </div>
                                    <div>
                                        <div className="property">
                                            <p>Monthly</p>
                                        </div>
                                        <input
                                            type="text"
                                            onBlur={(e) => formatNumberInput(e)}
                                            disabled={!isEditable}
                                            className={`${!isEditable ? 'input-disabled' : ''}`}
                                            value={parseFloat(serviceForm.values.frequency.find(item => item.name === 'monthly')?.price) || null}
                                            onChange={(e) => handleFrequencyChange('monthly', e.target.value)}
                                            placeholder='$'
                                            name="monthly"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="frequency-layout bg-white">
                                <div className='content'>
                                    <div className='gtc-3-1 width-100'>
                                        <h4 className="font-1 font-size-16 fw-700">Frequency Options</h4>
                                        <h4 className="font-1 font-size-16 fw-700">Price</h4>
                                    </div>
                                    <div>
                                        <div className="property">
                                            <p>Bi-weekly</p>
                                        </div>
                                        <input
                                            type="text"
                                            onBlur={(e) => formatNumberInput(e)}
                                            disabled={!isEditable}
                                            className={`${!isEditable ? 'input-disabled' : ''}`}
                                            value={parseFloat(serviceForm.values.frequency.find(item => item.name === 'bi-weekly')?.price) || null}
                                            onChange={(e) => handleFrequencyChange('bi-weekly', e.target.value)}
                                            placeholder='$'
                                            name="bi-weekly"
                                        />
                                    </div>
                                </div>
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

export default AddService;
