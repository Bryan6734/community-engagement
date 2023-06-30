import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import WebsiteLogo from "../Assets/logo.png";
import "./Navbar.css";

function Navbar() {
  return (
    <div className="Navbar">
      <nav className="mini-navbar"></nav>

      <nav className="main-navbar">
        <div className="logo">
          <img rel="preload" src={WebsiteLogo} alt="" />
        </div>

        <div className="links">
          <Link to="/">Home</Link>
          <Link to="/calendar">Calendar</Link>
          <Link to="/about-us">About</Link>
        </div>
      </nav>
    </div>
  );
}

export default Navbar;
