import React from 'react'
import './Card.css'

function Card({ title, description, image, link }) {
  return (
    <div className="Card">
      <img src={image} alt="" />
      <div className="text-content">
        <h3>{title}</h3>
      </div>
    </div>
  )
}

export default Card