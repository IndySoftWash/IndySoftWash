import React, { useEffect, useRef, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

const CreateProposalModal = ({ property, onConfirmation, customerid, type }) => {

    const navigate = useNavigate()
    const openModal = useRef()

  const [selectedProperty, setSelectedProperty] = useState(null);
  const [displayData, setDisplayData] = useState([]);

  useEffect(()=>{
    if(property?.length >= 1 && type) {
      setDisplayData(property
        .filter((value) =>
          type === "create"
            ? value.proposal?.length === 0 // Filter for empty proposal array
            : type === "edit" ?
              value.proposal?.length === 1 
              :
              value
        ))
    }
  }, [property, type])

  // Handle radio button change
  const handlePropertyChange = (propertyId) => {
    setSelectedProperty(propertyId);
  };

  const navigateToProposalCreation = () => {
    navigate(`/add-proposal/${customerid}/${selectedProperty}`)
  }


  return (
    <>
      <div className="cs-modal">
        <button data-bs-toggle="modal" data-bs-target="#addProperty" ref={openModal} style={{display: 'none'}}></button>
        <div className="layout">
          {/* Header */}
          <div className="header">
            <h4>Select Property</h4>
          </div>

          {/* Body */}
          <div className="body">
            {displayData?.length >= 1  ? (
              displayData
                .map((value, index) => (
                  <div key={index} className="selection-proposal">
                    {/* Property Name */}
                    <p>{value?.propertyName}</p>

                    {/* Radio Button */}
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="propertySelection"
                        checked={selectedProperty === value.uniqueid}
                        onChange={() => handlePropertyChange(value.uniqueid)}
                      />
                    </div>
                  </div>
                ))
            ) : (
              <div className='flex-cs gap-20 my-3'>
                <p className='m-0'>No Properties Yet</p>
                <button onClick={()=>{openModal.current.click(), onConfirmation(false)}}
                  className="btn text-primary fw-700">
                  Add Property
                </button>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex-cs" style={{ textAlign: "center", marginTop: "20px" }}>
            <button
              onClick={() => onConfirmation(false)}
              className="proposal-modal-btn bg-theme-7"
            >
              Close
            </button>
            <button
              disabled={!selectedProperty}
              onClick={navigateToProposalCreation}
              className="proposal-modal-btn"
              style={{
                backgroundColor: selectedProperty ? "#007BFF" : "#ccc",
                cursor: selectedProperty ? "pointer" : "not-allowed",
              }}
            >
              Create
            </button>
          </div>
        </div>
      </div>  
    </>
  );
};

export default CreateProposalModal;
