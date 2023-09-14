import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";
import Menu from "./Menu";
import menuIcon from "../Assets/menu-icon.png";

function Navbar() {
  const navigate = useNavigate();

  const handleLogoClick = () => {
    navigate("/");
  };

  function openMenu() {
    document.querySelector(".menu").classList.remove("hide");
    document.querySelector(".menu").classList.add("show");
  }

  return (
    <div className="Navbar">
      <nav className="mini-navbar"></nav>

      <nav className="main-navbar">
        <div className="logo" onClick={handleLogoClick}>
          <p className="logo-title">Community Engagement</p>
          <p className="logo-subtitle">Milton Academy Volunteering</p>
        </div>

        <div className="links">
          <Link to="/partners">Partners</Link>
          <Link to="/calendar">Calendar</Link>
          <Link to="/account">Profile</Link>
          <img className="open" src={menuIcon} onClick={openMenu} alt="" />
        </div>
      </nav>
      <Menu className="hide"></Menu>
    </div>
  );
}

export default Navbar;
