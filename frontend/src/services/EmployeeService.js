import axios from 'axios'
import { API_URL } from '../utils/API_URL'

const getEmployees = async() => {
    const response = await axios.get(`${API_URL}/employee`)
    return response.data
}

const getEmployeeById = async(id) => {
    const response = await axios.get(`${API_URL}/employee/${id}`)
    return response.data
}


const login = async(formData) => {
    const response = await axios.post(`${API_URL}/employee/login`, formData)
    return response.data
}

const changePassword = async(formData) => {
    const ID = localStorage.getItem('ddlj')
    const response = await axios.post(`${API_URL}/employee/password`, formData, { headers: { Authorization: ID } })
    return response.data
}

const addEmployee = async(formData) => {
    const ID = localStorage.getItem('ddlj')
    const response = await axios.post(`${API_URL}/employee`, formData, { headers: { Authorization: ID, 'Content-Type': 'multipart/form-data' } })
    return response.data
}

const editEmployee = async(formData) => {
    const ID = localStorage.getItem('ddlj')
    const response = await axios.put(`${API_URL}/employee`, formData, { headers: { Authorization: ID, 'Content-Type': 'multipart/form-data' } })
    return response.data
}





export { getEmployees, getEmployeeById, login, changePassword, addEmployee, editEmployee }