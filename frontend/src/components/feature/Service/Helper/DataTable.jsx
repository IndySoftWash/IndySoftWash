import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { formatDate } from '../../../../utils/formatDate'
import { NavLink } from "react-router-dom"

const DataTable = ({ title, onDelete }) => {

    const [displayData, setDisplayData] = useState([])

    const rawServiceData = useSelector(state => state.AdminDataSlice.admin)

    useEffect(()=>{
            setDisplayData(rawServiceData?.customServices)
    }, [rawServiceData])

  return (
    <>
        <div className="box-cs">
        {title && <h5 className="font-1 fw-700 font-size-16">{title}</h5>}
        <div className="custom-table py-4">
            <table>
            <thead>
                <tr>
                <th>Service Name</th>
                <th>Created Date</th>
                <th>Service ID</th>
                <th>Type</th>
                <th>Overview</th>
                <th>Edits</th>
                </tr>
            </thead>
            <tbody>
                {displayData &&
                displayData.map((value) => (
                    <tr key={value._id}>
                    <td>
                        <NavLink className="txt-deco-none" to={`/add-service/${value.uniqueid}/${'view'}`}>
                        <div className="table-profile">
                            <div>
                            <img className="support-icon" src="/assets/img/support.svg" alt="Profile" />
                            <p className="fw-700 text-start">{value.name || "N/A"}</p>
                            </div>
                        </div>
                            {/* <p className="fw-700 text-start">{value.name || "N/A"}</p> */}
                        </NavLink>
                    </td>
                    <td>
                        <p>{value.createDate ? formatDate(value.createDate) : "N/A"}</p>
                    </td>
                    <td>
                        <p>
                        {value.uniqueid}
                        </p>
                    </td>
                    <td>
                        <p>{value.type || "N/A"}</p>
                    </td>
                    <td>
                        <p>{value.description || "N/A"}</p>
                    </td>
                    <td>
                        <div className="table-profile gap-0">
                            <div>
                            <NavLink to={`/add-service/${value.uniqueid}/${'edit'}`} className="btn">
                                <i className="fa-solid fa-lg fa-pen" style={{ color: "#00b69b" }} />
                            </NavLink>
                            <button data-bs-toggle="modal" data-bs-target="#delete" onClick={()=>onDelete(value?.uniqueid)} className="btn">
                                <i className="fa-regular fa-lg fa-trash-can" style={{ color: "#f93c65" }} />
                            </button>
                            </div>
                        </div>
                    </td>
                    </tr>
                ))}
            </tbody>
            </table>
        </div>
        </div>
    </>
  )
}

export default DataTable