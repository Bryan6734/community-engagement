import React from 'react'
import './Card.css'

function Card({ partner, setSelectedPartner }) {



  return (
    <li className="Card" onClick={() => setSelectedPartner(partner)}>
      <div className="text-content">
        <h3>{partner?.title}</h3>
      </div>
    </li>
  );
}

export default Card