import { useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deleteService } from "../../../../services/ServicesService";
import { handleDeleteService } from "../../../../redux/ServiceDataSlice";
import { handleDeleteServiceFromCustomer } from "../../../../redux/AdminDataSlice";
import { toast } from "react-toastify";
import Spinner from "../../../shared/Loader/Spinner";

const DeleteServiceModal = ({ serviceid, proposalid }) => {
    const [loading, setLoading] = useState(false); // State for managing loader
    const clsModal = useRef();
    const dispatch = useDispatch();

    const rawProposalData = useSelector((state) => state.ServiceDataSlice.proposal);

    const deleteServiceFunc = async () => {
        try {
            setLoading(true); // Start loader
            const filteredProposal = rawProposalData?.find((value) => value.uniqueid === proposalid);
            const dataObject = {
            proposalid,
            serviceid,
            customerid: filteredProposal?.customer,
            propertyid: filteredProposal?.property,
            };

            const response = await deleteService(dataObject);
            if (response.success) {
            // Dispatch actions to update Redux state
            dispatch(handleDeleteService(dataObject));
            dispatch(handleDeleteServiceFromCustomer(dataObject));
            const modalInstance = bootstrap.Modal.getInstance(document.getElementById('delete'));
            modalInstance.hide();
            toast.success(`Service Deleted Successfully!`);
            } else {
            // Handle API error
            console.error("Failed to delete service:", response.message || "Unknown error");
            }
        } catch (error) {
            console.error("An error occurred while deleting the service:", error);
        } finally {
            setLoading(false); // Stop loader
        }
    };

    return (
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
                        Are you sure you want to delete this service?
                        </h1>
                        <button
                        type="button"
                        className="btn-close"
                        data-bs-dismiss="modal"
                        aria-label="Close"
                        ref={clsModal}
                        disabled={loading} // Disable button during loading
                        ></button>
                    </div>
                    <div className="modal-body">
                        <p>Deleting this service is permanent and cannot be undone.</p>
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
                        onClick={deleteServiceFunc}
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
    );
};

export default DeleteServiceModal;
