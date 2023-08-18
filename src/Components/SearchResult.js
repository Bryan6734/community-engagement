import React from "react";
import { useNavigate } from "react-router-dom";

function SearchResult({ user, index }) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/${user.name}`);
  };

  return (
    <li key={index} onClick={() => handleClick()}>
      <div className="search-text">
        <div className="header">
          <p className="name">
            {user.first_name} {user.last_name}
          </p>
        </div>
        
        <p className="other">Class of {user.graduation_year}</p>
        <p className="other">{user.email}</p>
        <p className="other">{user.phone_number}</p>
      </div>
    </li>
  );
}

export default SearchResult;
