import { createSlice } from '@reduxjs/toolkit'
import axios from 'axios'

const initialState = {
    manageSidebar: false,
    customers: [],
    admin: {}
}

const AdminDataSlice = createSlice({
    name: "adminDataSlice",
    initialState,
    reducers : {
        resetState : (state) =>{
            
        },
        handleAddCustomerDetail : (state, action) => {
            state.customers.push(action.payload)
        },
        handleSidebar : (state, action) => {
            state.manageSidebar = action.payload
        },
        handleGetCustomer : (state, action) => {
            // console.log(action.payload)
            state.customers = action.payload
        },
        handleGetAdmin : (state, action) => {
            // console.log(action.payload)
            state.admin = action.payload
        },
        handleUpdateCustomerProperty: (state, action) => {
            const { customerid, propertyid, proposalid, serviceid } = action.payload;
        
            // Return a new customers array with updated customer properties
            state.customers = state.customers?.map(customer => {
                if (customer.uniqueid === customerid) {
                    // Update the property inside the customer
                    const updatedProperties = customer.property?.map(property => {
                        if (property.uniqueid === propertyid) {
                            // Initialize services and proposals if they don't exist
                            const updatedServices = property.services ? [...property.services] : [];
                            const updatedProposals = property.proposals ? [...property.proposals] : [];
        
                            // Add serviceid to services array if it's provided and unique
                            if (Array.isArray(serviceid)) {
                                serviceid.forEach(service => {
                                    if (service && !updatedServices.includes(service)) {
                                        updatedServices.push(service);
                                    }
                                });
                            }
        
                            // Add proposalid to proposals array if it's provided and unique
                            if (proposalid && !updatedProposals.includes(proposalid)) {
                                updatedProposals.push(proposalid);
                            }
        
                            // Return the updated property
                            return {
                                ...property,
                                services: updatedServices,
                                proposal: updatedProposals,
                            };
                        }
                        return property; // Return the unchanged property
                    });
        
                    // Return the updated customer object
                    return {
                        ...customer,
                        property: updatedProperties,
                    };
                }
                return customer; // Return the unchanged customer
            });
        },        
        handleAddCustomService : (state, action) => {
            state.admin?.customServices?.push(action.payload)
        },
        handleAddService: (state, action) => {
            const { customerid, propertyid, serviceid } = action.payload;
        
            // Find the index of the customer in the state
            const customerIndex = state.customers?.findIndex(cust => cust.uniqueid === customerid);
        
            if (customerIndex !== -1) {
                const customer = state.customers[customerIndex];
        
                // Find the index of the property in the customer's properties
                const propertyIndex = customer.property?.findIndex(prop => prop.uniqueid === propertyid);
        
                if (propertyIndex !== -1) {
                    // Update the property services immutably
                    const updatedProperties = customer.property.map((prop, index) =>
                        index === propertyIndex
                            ? {
                                ...prop,
                                services: [...(prop.services || []), serviceid]
                            }
                            : prop
                    );
        
                    // Update the customer immutably
                    const updatedCustomers = state.customers.map((cust, index) =>
                        index === customerIndex
                            ? {
                                ...cust,
                                property: updatedProperties
                            }
                            : cust
                    );
        
                    // Return the updated state
                    state.customers = updatedCustomers;
                }
            }
        },
        handleDeleteServiceFromCustomer: (state, action) => {
            const { serviceid, customerid, propertyid } = action.payload;
        
            // Find the customer by `customerid`
            state.customers = state.customers?.map((customer) => {
                if (customer.uniqueid === customerid) {
                    return {
                        ...customer,
                        property: customer.property?.map((property) => {
                            if (property.uniqueid === propertyid) {
                                return {
                                    ...property,
                                    services: property.services?.filter((service) => service !== serviceid),
                                };
                            }
                            return property;
                        }),
                    };
                }
                return customer;
            });
        },
        handleDeleteCustomer: (state, action) => {
            const { payload } = action;
            state.customers = state.customers?.filter(value => value.uniqueid !== payload);
        },
        handleDeleteCustomService: (state, action) => {
            const { payload } = action;
            state.admin.customServices = state.admin.customServices?.filter(
                (value) => value.uniqueid !== payload
            );
        },
        handleDeleteProposalFromCustomer: (state, action) => {
            const { customerid, propertyid, serviceid, proposalid } = action.payload;
            // console.log("i am admindataslice", action.payload)

        
            // Find the customer
            const customer = state.customers?.find(customer => customer.uniqueid === customerid);
            if (customer) {
                // Find the property
                const property = customer.property?.find(property => property.uniqueid === propertyid);
                if (property) {
                    // Remove the proposal ID from the proposals array
                    property.proposal = property.proposal?.filter(id => id !== proposalid);
        
                    // Remove the service IDs from the services array
                    property.services = property.services?.filter(service => !serviceid.includes(service));
                }
            }
        },
        handleAddProperty: (state, action) => {
            const {
                customerid,
                uniqueid,
                propertyName,
                property,
                buildings,
                units,
                billingAddress,
                propertyFeatures,
                serviceAddress,
                propertyType,
                note
            } = action.payload;
        
            const propertyData = {
                uniqueid,
                propertyName,
                property,
                billingAddress,
                serviceAddress,
                note,
                buildings,
                units,
                propertyType,
                propertyFeatures,
                proposal: [],
                services: []
            };
        
            // Update the customer with the new property without mutating the state directly
            state.customers = state.customers.map(customer => 
                customer.uniqueid === customerid
                    ? {
                        ...customer, // Spread the existing customer data
                        property: customer.property ? [...customer.property, propertyData] : [propertyData] // Push new property to property array
                    }
                    : customer // Return other customers unchanged
            );
        },
        handleUpdateCustomer: (state, action) => {
            const { uniqueid, ...updatedData } = action.payload; // Destructure payload
            state.customers = state.customers.map((customer) =>
                customer.uniqueid === uniqueid
                    ? { ...customer, ...updatedData } // Update matching customer
                    : customer // Keep others unchanged
            );
        },
        handleUpdateCustomService: (state, action) => {
            const updatedService = action.payload; // The new service data from the action payload
            const { uniqueid } = updatedService; // Extract uniqueid from the payload
        
            if (state.admin?.customServices) {
                state.admin.customServices = state.admin.customServices.map(service =>
                    service.uniqueid === uniqueid ? { ...service, ...updatedService } : service
                );
            }
        },                                  
        handleUpdateProfile: (state, action) => {
            const profileData = action.payload;
            state.admin = {
                ...state.admin, // Spread existing admin data
                ...profileData  // Update with new data from the payload
            };
        },                                       
        handleUpdateProfileImage: (state, action) => {
            const {profileImage} = action.payload;
            console.log(action.payload)
            state.admin = {
                ...state.admin, // Spread existing admin data
                profileImage  // Update with new data from the payload
            };
        }                                          
    }
})

export default AdminDataSlice.reducer;
export const { resetState, handleAddCustomerDetail, handleUpdateProfileImage, handleUpdateProfile, handleUpdateCustomService, handleUpdateCustomer, handleAddProperty, handleDeleteProposalFromCustomer, handleDeleteCustomer, handleDeleteCustomService, handleDeleteServiceFromCustomer, handleAddService, handleAddCustomService, handleGetAdmin,handleUpdateCustomerProperty, handleSidebar, handleGetCustomer } = AdminDataSlice.actions