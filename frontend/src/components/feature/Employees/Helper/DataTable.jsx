import { NavLink } from "react-router-dom";
import { formatDate } from "../../../../utils/formatDate";

const DataTable = ({employeesDetail, onDelete, title}) => {
  return (
    <>
         <div className="box-cs">
            {title && <h5 className="font-1 fw-700 font-size-16">{title}</h5>}
            <div className="custom-table py-4">
                <table>
                <thead>
                    <tr>
                    <th>Name</th>
                    <th>Email Address</th>
                    <th>Created Date</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th>Edits</th>
                    </tr>
                </thead>
                <tbody>
                    {employeesDetail ?
                    employeesDetail.map((value) => (
                        <tr key={value._id}>
                        <td>
                            <NavLink className="txt-deco-none" to={`/add-employee/${value?.uniqueid}/${'view'}`}>
                            <div className="table-profile">
                                <div>
                                <img className="cs-profile-img" src={value?.profileImage?.s3Url ? value?.profileImage?.s3Url : "/assets/img/person.svg"} alt="Profile" />
                                <p className="fw-700 text-start">{value?.firstName || "N/A"}</p>
                                </div>
                            </div>
                            </NavLink>
                        </td>
                        <td>
                            <p>{value?.email || "N/A"}</p>
                        </td>
                        <td>
                            <p>{value?.createDate ? formatDate(value?.createDate) : "N/A"}</p>
                        </td>
                        <td>
                            <p>{value?.role ? value?.role : "N/A"}</p>
                        </td>
                        <td>
                            <p>{value?.status ? value?.status : "N/A"}</p>
                        </td>
                        
                        <td>
                            <div className="table-profile gap-0">
                                <div>
                                <NavLink to={`/add-employee/${value?.uniqueid}/${'edit'}`} className="btn">
                                    <i className="fa-solid fa-lg fa-pen" style={{ color: "#00b69b" }} />
                                </NavLink>
                                <button data-bs-toggle="modal" data-bs-target="#delete" onClick={()=>onDelete(value)} className="btn">
                                    <i className="fa-regular fa-lg fa-trash-can" style={{ color: "#f93c65" }} />
                                </button>
                                </div>
                            </div>
                        </td>
                        </tr>
                    ))
                    :
                    <tr>
                        <td colSpan="7" className="text-center">No data found</td>
                    </tr>
                }
                </tbody>
                </table>
            </div>
        </div>
    </>
  )
}

export default DataTable