import axios from 'axios'
import { API_URL } from '../utils/API_URL'


const addProposal = async (formData) => {

    try {
        const formDataMultipart = new FormData();

        // Append other fields outside of serviceData to the FormData object
        for (const key in formData) {
            if (key === 'serviceData') {
                // Handle serviceData separately
                formData[key].forEach((serviceItem, serviceIndex) => {
                    // Append all other properties of the service item as JSON
                    const { additionalInfo, ...serviceWithoutAdditionalInfo } = serviceItem;

                    // Append service data without additionalInfo
                    formDataMultipart.append(`serviceData[${serviceIndex}]`, JSON.stringify(serviceWithoutAdditionalInfo));

                    // Handle additionalInfo if it exists
                    if (additionalInfo && Array.isArray(additionalInfo)) {
                        additionalInfo.forEach((image, imageIndex) => {
                            // Append image files to the respective field
                            formDataMultipart.append(
                                `serviceData[${serviceIndex}].additionalInfo[${imageIndex}].file`,
                                image.file
                            );
                        });
                    }
                });
            } else {
                // Append other fields directly
                formDataMultipart.append(key, formData[key]);
            }
        }


        // Make the request using axios
        const response = await axios.post(`${API_URL}/service`, formDataMultipart, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        return response.data;
    } catch (error) {
        console.error('Error adding proposal:', error);
        throw error;
    }
};


const getServiceAndProposal = async() => {
    const response = await axios.get(`${API_URL}/service`)
    return response.data
}

const activeProposal = async(formData) => {
    // const response = await axios.put(`${API_URL}/service/status`, formData)
    const response = await axios.post(`${API_URL}/service/status`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data
}
const toggleStatus = async(formData) => {
    const response = await axios.put(`${API_URL}/service/status`, formData)
    return response.data
}

const deleteProposal = async(formData) => {
    const response = await axios.post(`${API_URL}/service/proposal/delete`, formData)
    return response.data
}

export { addProposal, getServiceAndProposal, toggleStatus, deleteProposal, activeProposal }