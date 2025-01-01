import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'

function ProtectedRoute({user, Component}) {
  const location = useLocation()

  if (user) {
    return <Component />;
  }
  return <Navigate to="/login" state={{ from: location }} />;
}

export default ProtectedRoute