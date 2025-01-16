import React from 'react'
import { formatDate } from '../../../../utils/formatDate'

const MoreDetailModal = ({ selectedServiceData, yearCost, totalSqft }) => {
    // console.log(propertyData, proposalData, customerData)
  return (
    <>
        <div
        className="modal fade"
        id="showDetail"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
        >
            <div className="modal-dialog">
                <div className="modal-content bg-theme-1">
                        <div className="service-overview-card">
                            <div className='flex-cs cs-between'> 
                                <h4>Service Overview</h4>
                                <button
                                    type="button"
                                    className="btn-close  text-light"
                                    data-bs-dismiss="modal"
                                    aria-label="Close"
                                ></button>
                            </div>
                            <div>
                                <p>
                                {selectedServiceData?.description}
                                </p>
                            </div>
                            <div className="grid-cs gtc-equal mob">
                                <div className="tab-cs">{selectedServiceData?.sqft} <i class="fa-regular fa-xmark"></i> {selectedServiceData?.quantity} SQFT</div>
                                <div className="tab-cs">${yearCost}/Yr</div>
                            </div>
                        </div>
                </div>
            </div>
        </div>
    </>
  )
}

export default MoreDetailModal