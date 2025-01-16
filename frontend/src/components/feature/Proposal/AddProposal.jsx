import { useFormik } from 'formik';
import { useEffect, useState } from 'react';
import { NavLink, useNavigate, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { generateUniqueId } from '../../../utils/UniqueIdGenerator';
import { addProposal } from '../../../services/ProposalService';
import { handleAddProposal, handleAddServices } from '../../../redux/ServiceDataSlice';
import { handleUpdateCustomerProperty } from '../../../redux/AdminDataSlice';
import { frequencyDigitConverter } from '../../../utils/frequencyDigitConverter'
import Spinner from '../../shared/Loader/Spinner';
import { toast } from 'react-toastify';
import { validationSchema } from '../../../schemas/addProposalSchema'
import MultiSelector from '../Service/Helper/MultiSelector';

const AddProposal = () => {

  const navigate = useNavigate()
  const dispatch = useDispatch()
  const param = useParams()
  const {customerId, propertyId} = param
  
  const customerData = useSelector(state => state.AdminDataSlice.customers)
  const adminData = useSelector(state => state.AdminDataSlice.admin)
  const rawProposalData = useSelector(state => state.ServiceDataSlice.proposal)
  
  const [displayData, setDisplayData] = useState({customer: {}, property: {}})
  const [isParam, setIsParam] = useState(false)
  const [propertyData, setPropertyData] = useState([])
  const [loading, setLoading] = useState(false)
  const [createDate, setCreateDate] = useState(() => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const dd = String(today.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  });
  const [initialValues, setInitialValues] = useState({
    createDate,
    uniqueid: generateUniqueId(),
    customer: '',
    status: 'created',
    property: '',
    serviceData : [],
  })

  const proposalForm = useFormik({
    // validationSchema,
    initialValues,
    onSubmit: async (formData) => {
      setLoading(true);

      // Clean serviceData
      formData.serviceData = formData.serviceData.map((service) => ({
        ...service,
        frequency: service.frequency.filter((freq) => freq.price !== null),
      }));

      const response = await addProposal(formData); // Call your API

      if (response?.success) {
        const { proposal, service } = response;
        dispatch(handleAddProposal(proposal));
        dispatch(handleAddServices(service));
        const dataObject = {
          serviceid: service?.map(service => service?.uniqueid),
          proposalid: proposal?.uniqueid,
          propertyid: proposal?.property,
          customerid: proposal?.customer,
        };
        setLoading(false);
        dispatch(handleUpdateCustomerProperty(dataObject));
        toast.success('Proposal Added Successfully!');
        navigate(`/proposal-detail/${proposal?.uniqueid}`);
      }
    },
  });

  useEffect(() => {
    if (customerId && propertyId) {
      setIsParam(true)
      const customer = customerData.find((value) => value.uniqueid === customerId);
      const property = customer?.property?.find((value) => value.uniqueid === propertyId);
      setDisplayData({customer, property});
      proposalForm.setFieldValue('customer', customer?.uniqueid)
      proposalForm.setFieldValue('property', property?.uniqueid)
      setInitialValues((prev) => ({
        ...prev,
        customer: customer?.personalDetails?.firstName || "",
        property: property?.name || "",
      }));
    }
  }, [customerId, propertyId, customerData]);
  

  const toggleProperty = (event) => {
    if(customerData) {
      setPropertyData(customerData?.find(value => value.uniqueid === event)?.property)
    }
  }

  const handleMultiSelectorChange = (serviceData) => {
    proposalForm.setFieldValue("serviceData", serviceData);
    console.log(serviceData)
  };


  return (
    <>
        <section>
            <div className="container py-4">
                <div className="row">
                    <form onSubmit={proposalForm.handleSubmit}>
                      <div className="col-md-12">
                        <div className="head-filters">
                            <div className="part-1 gtc-1">
                                <h4 className="font-1 fw-700">Add Proposal</h4>
                            </div>
                            <div className="part-1 gtc-equal mob">
                            <button type='button' className="filter-btn bg-theme-2"><i class="fa-regular fa-arrows-rotate-reverse fa-lg" style={{ color: "#ffffff" }} /> &nbsp; Reset All Fields</button>
                            <button type="submit" className="filter-btn txt-deco-none bg-theme-1">
                              {!loading ? (
                                <>
                                  <i className="fa-light fa-circle-check fa-lg" style={{ color: "#ffffff" }} /> &nbsp; Save Proposal
                                </>
                              ) : (
                                <Spinner />
                              )}
                            </button>
                            </div>
                        </div>
                        <div className="box-cs mt-4">
                          <div className="row gap-20">
                            <div className="col-md-12">
                              <div className="gtc-3 grid-cs">
                                <div>
                                  <div className="header">
                                      <h5 className="font-1 fw-700 font-size-16">Select Date</h5>
                                      {
                                        proposalForm.errors.createDate && proposalForm.touched.createDate && (<small className='text-danger'>{proposalForm.errors.createDate}</small>)
                                      }
                                  </div>
                                  <div className="input-section gtc-1 my-2">
                                      <input className={`${proposalForm.errors.createDate && proposalForm.touched.createDate && 'is-invalid'}`} type="date" value={proposalForm.values.createDate} onChange={proposalForm.handleChange}  name="createDate" id="" />
                                  </div>
                                </div>

                                <div>
                                  <div className="header">
                                      <h5 className="font-1 fw-700 font-size-16">Select Customer</h5>
                                      {
                                        proposalForm.errors.customer && proposalForm.touched.customer && (<small className='text-danger'>{proposalForm.errors.customer}</small>)
                                      }
                                  </div>
                                  <div className="input-section gtc-1 my-2">
                                  {
                                    isParam ? (
                                      <input type="text" className='input-disabled' value={displayData?.customer?.personalDetails?.firstName} name="customer" disabled id="" />
                                    ) : (
                                      <select
                                        className={`${proposalForm.errors.customer && proposalForm.touched.customer && 'is-invalid'}`}
                                        value={proposalForm.values.customer}
                                        onChange={(event)=>{proposalForm.handleChange(event), toggleProperty(event.target.value)}}
                                        name="customer"
                                      >
                                        <option value="">Select Customer</option>
                                        {customerData &&
                                          customerData.map((value, index) => (
                                            <option value={value.uniqueid} key={index}>
                                              {value.personalDetails?.firstName}
                                            </option>
                                          ))}
                                      </select>
                                    )
                                  }
                                  </div>
                                </div>

                                <div>
                                  <div className="header">
                                      <h5 className="font-1 fw-700 font-size-16">Select Property</h5>
                                      {
                                        proposalForm.errors.property && proposalForm.touched.property && (<small className='text-danger'>{proposalForm.errors.property}</small>)
                                      }
                                  </div>
                                  <div className="input-section gtc-1 my-2">
                                    {isParam ? (
                                      <input
                                        type="text"
                                        className="input-disabled"
                                        value={displayData?.property?.propertyName}
                                        name="property"
                                        disabled
                                        id=""
                                      />
                                    ) : (
                                      <select
                                        className={`${proposalForm.errors.property && proposalForm.touched.property ? 'is-invalid' : ''}`}
                                        value={proposalForm.values.property} // Bind directly to the uniqueid stored in Formik
                                        onChange={(e) => proposalForm.setFieldValue("property", e.target.value)} // Update only the uniqueid in Formik
                                        name="property"
                                      >
                                        <option value="">Select Property</option>
                                        {propertyData &&
                                          propertyData.map((value, index) => {
                                            if (value.proposal?.length === 0) {
                                              return (
                                                <option value={value?.uniqueid} key={index}>
                                                  {value?.propertyName}
                                                </option>
                                              );
                                            }
                                            return null; // Ensure nothing is returned if the condition isn't met
                                          })}
                                      </select>
                                    )}
                                  </div>

                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <MultiSelector onDataChange={handleMultiSelectorChange} />
                      </div>
                    </form>
                </div>
            </div>
        </section>
    </>
  )
}

export default AddProposal