import axios from 'axios'
import { API_URL } from '../utils/API_URL'


const addWorkOrder = async(dataObject) => {
    const { formData, id } = dataObject
    const response = await axios.post(`${API_URL}/work-order/${id}`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    })
    return response.data
}

const updateWorkOrder = async(dataObject) => {
    const { formData, id } = dataObject
    const response = await axios.put(`${API_URL}/work-order/${id}`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    })
    return response.data    
}



export { addWorkOrder, updateWorkOrder }