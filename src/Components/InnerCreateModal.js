import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./InnerModal.css";
import { collection, doc, addDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { db } from "../config/firebase";

function InnerCreateModal({ selectedSlot, partnerSite }) {
  const navigate = useNavigate();

  const formatDate = (date) => {
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

  const [eventData, setEventData] = useState({
    title: partnerSite?.title,
    startTime: formatDate(selectedSlot?.start),
    endTime: formatDate(selectedSlot?.end),
    startDate: formatTime(selectedSlot?.start),
    endDate: formatTime(selectedSlot?.end),
    finalDate: formatFinalDate(selectedSlot?.start),
    recurrence: "bi-weekly",
    mode: "in-person",
    maxVolunteers: 10,
    description: partnerSite?.description,
  });

  const handleStartTimeChange = (e) => {
    setEventData({ ...eventData, startTime: e.target.value });
  };

  const handleEndTimeChange = (e) => {
    setEventData({ ...eventData, endTime: e.target.value });
  };

  const handleStartDateChange = (e) => {
    setEventData({ ...eventData, startDate: e.target.value });
  };

  const handleEndDateChange = (e) => {
    setEventData({ ...eventData, endDate: e.target.value });
  };

  const handleRecurrenceChange = (e) => {
    setEventData({ ...eventData, recurrence: e.target.value });
  };

  const handleSubmit = async () => {
    if (
      !eventData.title ||
      !eventData.startTime ||
      !eventData.endTime ||
      !eventData.startDate ||
      !eventData.endDate ||
      !eventData.finalDate ||
      !eventData.recurrence ||
      !eventData.mode ||
      !eventData.maxVolunteers ||
      !eventData.description
    ) {
      alert("Please fill out all fields");
      return;
    }

    
    try {
      const partnerSiteRef = doc(db, "sites", partnerSite?.id);

      const eventsCollectionRef = collection(db, "events");
      console.log("before eventref")
      const newEventRef = doc(eventsCollectionRef);


      const newEvent = {
        id: newEventRef,
        title: eventData.title,
        start_time: new Date(eventData.startDate + " " + eventData.startTime),
        end_time: new Date(eventData.endDate + " " + eventData.endTime),
        final_date: new Date(eventData.finalDate),
        recurrence: eventData.recurrence,
        mode: eventData.mode,
        max_volunteers: eventData.maxVolunteers,
        description: eventData.description,
        site: partnerSiteRef,
        volunteers: {},
        created_at: serverTimestamp(),
      };
      console.log(newEvent)

      const docRef = await addDoc(eventsCollectionRef, newEvent);
      console.log("Document written with ID.  ", docRef.id);

      alert("Successfully posted");
      // refresh page but stay on admin page
    } catch (error) {
      alert(error);
    }
  };

  useEffect(() => {}, []);

  return (
    <div className="InnerModal">
      <div className="header">
        <input
          type="text"
          name="title"
          value={eventData.title}
          onChange={(e) => {
            setEventData({ ...eventData, title: e.target.value });
          }}
        />
      </div>
      <hr className="divider" />
      <div className="modal-body">
        <div className="flex-top">
          <div className="row">
            <div>
              <label htmlFor="">Date</label>
              <input
                name="startDate"
                type="date"
                value={eventData.startDate}
                onChange={handleStartDateChange}
              />
            </div>

            <div>
              <label htmlFor="">(Optional) Spans until</label>
              <input
                name="endDate"
                type="date"
                value={eventData.endDate}
                onChange={handleEndDateChange}
              />
            </div>
          </div>
          <div className="row">
            <div>
              <label htmlFor="">Start Time</label>
              <input
                type="time"
                name="startTime"
                value={eventData.startTime}
                onChange={handleStartTimeChange}
              />
            </div>
            <div>
              <label htmlFor="">End Time</label>
              <input
                type="time"
                name="endTime"
                value={eventData.endTime}
                onChange={handleEndTimeChange}
              />
            </div>
          </div>
          <div className="row">
            <div>
              <label htmlFor="">
                Event will recur {eventData.recurrence} until:
              </label>
              <input
                type="date"
                name="finalDate"
                value={eventData.finalDate}
                onChange={(e) => {
                  setEventData({ ...eventData, finalDate: e.target.value });
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
                value={eventData.maxVolunteers}
                onChange={(e) => {
                  setEventData({ ...eventData, maxVolunteers: e.target.value });
                }}
              />
            </div>
            <div>
              <label htmlFor="">Recurrence</label>
              <select
                onChange={handleRecurrenceChange}
                value={eventData.recurrence}
                name="recurrence"
              >
                <option value="weekly">Weekly</option>
                <option value="bi-weekly">Bi-weekly</option>
                <option value="one-time">One-Time</option>
              </select>
            </div>
            <div>
              <label htmlFor="">Mode</label>
              <select
                onChange={(e) =>
                  setEventData({ ...eventData, mode: e.target.value })
                }
                name="mode"
              >
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
                  value={eventData.description}
                  onChange={(e) =>
                    setEventData({ ...eventData, description: e.target.value })
                  }
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
