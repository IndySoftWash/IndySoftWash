import ProposalCard from "./Helper/ProposalCard"
import CustomerDetailRepeater from './Helper/CompanyDetailRepeater'
import { NavLink, useNavigate, useParams } from 'react-router-dom'
import { useSelector } from "react-redux"
import { useEffect, useState } from "react"
import CreateProposalModal from "./Helper/CreateProposalModal"
import AddPropertyModal from "./Helper/AddPropertyModal"

const CustomerDetail = () => {

    const param = useParams();
    const { id } = param
    const navigate = useNavigate()

    const [displayData, setDisplayData] = useState({})
    const [addProposalPopup, setAddProposalPopup] = useState({state: false, type: ''})

    const customerDetail = useSelector(state => state.AdminDataSlice.customers)
    
    
    useEffect(()=>{
        if(customerDetail) {
            const sanitizeCustomer = customerDetail?.filter(value => value.uniqueid === id)
            // console.log("sanitizeCustomer",sanitizeCustomer[0] )
            setDisplayData(sanitizeCustomer[0])
        }
    }, [customerDetail])

    const onConfirmation = () => {
        setAddProposalPopup(false)
    }

  return (
    <>
        <section>
            <div className="container py-4">
                <div className="row">
                    <div className="col-md-12">
                        <div className="head-filters">
                            <div className="part-1 gtc-1">
                                <h4 className="font-1 fw-700">{displayData?.personalDetails?.company}</h4>
                            </div>
                            <div className="part-1  gtc-3">
                                <button onClick={()=>navigate(`/add-customer/${id}`)} className="filter-btn txt-deco-none bg-theme-7"><i className="fa-solid  fa-sm fa-pen" style={{ color: "#fff" }} /> &nbsp; Edit {displayData?.personalDetails?.firstName}</button>
                                <button data-bs-toggle="modal" data-bs-target="#addProperty" className="filter-btn txt-deco-none bg-theme-3"><i class="fa-light fa-lg fa-circle-plus" style={{ color: "#ffffff" }} /> &nbsp; Add More Property</button>
                                {/* <button onClick={()=>setAddProposalPopup({state: true, type: 'edit'})} className="filter-btn txt-deco-none bg-theme-2"><i className="fa-solid  fa-sm fa-pen" style={{ color: "#fff" }} /> &nbsp; Edit Proposal</button> */}
                                <button onClick={()=>setAddProposalPopup({state: true, type: 'create'})} className="filter-btn txt-deco-none bg-theme-1"><i class="fa-light fa-lg fa-circle-plus" style={{ color: "#ffffff" }} /> &nbsp; Create Proposal</button>
                            </div>
                        </div> 

                        <div className="pt-4">
                            <div className="box-cs">
                                <div className="row">
                                    <div className="col-md-6">
                                        <div className="content-layout">
                                            <div className="head-filters mob">
                                                <div className="part-1 gtc-1">
                                                    <h4 className="font-1 fw-700">Personal Details</h4>
                                                </div>
                                                {/* <div className="part-1  gtc-1">
                                                    <button className="btn edit-btn"><i className="fa-solid  fa-sm fa-pen" style={{ color: "#fff" }} /></button>
                                                </div> */}
                                            </div> 

                                            <div className="data py-4">
                                                <div><p className="font-3 text-dark">Full Name :</p>  <p className="font-3">{displayData?.personalDetails?.firstName}</p></div>
                                                <div><p className="font-3 text-dark"> Phone No. :</p>  <p className="font-3">{displayData?.personalDetails?.phone}</p></div>
                                                <div><p className="font-3 text-dark">Email Address :</p>  <p className="font-3">{displayData?.personalDetails?.email}</p></div>
                                            </div>
                                        </div>

                                        <div className="content-layout mt-4">
                                            <div className="head-filters mob">
                                                <div className="part-1 gtc-1">
                                                    <h4 className="font-1 fw-700">Additional Contact info :</h4>
                                                </div>
                                                {/* <div className="part-1  gtc-1">
                                                    <button className="btn edit-btn"><i className="fa-solid  fa-sm fa-pen" style={{ color: "#fff" }} /></button>
                                                </div> */}
                                            </div> 

                                            <div className="data cs-border-bottom py-4">
                                                <div><p className="font-3 text-dark">Full Name :</p> <p className="font-3">{displayData?.additionalContact?.detail1?.fullname || 'N/A'}</p></div>
                                                <div><p className="font-3 text-dark">Phone :</p> <p className="font-3">{displayData?.additionalContact?.detail1?.phone || 'N/A'}</p></div>
                                                <div><p className="font-3 text-dark">Email :</p> <p className="font-3">{displayData?.additionalContact?.detail1?.email || 'N/A'}</p></div>
                                            </div>

                                            <div className="data py-4">
                                                <div><p className="font-3 text-dark">Full Name :</p> <p className="font-3">{displayData?.additionalContact?.detail2?.fullname || 'N/A'}</p></div>
                                                <div><p className="font-3 text-dark">Phone :</p> <p className="font-3">{displayData?.additionalContact?.detail2?.phone || 'N/A'}</p></div>
                                                <div><p className="font-3 text-dark">Email :</p> <p className="font-3">{displayData?.additionalContact?.detail2?.email || 'N/A'}</p></div>
                                            </div>

                                            <div className="head-filters mob pt-4">
                                                <div className="part-1 gtc-1">
                                                    <h4 className="font-1 fw-700">Preferred Contact Method :</h4> 
                                                    <p className="font-3" >{displayData?.contactMethod}</p>
                                                </div>
                                            </div> 
                                        </div>

                                        <div className="content-layout mt-4">
                                            <div className="head-filters mob">
                                                <div className="part-1 gtc-1">
                                                    <h4 className="font-1 fw-700">Images/blueprint Uploaded</h4>
                                                </div>
                                            </div> 

                                            <div className="grid-cs gtc-3 py-4">
                                                {displayData?.images?.map((img, index) => (
                                                    <div className="width-100" key={index}>
                                                        <img className="width-100 br-11" src={img.s3Url} alt="" />
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="content-layout mt-4">
                                            <div className="head-filters mob">
                                                <div className="part-1 gtc-1">
                                                    <h4 className="font-1 fw-700">Additional Notes</h4>
                                                </div>
                                            </div> 

                                            <div className="data py-4">
                                                <div><p className="font-3">{displayData?.additionalNotes}</p></div>
                                            </div>

                                        </div>

                                    </div>
                                    <div className="col-md-5 ">
                                        <CustomerDetailRepeater data={displayData?.property} customerId={{id}} />
                                    </div>

                                    <div className="col-md-6 pt-5">
                                        <ProposalCard customerid={displayData?.uniqueid} />
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
        { addProposalPopup?.state && (<CreateProposalModal customerid={id} property={displayData?.property} type={addProposalPopup?.type} onConfirmation={onConfirmation} />) }
        <AddPropertyModal customerid={id} />
    </>
  )
}

export default CustomerDetail