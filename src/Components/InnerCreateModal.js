import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom'
import "./InnerModal.css";
import { collection, doc, addDoc } from "firebase/firestore";
import { db } from "../config/firebase";

function InnerCreateModal({
  trigger,
  getEventsBySiteId,
  selectedSlot,
  partnerSite,
}) {

  const navigate = useNavigate();

  const formatDate = (date) => {
    const options = { hour: "numeric", minute: "numeric", hour12: true };

    const dateObj = new Date(date);
    const hours = dateObj.getHours().toString().padStart(2, "0");
    const minutes = dateObj.getMinutes().toString().padStart(2, "0");
    const timeString = `${hours}:${minutes}`;

    return timeString;
  };

  const formatFinalDate = (date) => {
    const dateObj = new Date(date);
    const year = dateObj.getFullYear();
    const june10th = new Date(`${year}-06-10`);
    const nextJune10th =
      june10th > dateObj ? june10th : new Date(`${year + 1}-06-10`);
    const dateString = nextJune10th.toISOString().slice(0, 10);
    return dateString;
  };

  const formatTime = (date) => {
    const dateObj = new Date(date);
    // converts to yyyy-mm-dd
    const dateString = dateObj.toISOString().slice(0, 10);
    return dateString;
  };

  const [title, setTitle] = useState(partnerSite?.title);

  const [startTime, setStartTime] = useState(formatDate(selectedSlot?.start));
  const [endTime, setEndTime] = useState(formatDate(selectedSlot?.end));

  const [startDate, setStartDate] = useState(formatTime(selectedSlot?.start));
  const [endDate, setEndDate] = useState(formatTime(selectedSlot?.end));

  const [finalDate, setFinalDate] = useState(
    formatFinalDate(selectedSlot?.start)
  );

  const [recurrence, setRecurrence] = useState("bi-weekly");
  const [mode, setMode] = useState("in-person");
  const [maxVolunteers, setMaxVolunteers] = useState(10);
  const [description, setDescription] = useState(partnerSite?.description);

  const handleStartTimeChange = (e) => {
    setStartTime(e.target.value);
  };

  const handleEndTimeChange = (e) => {
    setEndTime(e.target.value);
  };

  const handleStartDateChange = (e) => {
    setStartDate(e.target.value);
  };

  const handleEndDateChange = (e) => {
    setEndDate(e.target.value);
  };

  const handleRecurrenceChange = (e) => {
    setRecurrence(e.target.value);
  };

  const handleSubmit = async () => {
    // make sure all fields are filled out
    if (
      !title ||
      !startTime ||
      !endTime ||
      !startDate ||
      !endDate ||
      !finalDate ||
      !recurrence ||
      !mode ||
      !maxVolunteers ||
      !description
    ) {
      alert("Please fill out all fields");
      return;
    }

    const newEvent = {
      title: title,
      start_time: new Date(startDate + " " + startTime),
      end_time: new Date(endDate + " " + endTime),
      final_date: new Date(finalDate),
      recurrence: recurrence,
      mode: mode,
      max_volunteers: maxVolunteers,
      description: description,
      site: partnerSite?.id,
      volunteers: {},
    };

    // const partnerSiteRef = doc(db, "sites", partnerSite?.id);
    // const partnerSiteRef = db.doc(`sites/${partnerSite?.id}`)
    const partnerSiteRef = doc(db, "sites", partnerSite?.id);
    newEvent.site = partnerSiteRef;

    try {
      const eventsCollectionRef = collection(db, "events");
      const docRef = await addDoc(eventsCollectionRef, newEvent);
      console.log("Document written with ID.  ", docRef.id);
      
      alert("Successfully posted");
      // refresh page but stay on admin page
      navigate("/admin", { replace: true });
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {}, []);

  return (
    <div className="InnerModal">
      <div className="header">
        <input
          type="text"
          name="title"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
          }}
        />
      </div>
      <hr className="divider" />
      <div className="modal-body">
        <div className="flex-top">
          <div className="row">
            <div>
              <label htmlFor="">Start Time</label>
              <input
                type="time"
                name="startTime"
                value={startTime}
                onChange={handleStartTimeChange}
              />
            </div>
            <div>
              <label htmlFor="">End Time</label>
              <input
                type="time"
                name="endTime"
                value={endTime}
                onChange={handleEndTimeChange}
              />
            </div>
          </div>

          <div className="row">
            <div>
              <label htmlFor="">Date</label>
              <input
                name="startDate"
                type="date"
                value={startDate}
                onChange={handleStartDateChange}
              />
            </div>

            <div>
              <label htmlFor="">(Optional) Spans until</label>
              <input
                name="endDate"
                type="date"
                value={endDate}
                onChange={handleEndDateChange}
              />
            </div>
          </div>
          <div className="row">
            <div>
              <label htmlFor="">Event will recur {recurrence} until:</label>
              <input
                type="date"
                name="finalDate"
                value={finalDate}
                onChange={(e) => {
                  setFinalDate(e.target.value);
                }}
              />
            </div>
          </div>

          <div className="row">
            <div>
              <label htmlFor="">Max Volunteers</label>
              <input
                type="number"
                name="maxVolunteers"
                value={maxVolunteers}
                onChange={(e) => {
                  setMaxVolunteers(e.target.value);
                }}
              />
            </div>
            <div>
              <label htmlFor="">Recurrence</label>
              <select
                onChange={(e) => setRecurrence(e.target.value)}
                value={recurrence}
                name="recurrence"
              >
                <option value="weekly">Weekly</option>
                <option value="bi-weekly">Bi-weekly</option>
                <option value="one-time">One-Time</option>
              </select>
            </div>
            <div>
              <label htmlFor="">Mode</label>
              <select onChange={(e) => setMode(e.target.value)} name="mode">
                <option value="in-person">In-Person</option>
                <option value="remote">Remote</option>
              </select>
            </div>
          </div>

          <div className="row">
            <div>
              <label htmlFor="input-desc">Description</label>
              <div>
                <textarea
                  className="input-desc"
                  type="text"
                  name="description"
                  id=""
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                ></textarea>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-bottom">
          <button className="sign-up-event" onClick={handleSubmit}>
            Create Event
          </button>
        </div>
      </div>
    </div>
  );
}

export default InnerCreateModal;
