import React, { useEffect } from 'react'
import { Navigate } from 'react-router-dom'

const Logout = () => {

    useEffect(()=>{
        localStorage.removeItem('ddlj')
    }, [])

  return (
    <>
        <Navigate to={'/signin'} replace />
    </>
  )
}

export default Logout