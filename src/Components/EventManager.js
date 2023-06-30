import React from "react";
import "./EventManager.css";
import { db } from "../config/firebase";
import { getDocs, addDoc, deleteDoc, updateDoc, doc } from "firebase/firestore";
import { collection } from "firebase/firestore";
import { Timestamp } from "firebase/firestore";

function EventManager() {
  const eventsCollectionRef = collection(db, "events");

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    let data = Object.fromEntries(formData);

    data.start = Timestamp.fromMillis(new Date(data.start));
    data.end = Timestamp.fromMillis(new Date(data.end));
    data.final_date = Timestamp.fromMillis(
      new Date(data.final_date).setHours(0, 0, 0, 0)
    );
    data.volunteers = [data.volunteer1, data.volunteer2];
    console.log(data.site)
    data.site = doc(db, "sites", data.site);

    const my_event = {
      title: data.title,
      site: data.site,
      description: data.description,
      start_time: data.start,
      end_time: data.end,
      final_date: data.final_date,
      volunteers: data.volunteers,
      max_volunteers: data.max_volunteers,
      recurrence: data.recurrence,
      exceptions: data.exceptions,
    };

    postEvent(my_event);
  };

  const postEvent = async (event) => {
    try {
      const docRef = await addDoc(eventsCollectionRef, event);
      console.log("Document written with ID: ", docRef.id);
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };

  return (
    <div className="EventManager">
      {/* create a form */}
      <form className="event-form" onSubmit={handleSubmit}>
        <label htmlFor="title">Title</label>
        <input type="text" name="title" id="title" />

        <label htmlFor="description">Description</label>
        <textarea name="description" id="description" />

        <label htmlFor="site">Site</label>
        <select name="site" id="site">
          <option value="TEL2OxBEjiwqNyK9W4tt">Community Servings</option>
          <option value="b2zDfVrhHdfPLWlOTmFu">The Taylor School</option>
        </select>

        <label htmlFor="volunteers">Volunteers</label>
        <input type="text" name="volunteer1" id="volunteer1" />
        <input type="text" name="volunteer2" id="volunteer2" />

        <label htmlFor="max_volunteers">Max</label>
        <input type="number" name="max_volunteers" id="max_volunteers" />

        <label htmlFor="start">Start</label>
        <input type="datetime-local" name="start" id="start" />

        <label htmlFor="end">End</label>
        <input type="datetime-local" name="end" id="end" />

        <label htmlFor="final_date">Final</label>
        <input type="date" name="final_date" id="final_date" />

        <label htmlFor="recurrence">Recurrence</label>
        <select name="recurrence" id="recurrence">
          <option value="weekly">Weekly</option>
          <option value="biweekly">Biweekly</option>
        </select>

        <label htmlFor="exceptions"></label>
        <input type="date" name="exceptions" id="exceptions" />

        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default EventManager;
