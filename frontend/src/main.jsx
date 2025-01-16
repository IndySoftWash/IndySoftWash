import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { configureStore, combineReducers } from '@reduxjs/toolkit'
import AdminDataSlice from './redux/AdminDataSlice.js'
import ServiceDataSlice from './redux/ServiceDataSlice.js'

const rootReducer = combineReducers({ AdminDataSlice, ServiceDataSlice });
const store = configureStore({
  reducer : rootReducer
});


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Provider store={store}>
        <App />
      </Provider>
    </BrowserRouter>
  </StrictMode>,
)
