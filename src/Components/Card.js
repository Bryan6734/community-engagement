import React from 'react'
import './Card.css'

function Card({ title, description, image, link }) {

  return (
    <li className="Card">
      <div className="text-content">
        <h3>{title}</h3>
        <span>education</span>
      </div>
    </li>
  );
}

export default Card