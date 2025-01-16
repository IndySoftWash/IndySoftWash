import { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { handleDeleteCustomService } from "../../../../redux/AdminDataSlice";
import { deleteCustomService } from "../../../../services/ServicesService";
import { toast } from "react-toastify";
import Spinner from "../../../shared/Loader/Spinner";

const DeleteCustomServiceModal = ({ serviceid }) => {

    const [loading, setLoading] = useState(false); // State for managing loader
    const clsModal = useRef();
    const dispatch = useDispatch();

    const rawServiceData = useSelector((state) => state.AdminDataSlice.admin);

    const deleteServiceFunc = async() => {
        const response = await deleteCustomService(serviceid)
        if(response.success) {
            dispatch(handleDeleteCustomService(serviceid))
            toast.success(`Custom Service Deleted Successfully!`);
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
                        Are you sure you want to delete this service?
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
    </>
  )
}

export default DeleteCustomServiceModal