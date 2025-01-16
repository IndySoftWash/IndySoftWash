import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { deleteCustomer } from "../../../../services/CustomerService";
import { handleDeleteCustomerData } from "../../../../redux/ServiceDataSlice";
import { handleDeleteCustomer } from "../../../../redux/AdminDataSlice";
import { toast } from "react-toastify";
import Spinner from "../../../shared/Loader/Spinner";

const DeleteCustomerModal = ({ customerData }) => {

    const clsModal = useRef();
    const dispatch = useDispatch();
    
    const [loading, setLoading] = useState(false);
    const [displayData, setDisplayData] = useState({})

    useEffect(()=>{
        if(customerData) {
            setDisplayData(customerData)
        }
    }, [customerData])

    const deleteCustomerFunc = async() => {
        setLoading(true)
        const response = await deleteCustomer(displayData?.uniqueid)
        if(response.success) {
            dispatch(handleDeleteCustomerData({ property: displayData?.property }))
            dispatch(handleDeleteCustomer(displayData?.uniqueid))
            setLoading(false)
            toast.success(`Customer Deleted Successfully!`);
            clsModal.current?.click()
        }
    }   

  return (
    <>
        <div
            className="modal fade"
            id="delete"
            tabIndex="-1"
            aria-labelledby="exampleModalLabel"
            aria-hidden="true"
        >
            <div className="modal-dialog width-800 modal-dialog-centered">
                <div className="modal-content box-cs">
                    <div className="modal-header">
                        <h1 className="modal-title fs-5" id="exampleModalLabel">
                        Are you sure you want to delete {displayData?.personalDetails?.firstName}?
                        </h1>
                        <button
                        type="button"
                        className="btn-close"
                        data-bs-dismiss="modal"
                        aria-label="Close"
                        // ref={clsModal}
                        disabled={loading} // Disable button during loading
                        ></button>
                    </div>
                    <div className="modal-body">
                        <p>Deleting this customer is a permanent action and cannot be undone. This will also delete all associated properties, proposals, and services linked to this customer. Please confirm if you want to proceed with this action.</p>
                    </div>
                    <div className="modal-footer">
                        <button
                        type="button"
                        className="filter-btn bg-theme-7"
                        data-bs-dismiss="modal"
                        ref={clsModal}
                        disabled={loading} // Disable button during loading
                        >
                        Close
                        </button>
                        <button
                        type="button"
                        className="filter-btn bg-theme-1"
                        onClick={deleteCustomerFunc}
                        disabled={loading} // Disable button during loading
                        >
                        {loading ? (
                            <Spinner />
                        ) : (
                            "Delete"
                        )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </>
  )
}

export default DeleteCustomerModal