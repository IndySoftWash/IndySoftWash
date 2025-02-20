import { useEffect, useState } from "react";
import { getSumOfTotalCostYearly, getTotalSqft } from "../../../../utils/ArithematicCalculation";


const ServiceTagCard = ({ service, property }) => {

    const [totalSqft, setTotalSqft] = useState(null)
    const [totalCost, setTotalCost] = useState(null)

    useEffect(() => {    
        if (Array.isArray(service)) {
            
            setTotalSqft(getTotalSqft(service))
            setTotalCost(getSumOfTotalCostYearly(service))
        }
    }, [service]);    

  return (
    <>
        <div className="proposal-tag-cards">

            <div className="tag-card bg-theme-1 gap-cs-5">
                    <h4 className="font-1 text-center"><i class="fa-solid fa-sm fa-gear-complex" style={{color: "#fff"}} />  Service Analysis</h4>
                    <div className="inner-layout">
                    <p>{totalSqft} SQFT Total</p>
                    {/* <div className="form-check form-switch">
                        <input className="form-check-input cs-blue" type="checkbox" role="switch" id="flexSwitchCheckDefault" />
                    </div> */}
                    </div>
                    <div className="inner-layout">
                    <h4>Avg Cost per SQFT</h4>
                    <p>${(totalCost / totalSqft)?.toFixed(2)?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}/SQFT</p>
                    </div>
            </div>

            <div className="tag-card bg-theme-2 gap-cs-5">
                    <h4 className="font-1 text-center"><i class="fa-solid fa-hand-holding-circle-dollar" style={{color: "#fff"}} />  Investment</h4>
                    <div className="inner-layout">
                    <p>${totalCost?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} Annually</p>
                    {/* <div className="form-check form-switch">
                        <input className="form-check-input cs-orange" type="checkbox" role="switch" id="flexSwitchCheckDefault" />
                    </div> */}
                    </div>
                    <div className="inner-layout">
                    <h4>Monthly Payment</h4>
                    <p>${(totalCost / 12)?.toFixed(2)?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} PM</p>
                    </div>
            </div>

            <div className="tag-card bg-theme-3 gap-cs-5">
                    <h4 className="font-1 text-center"><i class="fa-regular fa-magnifying-glass-chart" />  Per Door Analysis</h4>
                    <div className="inner-layout">
                    <p>{[property?.units]} Units</p>
                    {/* <div className="form-check form-switch">
                        <input className="form-check-input cs-yellow" type="checkbox" role="switch" id="flexSwitchCheckDefault" />
                    </div> */}
                    </div>
                    <div className="inner-layout">
                    <h4>Per Door Investment</h4>
                    <p>${(totalCost / [property?.units])?.toFixed(2)} / Unit PM</p>
                    </div>
            </div>

        </div>
    </>
  )
}

export default ServiceTagCard