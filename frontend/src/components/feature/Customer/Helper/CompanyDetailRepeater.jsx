import { useNavigate } from "react-router-dom"

const CompanyDetailRepeater = ({ data, customerId }) => {

    const navigate = useNavigate()
    const {id} = customerId

  return (
    <>
        {
            data?.map((value, index) => {
                return (
                    <div key={index} className={`content-layout ${index !== 0 && 'mt-4'}`}>
                        <div className="head-filters mob">
                            <div className="part-1">
                                <h4 className="font-1 fw-700">{value.propertyName}</h4>
                            </div>
                            {/* <div className="part-1  gtc-1">
                                <button className="btn edit-btn"><i className="fa-solid  fa-sm fa-pen" style={{ color: "#fff" }} /></button>
                            </div> */}
                        </div> 

                        <div className="data py-4">
                            <div><p className="font-3 text-dark">Property Name :</p>  <p className="font-3">{value.propertyName}</p></div>
                            <div><p className="font-3 text-dark">Billing Address :</p>  <p className="font-3">{value.billingAddress}</p></div>
                            <div><p className="font-3 text-dark">Service Address :</p>  <p className="font-3">{value.serviceAddress}</p></div>
                            {/* <div><p className="font-3">Property Type</p> : {value.propertyType?.map(item=><p className="font-3">{item}</p>)}</div> */}
                            {/* <div><p className="font-3">Property Features</p> : {value.propertyFeatures?.map(item=><p className="font-3">{item}</p>)}</div> */}
                        </div>
                        <div className="mt-3">
                            <div className="head-filters mob">
                                <h4 className="font-1 font-size-16 fw-700">Property Type</h4>
                            </div> 
                            <div className="grid-cs mt-3 gtc-1">
                                {value.propertyType?.map(item=><p className="font-3">{item}</p>)}
                            </div>
                            <div className="data py-4">
                                <div><p className="font-3 text-dark">Note</p> : <p className="font-3">{value.note}</p></div>
                            </div>
                        </div>      
                        <div className="mt-3">
                            <div className="head-filters mob">
                                <h4 className="font-1 font-size-16 fw-700">Property Features</h4>
                            </div> 
                            <div className="grid-cs mt-3 gtc-1">
                                {value.propertyFeatures?.map(item=><p className="font-3">{item}</p>)}
                            </div>
                        </div>
                        {/* <div className="mt-3 flex-cs cs-justify-start">
                            {
                                value.proposal?.length === 0 ? (
                                    <button onClick={()=>navigate(`/add-proposal/${id}/${value.uniqueid}`)} className="cs-proposal-btn  bg-theme-1"><i class="fa-light fa-lg fa-circle-plus" style={{ color: "#fff" }} /></button>
                                ) : (
                                    <button className="cs-proposal-btn bg-theme-6 "><i className="fa-solid  fa-sm fa-pen" style={{ color: "#fff" }} /></button>
                                )
                            }
                        </div> */}
                    </div>
                )
            })
        }
    </>
  )
}

export default CompanyDetailRepeater