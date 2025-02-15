import { useState } from "react";
import { NavLink } from "react-router-dom";
import DataTable from "./Helper/DataTable";
import { useSelector } from "react-redux";

const EmployeesList = () => {

  const employeeDetail = useSelector((state) => state.EmployeeDataSlice.employees);


    const [searchQuery, setSearchQuery] = useState("");
    const [selectedEmployee, setSelectedEmployee] = useState({});
    const handleSearch = (query) => {
        setSearchQuery(query);
    };
    
    const onDelete = (employee) => {
        setSelectedEmployee(employee);
    };
    
  return (
    <> 
        <section>
        <div className="container py-4">
            <div className="row">
                <div className="col-md-12">
                    <div className="head-filters">
                        <div className="part-1">
                            <div className="search-input">
                                <i
                                    className="fa-light fa-lg fa-magnifying-glass"
                                    style={{ color: "#2022248c" }}
                                ></i>
                                <input
                                    type="text"
                                    placeholder="Search"
                                    value={searchQuery} // Bind the input value to searchQuery state
                                    onChange={(e) => setSearchQuery(e.target.value)} // Update searchQuery state
                                />
                            </div>
                            <button className="filter-btn bg-theme-2" data-bs-toggle="modal" data-bs-target="#filter">
                                <i
                                    className="fa-light fa-lg fa-filter"
                                    style={{ color: "#ffffff" }}
                                />{" "}
                                filters
                            </button>
                        </div>
                        <div className="part-1 gtc-equal mob">
                            <NavLink
                                to="/add-employee"
                                className="filter-btn txt-deco-none bg-theme-1"
                            >
                                <i
                                    className="fa-light fa-lg fa-circle-plus"
                                    style={{ color: "#ffffff" }}
                                />{" "}
                                &nbsp; Add Employee
                            </NavLink>
                            <button
                                className="filter-btn bg-theme-2"
                            >
                                <i
                                    className="fa-light fa-lg fa-download"
                                    style={{ color: "#ffffff" }}
                                />
                                &nbsp; Export
                            </button>
                        </div>
                    </div>

                    <div className="pt-4">
                        <DataTable
                            employeesDetail={employeeDetail} // Pass filtered customers to DataTable
                            onDelete={onDelete}
                        />
                    </div>
                </div>
            </div>
        </div>
        </section>
    </>
  )
}

export default EmployeesList