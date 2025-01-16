import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import { formatDate } from '../../../utils/formatDate'
import { useState } from "react";

const DataTable = ({ title, onDelete, customerDetail }) => {


  // const customerDetail = useSelector((state) => state.AdminDataSlice.customers);


  return (
    <div className="box-cs">
      {title && <h5 className="font-1 fw-700 font-size-16">{title}</h5>}
      <div className="custom-table py-4">
        <table>
          <thead>
            <tr>
              <th>Name/Company</th>
              <th>Created Date</th>
              <th>Property</th>
              <th>Phone No.</th>
              <th>Status</th>
              <th>Email Address</th>
              <th>Edits</th>
            </tr>
          </thead>
          <tbody>
            {customerDetail &&
              customerDetail.map((value) => (
                <tr key={value._id}>
                  <td>
                    <NavLink className="txt-deco-none" to={`/customer-detail/${value.uniqueid}`}>
                      <div className="table-profile">
                        <div>
                          <img src="/assets/img/person.svg" alt="Profile" />
                          <p className="fw-700 text-start">{value.personalDetails?.firstName || "N/A"}</p>
                        </div>
                        <div>
                          <img src="/assets/img/location-2.svg" alt="Location" />
                          <p className="text-start">{value.personalDetails?.company || "N/A"}</p>
                        </div>
                      </div>
                    </NavLink>
                  </td>
                  <td>
                    <p>{value.createDate ? formatDate(value.createDate) : "N/A"}</p>
                  </td>
                  <td>
                    <p>
                      {value.property?.length
                        ? value.property.map((item, index) => item?.propertyName || "").join(", ")
                        : "No Properties"}
                    </p>
                  </td>
                  <td>
                    <p>{value.personalDetails?.phone || "N/A"}</p>
                  </td>
                  <td>
                    <p>{value.personalDetails?.status || "N/A"}</p>
                  </td>
                  <td>
                    <p>{value.personalDetails?.email || "N/A"}</p>
                  </td>
                  <td>
                    <div className="table-profile gap-0">
                        <div>
                          <NavLink to={`/add-customer/${value.uniqueid}`} className="btn">
                            <i className="fa-solid fa-lg fa-pen" style={{ color: "#00b69b" }} />
                          </NavLink>
                          <button data-bs-toggle="modal" data-bs-target="#delete" onClick={()=>onDelete(value)} className="btn">
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
  );
};

export default DataTable;
