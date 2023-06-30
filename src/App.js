import React from 'react'
import './App.css'
import Navbar from './Components/Navbar.js'
import { Routes, Route } from 'react-router-dom'
import HomePage from './Pages/HomePage.js'
import CalendarPage from './Pages/CalendarPage'

function App() {
  return (
    <div className="App">
      <Navbar />
      <Routes>
        <Route path="*" element={<HomePage />} />
        <Route path="/calendar" element={<CalendarPage />} />
      </Routes>
    </div>
  )
}

export default App