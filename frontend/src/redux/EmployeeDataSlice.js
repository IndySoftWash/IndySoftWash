import { createSlice } from '@reduxjs/toolkit'
import axios from 'axios'

const initialState = {
    employees: [],
}

const EmployeeDataSlice = createSlice({
    name: "employeeDataSlice",
    initialState,
    reducers : {
        resetState : (state) =>{
            
        },
        handleGetEmployee : (state, action) => {
            state.employees = action.payload
        },
        handleAddEmployee : (state, action) => {
            state.employees.push(action.payload)
        },
        handleDeleteEmployee : (state, action) => {
            state.employees = state.employees.filter((item) => item.uniqueid !== action.payload)
        },
        handleUpdateEmployee : (state, action) => {
            state.employees = state.employees.map((item) => item.uniqueid === action.payload.uniqueid ? action.payload : item)
        }
    }
})

export default EmployeeDataSlice.reducer;
export const { resetState, handleGetEmployee, handleAddEmployee, handleDeleteEmployee, handleUpdateEmployee } = EmployeeDataSlice.actions