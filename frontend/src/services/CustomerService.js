import axios from 'axios'
import { API_URL } from '../utils/API_URL'
import { useDispatch } from 'react-redux'
import { handleAddCustomerDetail } from '../redux/AdminDataSlice'


const addCustomer = async(formData) => {
    const response = await axios.post(`${API_URL}/customer`, formData)
    return response.data
}

const getCustomer = async() => {
    const response = await axios.get(`${API_URL}/customer`)
    return response.data
}

const deleteCustomer = async(formData) => {
    const response = await axios.delete(`${API_URL}/customer/${formData}`)
    return response.data
}

const addProperty = async(formData) => {
    const response = await axios.post(`${API_URL}/customer/property`, formData)
    return response.data
}

const editCustomer = async(formData) => {
    const response = await axios.put(`${API_URL}/customer`, formData)
    return response.data
}

export { addCustomer, getCustomer, deleteCustomer, addProperty, editCustomer }