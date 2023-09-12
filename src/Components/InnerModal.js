import React, { useState, useEffect } from "react";
import { addEventToUser, addUserToEvent } from "../config/utils";
import "./InnerModal.css";
import { auth } from "../config/firebase";

import { ReactComponent as CalendarIcon } from "../Assets/calendar-lines-svgrepo-com.svg";
import { ReactComponent as ClockIcon } from "../Assets/clock-two-svgrepo-com.svg";
import { ReactComponent as UserIcon } from "../Assets/user-plus-svgrepo-com.svg";

function InnerModal({ selectedEvent }) {
  const [event, setEvent] = useState(selectedEvent);

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
      await addEventToUser(selectedEvent?.id);
      alert("You have successfully signed up for this event! Please refresh.");
      setEvent(selectedEvent);
    } catch (error) {
      alert(error.message);
    }
  };

  useEffect(() => {}, []);

  return (
    <div className="InnerModal">
      <div className="header">
        <h2>{event?.title}</h2>
        <p className="id">Event ID: {event?.id}</p>
      </div>
      <hr className="divider" />

      <div className="modal-body">
        <div className="flex-top">
          <div className="tag-row emphasis">
            <CalendarIcon className="calendar-icon" />
            {new Date() < new Date(event?.first_start)
              ? "Begins on " + formatDate(event?.first_start)
              : "Began on " + formatDate(event?.first_start)}
          </div>

          <div className="tag-row emphasis">
            <ClockIcon className="clock-icon" />
            {toTitleCase(event?.recurrence)} from {formatTime(event?.start)} -{" "}
            {formatTime(event?.end)}
          </div>

          <div className="tag-row emphasis">
            <UserIcon className="user-icon" />
            {event?.max_volunteers - Object.keys(event?.volunteers).length}{" "}
            slots remaining
          </div>

          <p>{event?.description}</p>

          <p>{event?.location}</p>
        </div>

        <div className="flex-bottom">
          {Object.values(event?.volunteers).includes(
            auth?.currentUser?.uid.toString()
          ) ? (
            <button
              className="sign-up-event disabled"
              disabled
              onClick={handleButtonClick}
            >
              Volunteer
            </button>
          ) : (
            <button className="sign-up-event" onClick={handleButtonClick}>
              Volunteer
            </button>
          )}

          <p className="note">
            This is a
            <span className="bold">
              {" " + event?.recurrence.toUpperCase() + " "}
            </span>
            commitment. Please double-check your schedule before signing up.
          </p>
        </div>
      </div>
    </div>
  );
}

export default InnerModal;
