import axios from 'axios'
import { API_URL } from '../utils/API_URL'

const getAdmin = async() => {
    const response = await axios.get(`${API_URL}/admin`)
    return response.data
}

const login = async(formData) => {
    const response = await axios.post(`${API_URL}/admin`, formData)
    return response.data
}

const changePassword = async(formData) => {
    const ID = localStorage.getItem('ddlj')
    const response = await axios.post(`${API_URL}/admin/password`, formData, { headers: { Authorization: ID } })
    return response.data
}

const updateProfile = async(formData) => {
    const ID = localStorage.getItem('ddlj')
    const response = await axios.post(`${API_URL}/admin/profile`, formData, { headers: { Authorization: ID } })
    return response.data
}

const uploadProfileImage = async(formData) => {
    const ID = localStorage.getItem('ddlj')
    const response = await axios.post(`${API_URL}/admin/profile-image`, formData, { headers: { Authorization: ID, 'Content-Type': 'multipart' } })
    return response.data
}

const resetPassword = async(formData) => {
    const response = await axios.post(`${API_URL}/admin/password/reset`, formData)
    return response.data
}

const verifyOTP = async(formData) => {
    const response = await axios.post(`${API_URL}/admin/password/verify-otp`, formData)
    return response.data
}

const sendOTP = async(formData) => {
    const response = await axios.post(`${API_URL}/admin/password/send-otp`, formData)
    return response.data
}



export { getAdmin, login, changePassword, sendOTP, verifyOTP, resetPassword, updateProfile, uploadProfileImage }