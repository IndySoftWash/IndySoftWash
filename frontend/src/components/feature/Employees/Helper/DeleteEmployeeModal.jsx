import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import Spinner from "../../../shared/Loader/Spinner";
import { deleteEmployee } from "../../../../services/EmployeeService";
import { handleDeleteEmployee } from "../../../../redux/EmployeeDataSlice";

const DeleteEmployeeModal = ({ employeeData }) => {

    const clsModal = useRef(null);
    const dispatch = useDispatch();

    const [loading, setLoading] = useState(false);
    const [displayData, setDisplayData] = useState({})

    useEffect(()=>{
        if(employeeData) {
            setDisplayData(employeeData)
        }
    }, [employeeData])

    const deleteEmployeeFunc = async() => {
        setLoading(true)
        const response = await deleteEmployee(displayData?.uniqueid)
        if(response.success) {
            dispatch(handleDeleteEmployee(displayData?.uniqueid))
            setLoading(false)
            const modalInstance = bootstrap.Modal.getInstance(document.getElementById('delete'));
            modalInstance.hide();
            toast.success(`Employee Deleted Successfully!`);
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
                        Are you sure you want to delete {displayData?.firstName}?
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
                        <p>Deleting this Employee is a permanent action and cannot be undone.</p>
                    </div>
                    <div className="modal-footer">
                        <button
                        type="button"
                        id="closeModal"
                        className="filter-btn bg-theme-7"
                        data-bs-dismiss="modal"
                        // ref={clsModal}
                        disabled={loading} // Disable button during loading
                        >
                        Close
                        </button>
                        <button
                        type="button"
                        className="filter-btn bg-theme-1"
                        onClick={deleteEmployeeFunc}
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

export default DeleteEmployeeModal