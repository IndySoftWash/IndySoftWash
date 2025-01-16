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
import DownloadAgreement from "../../shared/Agreement/DownloadAgreement";
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


    const getServiceData = (data) => {
        const resultArray = convertObjectToArray(data);
        // console.log(resultArray) 
        setUpdatedData(resultArray)
    }

    const submitUpdatedServices = async() => {
        setLoading(true)
        const response = await updateServices(updatedData)
        if(response.success) {
            dispatch(handleUpdateServices(updatedData))
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
          html2canvas(input).then((canvas) => {
            const imgData = canvas.toDataURL("image/png");
            const pdf = new jsPDF("p", "mm", "a4");
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    
            pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
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
                                                    <td><p>Apartments</p></td>
                                                    <td><p>:</p></td>
                                                    <td><span>{propertyData?.units} Units</span></td>
                                                </tr>
                                                <tr>
                                                    <td><p>Company</p></td>
                                                    <td><p>:</p></td>
                                                    <td><span>{propertyData?.propertyName || "N/A"}</span></td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                    <div className="proposal-data">
                                        <table>
                                            <tbody>
                                                <tr>
                                                    <td><p>Contact Name</p></td>
                                                    <td><p>:</p></td>
                                                    <td><span>{customerData?.personalDetails?.firstName}</span></td>
                                                </tr>
                                                <tr>
                                                    <td><p>Property Address</p></td>
                                                    <td><p>:</p></td>
                                                    <td><span>{propertyData?.billingAddress || "N/A"}</span></td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                    <div className="proposal-data">
                                        <table>
                                            <tbody>
                                                <tr>
                                                    <td><p>Date</p></td>
                                                    <td><p>:</p></td>
                                                    <td><span>{formatDate(proposalData?.createDate)}</span></td>
                                                </tr>
                                                <tr>
                                                    <td><p>Contact No</p></td>
                                                    <td><p>:</p></td>
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
            <DownloadAgreement serviceData={serviceData} propertyData={propertyData} customerData={customerData} />
        </div>
    </>
)
}

export default ServiceDetail