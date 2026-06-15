import React from 'react'
import { Navigate } from 'react-router-dom'
const protectedRoute = ({user,loading,children}) => {
    if(loading){
        return (
            <div className='min-h-screen flex items-center justify-center h-screen bg-black text-white'>
                loading...
                <div className='w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin mt-4'></div>
            </div>
        )
    }
    if(!user){
        return (
            <Navigate to="/login" replace />
        )
    }
  return children;
}

export default protectedRoute
