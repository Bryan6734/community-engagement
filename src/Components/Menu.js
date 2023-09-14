import React from "react";
import "./Menu.css";
import menuClose from "../Assets/menu-close.png";
import { useNavigate } from "react-router-dom";
// import { auth } from "../config/firebase";

function Menu() {

  const navigate = useNavigate();

  const handleClick = (path) => {
    navigate(`/${path}`);
  };

  function closeMenu() {
    document.querySelector(".menu").classList.remove("show");
    document.querySelector(".menu").classList.add("hide");
  }

  return (
    <div className="menu hide">
      <ul className="menu-links">
        <img className="close" src={menuClose} onClick={closeMenu} alt="" />
        <hr />
        <li onClick={() => handleClick("home")}>Home</li>
        <li onClick={() => handleClick("partners")}>Partners</li>
        <li onClick={() => handleClick("calendar")}>Calendar</li>
        <li onClick={() => handleClick("account")}>Profile</li>

      </ul>
    </div>
  );
}

export default Menu;
