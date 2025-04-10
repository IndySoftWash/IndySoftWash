//23 jan 2025

import { NavLink, useNavigate, useParams } from "react-router-dom";
import ProposalTagCard from "./Helper/ProposalTagCard";
import AgreedModal from "./Helper/AgreedModal";
import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { formatDate } from '../../../utils/formatDate'
import ServiceViewCrad from "./Helper/ServiceViewCrad";
import { activeProposal } from '../../../services/ProposalService'
import { handleToggleStatus, hanldeStatusActive } from "../../../redux/ServiceDataSlice";
import { toast } from "react-toastify";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import DownloadAgreement from "../../shared/Agreement/DownloadAgreementV2";
import MoreDetailModal from "./Helper/MoreDetailModal";
import LightBox from "./Helper/LightBox";
import { getPerCleaningCost } from "../../../utils/ArithematicCalculation";
import AddServiceImage from "./Modals/AddServiceImage";
// import ProposalTagCardv2 from "./Helper/ProposalTagCardv2";

const ProposalDetail = () => {
  const { proposalid, type } = useParams();
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const agreementRef = useRef(null)
  const addServiceImg = useRef(null)

  const rawServiceData = useSelector(state => state.ServiceDataSlice.services);
  const rawProposalData = useSelector(state => state.ServiceDataSlice.proposal);
  const rawCustomerData = useSelector(state => state.AdminDataSlice.customers);

  const [popup, setPopup] = useState(false);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [serviceImg, setServiceImg] = useState(false)
  const [serviceData, setServiceData] = useState([]);
  const [selectedServiceData, setSelectedServiceData] = useState({})
  const [propertyData, setPropertyData] = useState({});
  const [proposalData, setProposalData] = useState({});
  const [customerData, setCustomerData] = useState({});
  const [totalSqft, setTotalSqft] = useState(null)
  const [perCleaning, setPerCleaning] = useState(null)
  const [selectedFrequency, setSelectedFrequency] = useState({})
  const [tabHeader, setTabHeader] = useState({next: '', prev: ''})
  const [historyIndex, setHistoryIndex] = useState(0)
  const [loading, setLoading] = useState(false)

  const confirmation = async(state) => {
    if (state) {
      setLoading(true)
      toggleStatus_pdf()
    } else {
      setLoading(false)
      setPopup(false)
    }
  };



  useEffect(() => {
    if (proposalid && rawCustomerData && rawProposalData && rawServiceData) {
      const filteredProposal = rawProposalData?.find(value => value.uniqueid === proposalid);
      if (!filteredProposal) return; // Ensure filteredProposal exists
      
      const { customer, property, service } = filteredProposal;
      
      const filteredCustomer = rawCustomerData?.find(value => value.uniqueid === customer);
      const allServices = filteredProposal?.service;
      const filteredServices = rawServiceData?.filter(service => allServices?.includes(service?.uniqueid));
      const filteredProperty = filteredCustomer?.property?.find(value => value.uniqueid === property);
      
      if (Array.isArray(filteredServices)) {
        // Calculate totalSqft by summing up the sqft values of all objects in the service array
        const totalSqft = filteredServices?.reduce(
            (acc, curr) => acc + (parseFloat(curr.sqft) || 0),
            0 // Initialize the accumulator as 0
        );
        setTotalSqft(totalSqft) 
      }

      setProposalData(filteredProposal)
      setCustomerData(filteredCustomer || {});
      setPropertyData(filteredProperty || {});
      setServiceData(filteredServices || []);
      setSelectedServiceData(filteredServices[historyIndex])

      const sqftSum = filteredServices.reduce((acc, curr) => acc + (parseFloat(curr.sqft) || 0), 0);
      setTotalSqft(sqftSum);
    }
  }, [proposalid, rawCustomerData, rawProposalData, rawServiceData]);

  useEffect(() => {
    if(serviceImg) {
      addServiceImg.current.click()
    }
  }, [serviceImg])

  // useEffect(() => {
  //   if (Array.isArray(serviceData) && serviceData.length > 0) {
  //     const totalSqft = serviceData.reduce((acc, curr) => acc + (curr.sqft || 0), 0);
  //     setTotalSqft(totalSqft);
  //   }

  // }, [serviceData, rawServiceData]);

  useEffect(() => {
    if(selectedServiceData) {
      const getFrequency = selectedServiceData?.frequency?.find(value => value.name === selectedServiceData?.activePlan)
      setSelectedFrequency(getFrequency)
      setPerCleaning(getPerCleaningCost(getFrequency?.price, selectedServiceData?.sqft, selectedServiceData?.quantity))
    }
  }, [selectedServiceData]);

  // Find the initial index of the selected service
let getIndex = serviceData.findIndex(service => service.uniqueid === selectedServiceData.uniqueid) || 0;

// Initialize tabHeader with initial `next` and `prev` names
  useEffect(() => {
    const nextIndex = (getIndex + 1) % serviceData.length;
    const prevIndex = (getIndex - 1 + serviceData.length) % serviceData.length;

    setTabHeader({
      next: serviceData[nextIndex]?.name || serviceData[0]?.name,
      prev: serviceData[prevIndex]?.name || serviceData[serviceData.length - 1]?.name,
    });
  }, [serviceData, getIndex]);

  const generatePDF = async (input) => {
    if (!input) {
      throw new Error("Agreement element not found.");
    }
  
    // Return the promise chain
    return html2canvas(input, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
  
      // Get the dimensions of the A4 page
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
  
      // Define padding (in mm)
      const paddingTop = 10; // Top padding
      const paddingBottom = 10; // Bottom padding
  
      // Available height for content after applying padding
      const availableHeight = pdfHeight - paddingTop - paddingBottom;
  
      // Scale the canvas dimensions to match the PDF width
      const canvasWidth = canvas.width;
      const canvasHeight = canvas.height;
      const scaledHeight = (canvasHeight * pdfWidth) / canvasWidth;
  
      // Number of pages required and current position in canvas
      let yPosition = 0; // Initial Y position in the canvas
      let currentPage = 1;
  
      while (yPosition < scaledHeight) {
        // Create a canvas for the current section
        const sectionCanvas = document.createElement("canvas");
        const sectionContext = sectionCanvas.getContext("2d");
  
        sectionCanvas.width = canvasWidth;
        sectionCanvas.height = (availableHeight * canvasWidth) / pdfWidth;
  
        sectionContext.drawImage(
          canvas,
          0,
          yPosition * (canvasWidth / pdfWidth),
          canvasWidth,
          sectionCanvas.height,
          0,
          0,
          sectionCanvas.width,
          sectionCanvas.height
        );
  
        const sectionImageData = sectionCanvas.toDataURL("image/png");
  
        // Add the section image to the PDF with padding
        pdf.addImage(sectionImageData, "PNG", 0, paddingTop, pdfWidth, availableHeight);
  
        // Add a new page if more content remains
        yPosition += sectionCanvas.height / (canvasWidth / pdfWidth);
        if (yPosition < scaledHeight) {
          pdf.addPage();
          currentPage++;
        }
      }
  
      return pdf; // Return the pdf object
    }).catch((error) => {
      console.error("Error generating PDF:", error);
      throw error; // Re-throw the error to be caught by the calling function
    });
  };
  
  const handleDownloadAgreement = async () => {
    try {
      const input = agreementRef.current;
      const pdf = await generatePDF(input);
      if (pdf) {
        pdf.save("agreement.pdf");
      }
    } catch (error) {
      console.error("Error generating PDF:", error);
    }
  };
  
  const toggleStatus_pdf = async () => {
    try {
      const input = agreementRef.current;
      if (!input) {
        throw new Error("Agreement reference not found");
      }
  
      // Wait for PDF generation
      const pdf = await generatePDF(input);
      if (!pdf) {
        throw new Error("Failed to generate PDF");
      }
  
      // Create blob and wait for it
      const pdfBlob = await pdf.output("blob");
      if (!pdfBlob) {
        throw new Error("Failed to create PDF blob");
      }
  
      // Prepare FormData with the confirmed blob
      const formData = new FormData();
      formData.append('pdf', new File([pdfBlob], 'agreement.pdf', { type: 'application/pdf' }));
      formData.append('status', 'active');
      formData.append('proposalid', proposalid);
      formData.append('date', new Date().toISOString());
      formData.append('email', customerData?.personalDetails?.email);
  
      // Send the FormData to the server
      const response = await activeProposal(formData);
  
      if (response?.success) {
        dispatch(hanldeStatusActive(true));
        dispatch(handleToggleStatus({
          date: new Date(),
          proposalid,
          status: 'active'
        }));
        setLoading(false);
        setPopup(false);
        toast.success(`Your Proposal is Active and Added to Active Overview`);
      }
    } catch (error) {
      setLoading(false);
      setPopup(false)
      toast.error("Error processing agreement");
      console.error("Error sending agreement to server:", error.response?.data || error.message);
    }
  };

const handleNextService = () => {
  // Increment index and loop back to the beginning if at the last item
  getIndex = (getIndex + 1) % serviceData.length;
  setHistoryIndex(getIndex)
  // Update tabHeader with the next and previous names
  const nextIndex = (getIndex + 1) % serviceData.length;
  const prevIndex = (getIndex - 1 + serviceData.length) % serviceData.length;

  setTabHeader({
    next: serviceData[nextIndex]?.name || serviceData[0]?.name,
    prev: serviceData[prevIndex]?.name || serviceData[serviceData.length - 1]?.name,
  });

  // Update the selected service based on the new index
  const nextService = serviceData[getIndex];
  setSelectedServiceData(nextService);
};

const handlePreviousService = () => {
  // Decrement index and loop back to the last item if at the first item
  getIndex = (getIndex - 1 + serviceData.length) % serviceData.length;
  setHistoryIndex(getIndex)

  // Update tabHeader with the next and previous names
  const nextIndex = (getIndex + 1) % serviceData.length;
  const prevIndex = (getIndex - 1 + serviceData.length) % serviceData.length;

  setTabHeader({
    next: serviceData[nextIndex]?.name || serviceData[0]?.name,
    prev: serviceData[prevIndex]?.name || serviceData[serviceData.length - 1]?.name,
  });

  // Update the selected service based on the new index
  const prevService = serviceData[getIndex];
  setSelectedServiceData(prevService);
};

const openLightbox = (index) => {
  setCurrentImageIndex(index);
  setIsLightboxOpen(true);
};

const closeLightbox = () => {
  setIsLightboxOpen(false);
};

const navigateRoute = () => {
  toast.success("Proposal Saved Successfully!")
  navigate('/proposal')
}

  return (
    <>
      <section className="position-rel">
        <div className="container py-4">
          <div className="row">
            <div className="col-md-12">
              <div className="head-filters">
                <div className="part-1 gtc-1">
                  <h4 className="font-1 fw-700">{propertyData?.propertyName || "N/A"}</h4>
                  {window.innerWidth < 767 && (<button data-bs-toggle='modal' data-bs-target='#showDetail' className="filter-btn bg-theme-1">Service Overview</button>)}
                </div>
                {
                  window.innerWidth >= 767 ? (
                    <div className="part-1 gtc-4 ">
                      {proposalData?.status?.type === 'active' ? (
                        <button className="filter-btn txt-deco-none bg-theme-1">
                          <i className="fa-light fa-circle-check fa-lg" style={{ color: "#ffffff" }} />
                          &nbsp; Mark As Agreed
                        </button>
                      ) : (
                        <button onClick={() => setPopup(true)} className="filter-btn bg-theme-7-outline">
                          <div className="flex-cs">
                            <input type="checkbox" className="cs-checkbox form-check-input mt-0" />
                            &nbsp; Mark As Agreed
                          </div>
                        </button>
                      )}
                      <button onClick={handleDownloadAgreement} className="filter-btn bg-theme-7">
                        <i className="fa-thin fa-lg fa-download" style={{ color: "#ffffff" }} />
                        &nbsp; Download Agreement
                      </button>
                      <NavLink to={`/service-detail/${proposalid}`} className="filter-btn txt-deco-none bg-theme-2">
                        <i class="fa-light fa-pen-to-square fa-lg" style={{ color: "#ffffff" }} />
                        &nbsp; Edit / Overview
                      </NavLink>
                      <button onClick={navigateRoute}  className="filter-btn txt-deco-none bg-theme-1">
                        <i className="fa-light fa-circle-check fa-lg" style={{ color: "#ffffff" }} />
                        &nbsp; Save Proposal
                      </button>
                    </div>
                  ) : (
                    <div className="accordion width-100 " id="actionAccordion">
                      <div className="accordion-item cs-accordian width-100 br-none" key='one'>
                        <h2 className="accordion-header cs-accordian-head" id={`heading-one`}>
                          <button
                            className="accordion-button cs-accordian-button flex-acc-btn collapsed"
                            type="button"
                            data-bs-toggle="collapse"
                            data-bs-target={`#collapse-one`}
                            aria-expanded="false"
                            aria-controls={`collapse-one`}
                          >
                            Proposal Management Actions
                          </button>
                        </h2>
                        <div
                          id={`collapse-one`}
                          className="accordion-collapse collapse"
                          aria-labelledby={`heading-one`}
                          data-bs-parent="#actionAccordion"
                        >
                          <div className="accordion-body p-1rem">
                            <div className="accordian-content">
                              <div className="part-1 gtc-4 ">
                                {proposalData?.status?.type === 'active' ? (
                                  <button className="filter-btn txt-deco-none bg-theme-1">
                                    <i className="fa-light fa-circle-check fa-lg" style={{ color: "#ffffff" }} />
                                    &nbsp; Mark As Agreed
                                  </button>
                                ) : (
                                  <button onClick={() => setPopup(true)} className="filter-btn bg-theme-7-outline">
                                    <div className="flex-cs">
                                      <input type="checkbox" className="cs-checkbox form-check-input mt-0" />
                                      &nbsp; Mark As Agreed
                                    </div>
                                  </button>
                                )}
                                <button onClick={handleDownloadAgreement} className="filter-btn bg-theme-7">
                                  <i className="fa-thin fa-lg fa-download" style={{ color: "#ffffff" }} />
                                  &nbsp; Download Agreement
                                </button>
                                <NavLink to={`/service-detail/${proposalid}`} className="filter-btn txt-deco-none bg-theme-2">
                                  <i className="fa-regular fa-arrows-rotate-reverse fa-lg" style={{ color: "#ffffff" }} />
                                  &nbsp; Contract Overview
                                </NavLink>
                                <button onClick={navigateRoute}  className="filter-btn txt-deco-none bg-theme-1">
                                  <i className="fa-light fa-circle-check fa-lg" style={{ color: "#ffffff" }} />
                                  &nbsp; Save Proposal
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                }
              </div>

              <div className="pt-4">
                <div className="box-cs">
                  <div className="row flex-col-rev gap-20">
                    <div className="col-md-8">
                      <ProposalTagCard service={selectedServiceData} units={propertyData?.units}/>
                        {/* <ProposalTagCardv2 /> */}
                      <div className="pt-4">
                        <button ref={addServiceImg} className="hide-me" data-bs-toggle="modal" data-bs-target="#add-service-image">Add Service Image</button>
                        <ServiceViewCrad header={tabHeader} serviceImg={serviceImg} setServiceImg={setServiceImg} openLightbox={openLightbox} handlePreviousService={handlePreviousService} handleNextService={handleNextService} proposalid={proposalid} selectedServiceData={selectedServiceData} />

                          {
                            window.innerWidth < 767 && (
                              <div className="mt-2">

                                <NavLink to={`/service-detail/${proposalid}`} className={`btn-cs-2 bg-theme-2 txt-deco-none `}>
                                  <i className="fa-regular fa-circle-plus" /> Add More Service
                                </NavLink>
                              </div>
                            )
                          }
                      </div>
                    </div>
                    <div className="col-md-4 ">
                      <div className="proposal-data ">
                        <table>
                          <tbody>
                            <tr>
                              <td><p>Date  <span>:</span></p></td>
                              {/* <td><p> <span>:</span></p></td> */}
                              <td><p>{formatDate(proposalData?.createDate)}</p></td>
                            </tr>
                            <tr>
                              <td><p>No. of Units  <span>:</span></p></td>
                              {/* <td><p> <span>:</span></p></td> */}
                              <td><p>{propertyData?.units}</p></td>
                            </tr>

                            <tr>
                              <td><p>Company  <span>:</span></p></td>
                              {/* <td><p> <span>:</span></p></td> */}
                              <td><p>{propertyData?.propertyName || "N/A"}</p></td>

                            </tr>
                            <tr>
                              <td><p>Contact Name <span>:</span></p></td>
                              {/* <td><p> <span>:</span></p></td> */}
                              <td><p>{customerData?.personalDetails?.firstName}</p></td>
                            </tr>

                            <tr>
                              <td><p>Contact No <span>:</span></p></td>
                              {/* <td><p> <span>:</span></p></td> */}
                              <td><p>{customerData?.personalDetails?.phone}</p></td>
                            </tr>

                            <tr>
                              <td><p>Property Address <span>:</span></p></td>
                              {/* <td><p> <span>:</span></p></td> */}
                              <td><p>{propertyData?.serviceAddress || "N/A"}</p></td>
                            </tr>

                          </tbody>
                        </table>
                      </div>
                      <div className="pt-4">
                        <div className="service-overview-card desk-show">
                          <div><h4>Service Overview</h4></div>
                          <div className="my-3">
                            <p>
                              {selectedServiceData?.description}
                            </p>
                          </div>
                          <div className="grid-cs gtc-equal mob">
                            <div className="tab-cs">{selectedServiceData?.sqft} SQFT</div>
                            <div className="tab-cs">${(perCleaning * selectedFrequency?.frequencyDigit)?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}/Yr</div>
                          </div>
                        </div>
                      </div>
                    </div>

                  </div>
                </div>
              </div>

              {
                type && type === 'workorder' && (
                  <div className="pt-4">
                    <div className="box-cs">
                      <div className="row">
                        <div className="col-md-12">
                          <div className="header my-3">
                            <h4 className="font-1 fw-700">Work Orders List :-</h4>
                          </div>
                          <div className="grid-cs gtc-auto-max width-50">
                            {
                              serviceData?.map(value => (
                                <>
                                  <h4 className="font-1 font-size-18">{value?.name}</h4>
                                  {value?.workOrder?.status === 'created' ? (
                                    <NavLink to={`/work-order/${value?.uniqueid}/${"view"}`} className="filter-btn txt-deco-none bg-theme-1">
                                      <i className="fa-light fa-circle-check fa-lg" style={{ color: "#ffffff" }} />
                                      &nbsp; View Work Order
                                    </NavLink>
                                  ) : (
                                    <NavLink to={`/work-order/${value?.uniqueid}/${"create"}`} className="filter-btn txt-deco-none bg-theme-7-outline">
                                      <div className="flex-cs">
                                        <input type="checkbox" className="cs-checkbox form-check-input mt-0" />
                                        &nbsp; Create Work Order
                                      </div>
                                    </NavLink>
                                  )}  
                                </>
                              ))
                            }
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              }
            </div>
          </div>
        </div>
      </section>

      <AddServiceImage serviceId={selectedServiceData?.uniqueid} serviceImg={selectedServiceData?.images} />
      {popup && <AgreedModal onConfirmation={confirmation} loading={loading} />}
        <div ref={agreementRef} style={{position : 'absolute', left : '-260%', top : '28%' }}>
        <DownloadAgreement serviceData={serviceData} propertyData={propertyData} customerData={customerData} />
        </div>

        <MoreDetailModal selectedServiceData={selectedServiceData} totalSqft={totalSqft} yearCost={perCleaning * selectedFrequency?.frequencyDigit} />
        {
          isLightboxOpen && (<LightBox closeLightbox={closeLightbox} initialIndex={currentImageIndex} selectedServiceData={selectedServiceData} />)
        }
    </>
  );
};

export default ProposalDetail;
//<i class="fa-regular fa-xmark"></i> {selectedServiceData?.quantity}