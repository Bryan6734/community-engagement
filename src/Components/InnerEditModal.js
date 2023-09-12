import React, { useState } from "react";
import "./InnerModal.css";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../config/firebase";
import { removeUserFromEvent } from "../config/utils";

function InnerEditModal({ selectedEvent, partnerSite }) {
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
    const dateString = dateObj.toISOString().slice(0, 10);
    return dateString;
  };

  const [eventData, setEventData] = useState({
    title: selectedEvent?.title,
    startTime: formatDate(selectedEvent?.start),
    endTime: formatDate(selectedEvent?.end),
    startDate: formatTime(selectedEvent?.start),
    endDate: formatTime(selectedEvent?.end),
    finalDate: formatFinalDate(selectedEvent?.start),
    recurrence: "bi-weekly",
    mode: "in-person",
    maxVolunteers: 10,
    description: selectedEvent?.description,
    volunteers: selectedEvent?.volunteers,
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

  const handleUpdate = async () => {

    try {
      const docRef = doc(db, "events", selectedEvent?.id);


      const partnerSiteRef = doc(db, "sites", partnerSite?.id);


      await setDoc(docRef, {
        title: eventData.title,
        start_time: new Date(`${eventData.startDate} ${eventData.startTime}`),
        end_time: new Date(`${eventData.endDate} ${eventData.endTime}`),
        description: eventData.description,
        max_volunteers: eventData.maxVolunteers,
        recurrence: eventData.recurrence,
        mode: eventData.mode,
        final_date: new Date(eventData.finalDate),
        volunteers: eventData.volunteers,
        site: partnerSiteRef,
      });

      alert("Event updated successfully!");

    } catch (error) {
      alert("Error updating event.");
    }
  };


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
          <table className="modal-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Phone</th>
                <th>Remove</th>
                <th>Email</th>
              </tr>
            </thead>

            <tbody>
              {Object.keys(eventData?.volunteers).map((key) => {
                return (
                  <tr key={key}>
                    <td>{key}</td>
                    <td>123-456-7890</td>
                    <td
                      onClick={() => {
                        removeUserFromEvent(
                          eventData?.volunteers[key],
                          selectedEvent?.id
                        );
                        console.log("Remove user from event");
                      }}
                    ></td>
                    <td></td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          <label htmlFor="">
            Volunteers ({Object.keys(eventData?.volunteers).length}/
            {eventData?.maxVolunteers})
          </label>

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
                  setEventData({
                    ...eventData,
                    maxVolunteers: e.target.value,
                  });
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
                    setEventData({
                      ...eventData,
                      description: e.target.value,
                    })
                  }
                ></textarea>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-bottom">
          <button className="sign-up-event" onClick={handleUpdate}>
            Update Event
          </button>
        </div>
      </div>
    </div>
  );
}

export default InnerEditModal;
