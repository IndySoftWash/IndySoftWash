import { useDispatch, useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import { formatDate } from '../../../utils/formatDate';
import { useEffect, useState } from "react";
import { handleToggleStatus } from "../../../redux/ServiceDataSlice";
import { toggleStatus } from "../../../services/ProposalService";
import { toast } from "react-toastify";
import { extractCustomerDetail, extractPropertyDetail } from "../../../utils/Extractor";
import Spinner from "../../shared/Loader/Spinner";

const DataTable = ({ title, onDelete, searchQuery, proposalDetail }) => {
    const dispatch = useDispatch();

    const customerDetail = useSelector((state) => state.AdminDataSlice.customers) || [];
    // const proposalDetail = useSelector((state) => state.ServiceDataSlice.proposal) || [];

    const [displayData, setDisplayData] = useState([]);
    const [loading, setLoading] = useState({state: false, id: ''})

    useEffect(() => {
        if (proposalDetail?.length > 0) {
            // Filter proposals by active status
            const activeProposals = proposalDetail.filter((proposal) => proposal?.status?.type === "active");
            setDisplayData(activeProposals);
        }
    }, [proposalDetail, customerDetail]);

    // const extractCustomerDetail = (proposal) => {
    //     if (customerDetail?.length >= 1 && proposal?.customer) {
    //         return customerDetail?.find((value) => value.uniqueid === proposal?.customer) || {};
    //     }
    //     return {};
    // };

    const filteredData = displayData.filter((proposal) => {
        const customerData = extractCustomerDetail(customerDetail, proposal);
        const propertyData = extractPropertyDetail(customerData, proposal?.property)
        const { personalDetails } = customerData;
        const { propertyName } = propertyData

        // Check if searchQuery matches name, email, or proposal ID
        return (
            personalDetails?.firstName?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
            personalDetails?.email?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
            personalDetails?.company?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            propertyName?.toLowerCase().includes(searchQuery?.toLowerCase()) 
        );
    });

    const changeStatus = async (status, proposalid) => {
        setLoading({state: true, id: proposalid})
        const dataObject = {
            status: status,
            proposalid,
            date: Date.now(),
        };
        const response = await toggleStatus(dataObject);
        if (response?.success) {
            dispatch(handleToggleStatus(dataObject));
            setLoading({state: false, id: ''})
            toast.success("Proposal has Draft Successfully!")
        }
    };

    return (
        <div className="box-cs">
            {title && <h5 className="font-1 fw-700 font-size-16">{title}</h5>}
            <div className="custom-table py-4">
                <table>
                    <thead>
                        <tr>
                            <th>Name/Company</th>
                            <th>Property</th>
                            <th>Created Date</th>
                            <th>Proposal ID</th>
                            <th>Email Address</th>
                            <th>Status</th>
                            <th>Change Status</th>
                            <th>Edits</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredData?.length > 0 ? (
                            filteredData.map((value, index) => {
                                const customerData = extractCustomerDetail(customerDetail, value);
                                const propertyData = extractPropertyDetail(customerData, value.property)
                                const { personalDetails } = customerData;

                                return (
                                    <tr key={value.uniqueid || index}>
                                        <td>
                                            <NavLink className="txt-deco-none" to={`/proposal-detail/${value.uniqueid}`}>
                                                <div className="table-profile">
                                                    <div>
                                                        <img src="/assets/img/person.svg" alt="Profile" />
                                                        <p className="fw-700 text-start">{personalDetails?.firstName || "N/A"}</p>
                                                    </div>
                                                    <div>
                                                        <img src="/assets/img/location-2.svg" alt="Location" />
                                                        <p className="text-start">{personalDetails?.company || "N/A"}</p>
                                                    </div>
                                                </div>
                                            </NavLink>
                                        </td>
                                        <td>
                                            <p>{propertyData ? propertyData?.propertyName  : "N/A"}</p>
                                        </td>
                                        <td>
                                            <p>{value.createDate ? formatDate(value.createDate) : "N/A"}</p>
                                        </td>
                                        <td>
                                            <p>{value.uniqueid || "N/A"}</p>
                                        </td>
                                        <td>
                                            <p>{personalDetails?.email || "N/A"}</p>
                                        </td>
                                        <td>
                                            <div className="flex-cs">
                                                <div className="cs-status status-bg-active"></div>
                                                <p>{value?.status?.type || "N/A"}</p>
                                            </div>
                                        </td>
                                        <td><button onClick={() => changeStatus("past", value?.uniqueid)} className="btn btn-secondary">{loading?.state && loading?.id === value?.uniqueid ? (<Spinner />) : 'Draft'}</button></td>
                                        <td>
                                            <div className="table-profile gap-0">
                                                <div>
                                                    <NavLink to={`/proposal-detail/${value.uniqueid}`} className="btn">
                                                        <i className="fa-solid fa-lg fa-pen" style={{ color: "#00b69b" }} />
                                                    </NavLink>
                                                    <button
                                                        className="btn"
                                                        data-bs-toggle="modal"
                                                        data-bs-target="#delete"
                                                        onClick={() => onDelete(value)}
                                                    >
                                                        <i className="fa-regular fa-lg fa-trash-can" style={{ color: "#f93c65" }} />
                                                    </button>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })
                        ) : (
                            <tr>
                                <td colSpan="6" className="text-center">
                                    No data available
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default DataTable;

