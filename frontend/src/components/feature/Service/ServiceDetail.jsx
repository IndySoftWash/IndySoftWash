import { NavLink, useNavigate, useParams } from "react-router-dom"
import ServiceTagCard from "./Helper/ServiceTagCard"
import { useEffect, useRef, useState } from "react";
import ServiceAccordian from "./Helper/ServiceAccordian";
import { useDispatch, useSelector } from "react-redux";
import { formatDate } from "../../../utils/formatDate";
import AddServiceModal from './Helper/AddServiceModal'
import { updateServices } from "../../../services/ServicesService";
import { handleUpdateServices } from "../../../redux/ServiceDataSlice";
import DeleteServiceModal from "./Helper/DeleteServiceModal";
import Spinner from "../../shared/Loader/Spinner";
import DownloadAgreementV2 from "../../shared/Agreement/DownloadAgreementV2";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";


const ServiceDetail = () => {

    const param = useParams();
    const { proposalid } = param;
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const agreementRef = useRef()

    const rawServiceData = useSelector(state => state.ServiceDataSlice.services)
    const rawProposalData = useSelector(state => state.ServiceDataSlice.proposal)
    const rawCustomerData = useSelector(state => state.AdminDataSlice.customers);

    const [serviceData, setServiceData] = useState({})
    const [proposalData, setProposalData] = useState({})
    const [customerData, setCustomerData] = useState({})
    const [propertyData, setPropertyData] = useState({})
    const [updatedData, setUpdatedData] = useState([])
    const [deleteServiceId, setDeleteServiceId] = useState([])
    const [loading, setLoading] = useState(false)
    const [removeImage, setRemoveImage] = useState([])
    const [image, setImage] = useState([])
    const [removedFrequency, setRemovedFrequency] = useState({})

    useEffect(()=>{
        if(rawServiceData && rawProposalData) {
            const filteredProposal = rawProposalData?.find(value => value.uniqueid === proposalid)
            const allServices = filteredProposal?.service;
            const filteredServices = rawServiceData?.filter(service => allServices?.includes(service?.uniqueid));
            const filteredCustomer = rawCustomerData?.find(value => value.uniqueid === filteredProposal?.customer)
            setPropertyData(filteredCustomer?.property?.find(value => value.uniqueid === filteredProposal?.property))
            setServiceData(filteredServices)
            setCustomerData(filteredCustomer)
            setProposalData(filteredProposal)
        }
    }, [rawServiceData, rawProposalData, rawCustomerData])


    function convertObjectToArray(inputObject) {
        return Object.values(inputObject);
    }

    const extractFiles = (data) => {
        if (typeof data !== "object" || data === null) return [];
      
        return Object.values(data).flatMap((service) =>
            Object.values(service).map(({ file }) => file)
        );
    };


    const getServiceData = (data, image, removeImage, removedFrequency) => {
        const resultArray = convertObjectToArray(data);
        setImage(extractFiles(image))
        setRemoveImage(removeImage)
        setUpdatedData(resultArray)
        setRemovedFrequency(removedFrequency)
    }

    const submitUpdatedServices = async() => {
        const formData = new FormData()
        formData.append('allServices', JSON.stringify(updatedData))
        formData.append('removedImages', JSON.stringify(removeImage))
        formData.append('removedFrequency', JSON.stringify(removedFrequency))
        image?.forEach((img) => {
            formData.append('image', img)
        })

        setLoading(true)
        const response = await updateServices(formData)

        if(response.success) {

            dispatch(handleUpdateServices(response.data))
            setLoading(false)
            navigate(`/proposal-detail/${proposalid}`)
        }
    }

    const getServiceid = (id) => {
        setDeleteServiceId(id)
    }

    const handleDownloadAgreement = () => {
        const input = agreementRef.current;
      
        if (input) {
          html2canvas(input, { scale: 2 }).then((canvas) => {
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
      
            pdf.save("agreement.pdf");
          }).catch((error) => {
            console.error("Error generating PDF:", error);
          });
        }
    };
    // useEffect(()=>{
    //     console.log(serviceData)
    //     console.log(customerData)
    //     console.log(proposalData)
    //     console.log(propertyData)
    // }, [serviceData, customerData, proposalData])

return (
    <>
        <section>
            <div className="container py-4">
                <div className="row">
                    <div className="col-md-12">
                        <div className="head-filters">
                            <div className="part-1">
                                <h4 className="font-1 fw-700">{propertyData?.propertyName}</h4>
                            </div>
                            <div className="part-1 gtc-equal mob">
                            <button onClick={handleDownloadAgreement} className="filter-btn bg-theme-7"><i class="fa-thin fa-lg fa-download" style={{ color: "#ffffff" }} /> &nbsp; Download Agreement</button>
                            <button onClick={submitUpdatedServices} className="filter-btn txt-deco-none bg-theme-1"><i class="fa-light fa-circle-check fa-lg" style={{ color: "#ffffff" }} /> &nbsp; Save Proposal { loading && (<Spinner />) }</button>
                            </div>
                        </div>

                        <div className="pt-4">
                            <div className="box-cs">
                                <div className="grid-cs gtc-3">
                                    <div className="proposal-data">
                                        <table>
                                            <tbody>
                                                <tr>
                                                    <td><p>Apartments :</p></td>
                                                    {/* <td><p>:</p></td> */}
                                                    <td><span>{propertyData?.units} Units</span></td>
                                                </tr>
                                                <tr>
                                                    <td><p>Company :</p></td>
                                                    {/* <td><p>:</p></td> */}
                                                    <td><span>{propertyData?.propertyName || "N/A"}</span></td>
                                                </tr>

                                            </tbody>
                                        </table>
                                    </div>
                                    <div className="proposal-data">
                                        <table>
                                            <tbody>
                                                <tr>
                                                    <td><p>Contact Name :</p></td>
                                                    {/* <td><p>:</p></td> */}
                                                    <td><span>{customerData?.personalDetails?.firstName}</span></td>

                                                </tr>
                                                <tr>
                                                    <td><p>Property Address :</p></td>
                                                    {/* <td><p>:</p></td> */}
                                                    <td><span>{propertyData?.billingAddress || "N/A"}</span></td>
                                                </tr>

                                            </tbody>
                                        </table>
                                    </div>
                                    <div className="proposal-data">
                                        <table>
                                            <tbody>
                                                <tr>
                                                    <td><p>Date :</p></td>
                                                    {/* <td><p>:</p></td> */}
                                                    <td><span>{formatDate(proposalData?.createDate)}</span></td>
                                                </tr>

                                                <tr>
                                                    <td><p>Contact No :</p></td>
                                                    {/* <td><p>:</p></td> */}
                                                    <td><span>{customerData?.personalDetails?.phone}</span></td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                                

                                <div className="pt-5 accordian-scroll">
                                    <div className="head-filters">
                                        <div className="part-1">
                                            <h4 className="font-1 fw-700">Services Details</h4>
                                        </div>
                                    </div>
                                    <div className="pt-2 ">
                                        {
                                            propertyData && serviceData?.length >= 1 && (
                                                <ServiceAccordian onChangeData={getServiceData} getServiceid={getServiceid} property={propertyData} service={serviceData} />
                                            )
                                        }
                                        <div className="flex-cs cs-justify-end">
                                            <button data-bs-toggle="modal" data-bs-target="#exampleModal" className="filter-btn bg-theme-7"><i class="fa-light fa-lg fa-circle-plus" style={{ color: "#ffffff" }} /> Add Service</button>
                                        </div>
                                    </div>
                                </div>


                                <div className="pt-4" >
                                    <ServiceTagCard property={propertyData} service={updatedData} />
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </section>
        <DeleteServiceModal proposalid={proposalid} serviceid={deleteServiceId} />
        <AddServiceModal proposalId={proposalid} customerId={proposalData?.customer} propertyId={proposalData?.property} />
        <div ref={agreementRef} style={{position : 'absolute', left : '-260%', top : '28%' }}>
            <DownloadAgreementV2 serviceData={serviceData} propertyData={propertyData} customerData={customerData} />
            {/* <DownloadAgreement serviceData={serviceData} propertyData={propertyData} customerData={customerData} /> */}
        </div>
    </>
)
}

export default ServiceDetail