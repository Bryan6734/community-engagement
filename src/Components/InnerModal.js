import React, { useState, useEffect } from "react";
import { addUserToEvent } from "../config/utils";
import "./InnerModal.css";

function InnerModal({ selectedEvent }) {

  const [event, setEvent] = useState(selectedEvent)

  const formatDate = (date) => {
    const options = { month: "long", day: "numeric", year: "numeric" };
    return new Date(date).toLocaleDateString("en-US", options);
  };

  const formatTime = (date) => {
    const options = { hour: "numeric", minute: "numeric", hour12: true };
    return new Date(date).toLocaleTimeString("en-US", options);
  };

  const toTitleCase = (str) => {
    return str.replace(/\w\S*/g, (txt) => {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
  };

  const handleButtonClick = async () => {
    console.log(selectedEvent)

    try {
      await addUserToEvent(selectedEvent?.id)
      alert("You have successfully signed up for this event! Please refresh.")
      setEvent(selectedEvent)
    } catch (error){
      alert(error.message)
    }
  }

  useEffect(() => {

  }, []);

  

  return (
    <div className="InnerModal">
      <h2>{event?.title}</h2>
      <p>
        {formatDate(event?.start)} -{" "}
        {formatDate(event?.final_date)}
      </p>

      <p>
        {toTitleCase(event?.recurrence)} from{" "}
        {formatTime(event?.start)} to {formatTime(event?.end)}
      </p>

      {/* <p>Description: {selectedEvent?.description}</p> */}
      {/* <p>Location: {selectedEvent?.location}</p> */}
      {/* <p>Recurrence: {selectedEvent?.recurrence}</p> */}
      {/* <p>Max Volunteers: {selectedEvent?.max_volunteers}</p> */}
      <ul>
        <p>Current Volunteers:</p>
        {
          Object.keys(event?.volunteers).map(volunteer => {
            return <li key={volunteer}>{volunteer}</li>
          })
        }

      </ul>

      <button className='sign-up-event' onClick={handleButtonClick}>Volunteer</button>
    </div>
  );
}

export default InnerModal;
