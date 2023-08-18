import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import WebsiteLogo from "../Assets/canva-logo.png";
import "./Navbar.css";

function Navbar() {

  const navigate = useNavigate();

  const handleLogoClick = () => {
    navigate('/');
  }

  return (
    <div className="Navbar">
      <nav className="mini-navbar"></nav>

      <nav className="main-navbar">
        <div className="logo" onClick={handleLogoClick}>
          {/* <img rel="preload" src={WebsiteLogo} alt="" /> */}
          <p className="logo-title">Community Engagement</p>
          <p className='logo-subtitle'>Milton Academy Volunteering</p>
        </div>

        <div className="links">
          <Link to='/partners'>Partners</Link>
          <Link to="/calendar">Calendar</Link>
          <Link to="/account">Profile</Link>
        </div>
      </nav>
    </div>
  );
}

export default Navbar;
