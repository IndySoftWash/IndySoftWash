import { useState } from "react";
import { NavLink } from "react-router-dom";

const ServiceViewCard = ({ handlePreviousService, openLightbox, handleNextService, header, proposalid, selectedServiceData }) => {

  return (
    <>
      <div className="services-view-card">
        <div className="header">
          <div className="d-flex justify-content-between w-100">
            {/* Previous Button */}
            <button
              className={`btn-cs ${window.innerWidth > 767 ? '' : 'sm'}`}
              onClick={handlePreviousService}
            >
              <i className="fa-sharp-duotone fa-light fa-angles-left" /> {header?.prev}
            </button>

            {window.innerWidth >= 767 && (
              <NavLink to={`/service-detail/${proposalid}`} className={`btn`}>
                <i className="fa-regular fa-circle-plus" /> Add More Service
              </NavLink>
            )}

            {/* Next Button */}
            <button
              className={`btn-cs ${window.innerWidth > 767 ? '' : 'sm'}`}
              onClick={handleNextService}
            >
              {header?.next} <i className="fa-sharp-duotone fa-light fa-angles-right" />
            </button>
          </div>
        </div>

        <div className="section-1">
          <h4 className="font-1 text-left fw-700 font-size-24">
            {selectedServiceData?.name}
          </h4>
          <h6 className="font-1 font-size-16 fw-700">
            {selectedServiceData?.type} - {selectedServiceData?.sqft} SQFT
          </h6>
        </div>

        <div className="gallery">
          <div className="grid-cs gtc-3">
            {selectedServiceData?.images?.length !== 0 ?
              selectedServiceData?.images?.map((value, index) => (
                <img
                  key={index}
                  src={value.s3Url}
                  alt=""
                  onClick={() => openLightbox(index)} // Open lightbox on image click
                />
              )) : (
                <>
                <img src="/assets/img/no-image.jpg" alt="" />
                <img src="/assets/img/no-image.jpg" alt="" />
                <img src="/assets/img/no-image.jpg" alt="" />
                </>
              )
            }
          </div>
        </div>
      </div>
    </>
  );
};

export default ServiceViewCard;
