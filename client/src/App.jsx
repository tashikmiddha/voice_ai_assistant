import React, { useEffect, useRef, useState } from 'react'
import { Navigate, Routes, Route } from "react-router-dom"
import Home from './pages/Home'
import Login from './pages/Login'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from './utils/firebase'
import axios from 'axios'
import Navbar from './components/Navbar'
import ProtectedRoute from './components/ProtectedRoute.jsx'
const serverUrl = import.meta.env.VITE_SERVER_URL || "http://localhost:8000";
import Builder from './pages/Builder'
import Billing from './pages/Billing'
import { useNavigate } from 'react-router-dom'
import {Toaster} from "react-hot-toast"
import AdminDashboard from './pages/AdminDashboard'
const SERVER_URL = import.meta.env.VITE_SERVER_URL || "http://localhost:8000";
const CLIENT_URL = import.meta.env.VITE_CLIENT_URL || "http://localhost:5173";
const App = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
useEffect(() => {
  const fetchMe=async()=>{
    try {
      const res = await axios.get(serverUrl + "/api/user/current-user", { withCredentials: true });
      setUser(res.data.user);
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }
  onAuthStateChanged(auth, (currentUser) => {
    if (currentUser) {
      setTimeout(() => {
      fetchMe();
    }, 2000);
    } else {
      setUser(null);
      setLoading(false);
    }
  });
},[])
  return (
    <>
      <Toaster position='top-right'/>
      <Routes>
        
        <Route path="/login" element={<Login setUser={setUser}/>} />
        <Route path="/*" element={<ProtectedRoute user={user} loading={loading}>
          <Navbar user={user} setUser={setUser}/>
          <main className="pt-20">
            <Routes>
              <Route path="/" element={<Home user={user}/>} />
              <Route path="/builder" element={<Builder user={user} setUser={setUser}/>} />
              {/* <Route path="/billing" element={<Billing user={user}/>} /> */}
              {user?.isAdmin && (
                <Route path="/admin" element={<AdminDashboard user={user} setUser={setUser}/>} />
              )}
              <Route path="*" element={<Navigate to="/" replace/>} />

            </Routes>
          </main>
        </ProtectedRoute>} />
      </Routes>
    </>
  )
}

export default App
export { serverUrl, CLIENT_URL };
