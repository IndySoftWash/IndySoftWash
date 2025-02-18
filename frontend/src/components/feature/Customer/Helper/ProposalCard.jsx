import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const ProposalCard = ({  customerid }) => {

    const navigate = useNavigate();

    // Safely extracting data from Redux store with optional chaining
    const customerDetail = useSelector((state) => state.AdminDataSlice.customers) || [];
    const proposalDetail = useSelector((state) => state.ServiceDataSlice.proposal) || [];
 
    const [displayData, setDisplayData] = useState([]);
    const [customerData, setCustomerData] = useState([]);
 
    // Ensure proposalDetail is updated correctly
    useEffect(() => {
        // Find the customer with the given customerid
        const filteredCustomer = customerDetail.find((customer) => customer.uniqueid === customerid);

        if (filteredCustomer) {
            // Extract all proposal IDs from the customer's property array
            const proposalIds = filteredCustomer.property.reduce((ids, property) => {
                if (property.proposal && Array.isArray(property.proposal)) {
                    return [...ids, ...property.proposal]; // Combine all proposal IDs
                }
                return ids;
            }, []);

            // Filter proposals based on the collected proposal IDs
            const filteredProposals = proposalDetail.filter((proposal) =>
                proposalIds.includes(proposal.uniqueid)
            );
            // console.log(filteredProposals)
            // Update state with proposals and customer data
            setDisplayData(filteredProposals);
            setCustomerData(filteredCustomer);
        } else {
            setDisplayData([]); // No proposals found
            setCustomerData(null);
        }
    }, [customerDetail, proposalDetail, customerid]);

    const extractProperty = (id) => {
        const allProperty = customerData?.property?.find(value => value.uniqueid === id)
        return allProperty
    }

  return (
    <>
        <div className="proposal-card">
            <div className="head-filters mob">
                <h4 className="font-1 text-light fw-700">Proposal Details</h4>
            </div>
            <div className="body cs my-4">
            {
                displayData && displayData.length >= 1 ? (
                    displayData.map((value, index) => {
                        const property = extractProperty(value.property); // Assuming extractProperty is defined
                        return (
                            <div className="head-filters mob pt-3" key={value.uniqueid}>
                                <div className="part-1 gtc-1">
                                    <h4>{property?.propertyName} #{index + 1} : --</h4>
                                </div>
                                <div className="part-1 gtc-1">
                                    <button
                                        className="btn text-light"
                                        onClick={() => navigate(`/proposal-detail/${value.uniqueid}`)}
                                    >
                                        <div className="flex-cs">
                                            {value?.status?.type === 'draft' ? (
                                                <div className="cs-status status-bg-draft"></div>
                                            ) : (
                                                <div className="cs-status status-bg-active"></div>
                                            )}
                                            {value?.status?.type} <i className="fa-solid fa-sm fa-pen" style={{ color: "#fff" }} />
                                        </div>
                                    </button>
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div className="body cs my-4">
                        <img src="/assets/img/exclm.svg" alt="No proposals found" />
                        <h4 className="font-1 text-light fw-700">No Proposal Found !!</h4>
                    </div>
                )
            }
            </div>
        </div>
    </>
  )
}

export default ProposalCard