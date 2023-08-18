import React from 'react'
import './App.css'
import Navbar from './Components/Navbar.js'
import { Routes, Route } from 'react-router-dom'
import HomePage from './Pages/HomePage.js'
import CalendarPage from './Pages/CalendarPage'
import AccountPage from './Pages/AccountPage'
import PartnersPage from './Pages/PartnersPage'
import AdminPage from './Pages/AdminPage'

function App() {
  return (
    <div className="App">
      <Navbar />
      <Routes>
        <Route path="*" element={<HomePage />} />
        <Route path="/calendar" element={<CalendarPage />} />
        <Route path="/partners" element={<PartnersPage />} />
        <Route path="/account" element={<AccountPage />} />
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
    </div>
  )
}

export default App