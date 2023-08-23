import React, { useState, useEffect } from "react";
import { addUserToEvent } from "../config/utils";
import "./InnerModal.css";
import { auth } from "../config/firebase";

import { ReactComponent as CalendarIcon } from "../Assets/calendar-lines-svgrepo-com.svg";
import { ReactComponent as ClockIcon } from "../Assets/clock-two-svgrepo-com.svg";
import { ReactComponent as UserIcon } from "../Assets/user-plus-svgrepo-com.svg";

function InnerEditModal({ selectedEvent }) {
  const [calendarEvent, setCalendarEvent] = useState(selectedEvent);

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
    console.log(selectedEvent);

    try {
      await addUserToEvent(selectedEvent?.id);
      alert("You have successfully signed up for this event! Please refresh.");
      setCalendarEvent(selectedEvent);
    } catch (error) {
      alert(error.message);
    }
  };

  useEffect(() => {}, []);

  return (
    <div className="InnerModal">
      <div className="header">
        {/* <h2>{event?.title}</h2> */}
        <input
          type="text"
          value={calendarEvent?.title}
          onChange={(e) => {
            setCalendarEvent({ ...calendarEvent, title: e.target.value });
          }}
        />
        <p className="id">Event ID: {calendarEvent?.id}</p>
      </div>
      <hr className="divider" />

      <div className="modal-body">
        <div className="flex-top">
          <div>
            <label htmlFor="start-date">Start Date</label>
            <input
              type="date"
              id="start-date"
              name="start-date"
              value={formatDate(calendarEvent?.start)}
              onChange={(e) => {
              }}
            />
          </div>



          {/* <div className="tag-row emphasis">
            <CalendarIcon className="calendar-icon" />
            {formatDate(calendarEvent?.start)} - {formatDate(calendarEvent?.final_date)}
          </div>

          <div className="tag-row emphasis">
            <ClockIcon className="clock-icon" />
            {toTitleCase(calendarEvent?.recurrence)} from {formatTime(calendarEvent?.start)} to{" "}
            {formatTime(calendarEvent?.end)}
          </div> */}

          {/* <div className="tag-row emphasis">
            <UserIcon className="user-icon" />
            {event?.max_volunteers - Object.keys(event?.volunteers).length}{" "}
            slots remaining
          </div> */}

          {/* <p>{event?.description}</p> */}

          <p>{calendarEvent?.location}</p>
        </div>

        <div className="flex-bottom">
          <button className="sign-up-event" onClick={handleButtonClick}>
            Update
          </button>
          <button className="sign-up-event" onClick={handleButtonClick}>
            Delete
          </button>
        </div>
      </div>

    </div>
  );
}

export default InnerEditModal;
