import { createSlice } from '@reduxjs/toolkit'
import axios from 'axios'

const initialState = {
    services: [],
    proposal: [],
    itemActive: false
}

const ServiceDataSlice = createSlice({
    name: "serviceDataSlice",
    initialState,
    reducers : {
        resetState : (state) =>{
            
        },
        hanldeStatusActive: (state, action) => {
            state.itemActive = action.payload
        },
        handleGetServices : (state, action) => {
            state.services = action.payload
        },
        handleGetProposal : (state, action) => {
            state.proposal = action.payload
        },
        handleAddServices: (state, action) => {
            if (Array.isArray(action.payload)) {
                state.services = [...state.services, ...action.payload]; // Merge the new services immutably
            } else if (action.payload) {
                state.services = [...state.services, action.payload]; // Add a single service immutably
            }
        },        
        handleAddProposal : (state, action) => {
            state.proposal.push(action.payload)
        },
        handleToggleActivePlan: (state, action) => {
            const { service, frequency } = action.payload;
            // console.log("jijih",state.services?.map(value => value?.uniqueid === service))
            // console.log("action",action.payload)
        
            // Validate the payload
            if (!service || !frequency) {
                console.error("Invalid payload:", action.payload);
                return;
            }
        
            // Ensure services array exists
            if (!Array.isArray(state.services)) {
                console.error("Invalid state structure:", state);
                return;
            }
            // Update the services
            state.services = state.services.map(value => {
                if (value.uniqueid === service) {
                    return { ...value, activePlan: frequency };
                }
                return value;
            });
        },
        handleAddExtraService: (state, action) => {
            const { response, proposalid } = action?.payload;
        
            // Add the new service to the services array
            if (response) {
                state.services?.push(response);
            }
        
            // Update the proposal's services array if the proposal matches the given proposalid
            state.proposal = state.proposal?.map((proposal) => {
                if (proposal.uniqueid === proposalid) {
                    return {
                        ...proposal,
                        service: [...(proposal.service || []), response?.uniqueid],
                    };
                }
                return proposal;
            });
        },
        handleUpdateServices: (state, action) => {
            const updatedServices = action.payload; // Array of updated service objects
        
            if (!Array.isArray(updatedServices)) {
                console.error("Payload must be an array of services.");
                return;
            }
        
            // Iterate through the updated services
            updatedServices.forEach((updatedService) => {
                const index = state.services.findIndex(
                    (service) => service.uniqueid === updatedService.uniqueid
                );
        
                if (index !== -1) {
                    // Replace the old service object with the new one
                    state.services[index] = { ...updatedService };
                } else {
                    console.warn(
                        `Service with uniqueid ${updatedService.uniqueid} not found.`
                    );
                }
            });
        },        
        handleToggleStatus: (state, action) => {
            const { status, proposalid, date } = action.payload;
        
            if (!state.proposal) return; // Safeguard in case proposals are undefined
        
            // Find the index of the proposal with the given proposalid
            const proposalIndex = state.proposal.findIndex((value) => value.uniqueid === proposalid);
        
            if (proposalIndex !== -1) {
                // Create a new proposal array with the updated status
                state.proposal = state.proposal.map((proposal, index) =>
                    index === proposalIndex
                        ? {
                            ...proposal,
                            status: {
                                ...proposal.status,
                                type: status,
                                date,
                            },
                        }
                        : proposal
                );
            }
        },
        handleDeleteService: (state, action) => {
            const { serviceid, proposalid } = action.payload;
        
            // Remove the service from the `services` array
            state.services = state.services?.filter((value) => value?.uniqueid !== serviceid);
        
            // Update the `proposal` array by removing the `serviceid` from the corresponding proposal
            state.proposal = state.proposal?.map((proposal) => {
                if (proposal.uniqueid === proposalid) {
                    return {
                        ...proposal,
                        service: proposal.service?.filter((item) => item !== serviceid),
                    };
                }
                return proposal;
            });
        },
        handleDeleteCustomerData: (state, action) => {
            const { property } = action.payload;

                // Extract all proposal IDs and service IDs from the property array
                const allProposalIds = [];
                const allServiceIds = [];
                
                property?.forEach((item) => {
                    if (item.proposal?.length > 0) {
                        allProposalIds.push(...item.proposal);
                    }
                    if (item.services?.length > 0) {
                        allServiceIds.push(...item.services);
                    }
                });
                
                console.log("i am property",property?.services)
                // Filter proposals in state.proposal that are not in the extracted proposal IDs
                state.proposal = state.proposal?.filter(
                    (proposal) => !allProposalIds.includes(proposal.uniqueid)
                );
        
                // Filter services in state.services that are not in the extracted service IDs
                state.services = state.services?.filter(
                    (service) => !allServiceIds.includes(service.uniqueid)
                );
        },
        handleDeleteProposal: (state, action) => {
            const { proposalid, serviceid } = action.payload;
            console.log("i am servicedataslice", state.proposal?.filter(value => value !== proposalid))
        
            // Remove the proposal from the state
            state.proposal = state.proposal?.filter(value => value.uniqueid !== proposalid);
        
            // Remove the services from the state
            state.services = state.services?.filter(service => !serviceid.includes(service.uniqueid));
        }        
    }
})

export default ServiceDataSlice.reducer;
export const { resetState, handleAddProposal, hanldeStatusActive, handleDeleteProposal, handleDeleteCustomerData, handleToggleStatus, handleDeleteService, handleAddExtraService, handleUpdateServices, handleToggleActivePlan, handleGetProposal, handleAddServices, handleGetServices } = ServiceDataSlice.actions