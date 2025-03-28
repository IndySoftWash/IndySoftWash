import axios from 'axios';
import { BASE_URL } from '../../config';

export const updateServiceImage = async (formData, options = {}) => {
    try {
        const response = await axios.put(
            `${BASE_URL}/service/image`,
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                ...options
            }
        );
        return response.data;
    } catch (error) {
        console.error('Error updating service image:', error);
        throw error;
    }
};
