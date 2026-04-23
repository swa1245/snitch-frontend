import React, { useEffect } from 'react'
import { RouterProvider } from 'react-router-dom'
import './App.css'
import { router } from './app.routes'
import { useAuth } from '../features/auth/hook/useAuth'

function App() {
  const { handleGetMe } = useAuth();

  useEffect(() => {
    handleGetMe();
  }, []);

  return (
    <>
      <RouterProvider router={router} />
    </>
  )
}

export default App
