import { useSelector } from "react-redux";
import DataTable from "./DataTable"
import { useState } from "react";
import DeleteProposalModal from "../Proposal/Helper/DeleteProposalModal";
import Filter from "../../shared/Filter/Filter";
import * as XLSX from 'xlsx';
import { formatDate } from "../../../utils/formatDate";

const ActiveOverview = () => {

    const [selectedProposal, setSelectedProposal] = useState({});
    const [searchQuery, setSearchQuery] = useState('');
    const [activeFilters, setActiveFilters] = useState([]);

    const customerDetail = useSelector((state) => state.AdminDataSlice.customers) || [];
    const proposalDetail = useSelector((state) => state.ServiceDataSlice.proposal) || [];

    const onDelete = (proposal) => {
        setSelectedProposal(proposal);
    };


    const extractCustomerDetail = (proposal) => {
        if (customerDetail?.length >= 1 && proposal?.customer) {
            return customerDetail?.find(value => value.uniqueid === proposal?.customer) || {};
        }
        return {};
    };

    const exportToExcel = () => {
        // Map the data to the format you want in the Excel file
        const dataToExport = proposalDetail.map((proposal) => {
            const customerData = extractCustomerDetail(proposal);
            const { personalDetails } = customerData;

            return {
                'Name': personalDetails?.firstName || 'N/A',
                'Created Date': formatDate(proposal.createDate) || 'N/A',
                'Proposal ID': proposal.uniqueid || 'N/A',
                'Email Address': personalDetails?.email || 'N/A',
                Status: proposal.status?.type || 'N/A',
            };
        });

        // Create a new worksheet
        const worksheet = XLSX.utils.json_to_sheet(dataToExport);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Proposals');

        // Export to Excel file
        XLSX.writeFile(workbook, 'Proposals.xlsx');
    };

    const applyFilters = (filters) => {
        setActiveFilters(filters);
        };
    
        const filteredProposals = () => {
        let proposals = [...proposalDetail];
    
        if (activeFilters.includes('az')) {
            proposals.sort((a, b) => {
            const customerA = extractCustomerDetail(a).personalDetails?.firstName || '';
            const customerB = extractCustomerDetail(b).personalDetails?.firstName || '';
            return customerA.localeCompare(customerB);
            });
        }
    
        if (activeFilters.includes('za')) {
            proposals.sort((a, b) => {
            const customerA = extractCustomerDetail(a).personalDetails?.firstName || '';
            const customerB = extractCustomerDetail(b).personalDetails?.firstName || '';
            return customerB.localeCompare(customerA);
            });
        }
    
        if (activeFilters.includes('dateAsc')) {
            proposals.sort((a, b) => new Date(a.createDate) - new Date(b.createDate));
        }
    
        if (activeFilters.includes('dateDesc')) {
            proposals.sort((a, b) => new Date(b.createDate) - new Date(a.createDate));
        }
    
        return proposals;
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
                                    <i class="fa-light fa-lg fa-magnifying-glass" style={{color: '#2022248c'}}></i>
                                    <input
                                            type="text"
                                            placeholder="Search"
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)} // Update search query
                                        />
                                </div>
                                <button data-bs-toggle="modal" data-bs-target="#filter" className="filter-btn bg-theme-2"><i className="fa-light fa-lg fa-filter" style={{ color: "#ffffff" }} /> filters</button>
                            </div>
                            <div className="part-1 gtc-1">
                                {/* <NavLink to='/add-proposal' className="filter-btn txt-deco-none bg-theme-1"><i class="fa-light fa-lg fa-circle-plus" style={{ color: "#ffffff" }} /> &nbsp; Add New Proposal</NavLink> */}
                                <button onClick={exportToExcel} className="filter-btn bg-theme-2"><i class="fa-light fa-lg fa-download" style={{ color: "#ffffff" }}/> &nbsp; Export</button>
                            </div>
                        </div>

                        <div className="pt-4">
                            <DataTable onDelete={onDelete} searchQuery={searchQuery} proposalDetail={filteredProposals()} />
                        </div>
                    </div>
                </div>
            </div>
        </section>
        <DeleteProposalModal proposalData={selectedProposal} />
        <Filter applyFilters={applyFilters} type={"activeOverview"} />
    </>
  )
}

export default ActiveOverview