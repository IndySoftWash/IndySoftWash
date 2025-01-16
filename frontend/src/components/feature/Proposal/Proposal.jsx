import { NavLink } from 'react-router-dom';
import DataTable from './Helper/DataTable';
import { useState } from 'react';
import DeleteProposalModal from './Helper/DeleteProposalModal';
import { useSelector } from 'react-redux';
import * as XLSX from 'xlsx';
import { formatDate } from '../../../utils/formatDate';
import Filter from '../../shared/Filter/Filter';

    const Proposal = () => {
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
    
        const worksheet = XLSX.utils.json_to_sheet(dataToExport);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Proposals');
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
    
        if (activeFilters.includes('active')) {
            proposals = proposals.filter((proposal) => proposal.status?.type === 'active');
        }
    
        if (activeFilters.includes('sent')) {
            proposals = proposals.filter((proposal) => proposal.status?.type === 'sent');
        }
        
        if (activeFilters.includes('past')) {
            proposals = proposals.filter((proposal) => proposal.status?.type === 'past');
        }
        if (activeFilters.includes('created')) {
            proposals = proposals.filter((proposal) => proposal.status?.type === 'created');
        }

        if (activeFilters.includes('not accepted')) {
            proposals = proposals.filter((proposal) => proposal.status?.type === 'not accepted');
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
                        <i className="fa-light fa-lg fa-magnifying-glass" style={{ color: '#2022248c' }}></i>
                        <input
                            type="text"
                            placeholder="Search by Name, Company, or Property"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        </div>
                        <button className="filter-btn bg-theme-2" data-bs-toggle="modal" data-bs-target="#filter">
                        <i className="fa-light fa-lg fa-filter" style={{ color: '#ffffff' }} /> filters
                        </button>
                        {/* <button>ok</button> */}
                    </div>
                    <div className="part-1 gtc-equal mob">
                        <NavLink to='/add-proposal' className="filter-btn txt-deco-none bg-theme-1">
                        <i className="fa-light fa-lg fa-circle-plus" style={{ color: '#ffffff' }} /> &nbsp; Add New Proposal
                        </NavLink>
                        <button onClick={exportToExcel} className="filter-btn bg-theme-2">
                        <i className="fa-light fa-lg fa-download" style={{ color: '#ffffff' }} /> &nbsp; Export
                        </button>
                    </div>
                    </div>
    
                    <div className="pt-4">
                    <DataTable searchQuery={searchQuery} onDelete={onDelete} proposalDetail={filteredProposals()} />
                    </div>
                </div>
                </div>
            </div>
            </section>
            <DeleteProposalModal proposalData={selectedProposal} />
            <Filter applyFilters={applyFilters} type={'proposal'} />
        </>
        );
    };

export default Proposal;

