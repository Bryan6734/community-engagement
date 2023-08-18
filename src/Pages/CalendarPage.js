import React, { useState, useRef, useEffect } from "react";
import "./CalendarPage.css";
import { Calendar, momentLocalizer } from "react-big-calendar";
import Modal from "react-modal";
import EventManager from "../Components/EventManager";
import moment from "moment";
import {
  getDocs,
  addDoc,
  deleteDoc,
  updateDoc,
  doc,
  query,
  where,
} from "firebase/firestore";
import { collection } from "firebase/firestore";
import { db } from "../config/firebase";
import Footer from "../Components/Footer";
import InnerModal from "../Components/InnerModal";
import Loading from "../Components/Loading";

Modal.setAppElement("#root");

const localizer = momentLocalizer(moment);

function CalendarPage() {
  const [location, setLocation] = useState("TEL2OxBEjiwqNyK9W4tt");
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const [isLoaded, setIsLoaded] = useState(false);
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  const getEventsBySiteId = async (siteId) => {
    const siteRef = doc(db, "sites", siteId);
    const eventsCollectionRef = collection(db, "events");
    const q = query(eventsCollectionRef, where("site", "==", siteRef));

    const data = await getDocs(q);

    let recurringEvents = [];

    data.docs.forEach((doc) => {
      let event = doc.data();
      event.id = doc.id;
      event.start = event.start_time.toDate();
      event.end = event.end_time.toDate();
      event.final_date = event.final_date.toDate();

      let weeks = Math.floor(
        (event.final_date.getTime() - event.start.getTime()) /
          (7 * 24 * 60 * 60 * 1000)
      );
      console.log(weeks);

      for (let week = 0; week < weeks; week++) {
        let new_event = JSON.parse(JSON.stringify(event));

        new_event.start = moment(event.start_time.toDate())
          .add(week, "weeks")
          .toDate();
        new_event.end = moment(event.end_time.toDate())
          .add(week, "weeks")
          .toDate();

        recurringEvents.push(new_event);
      }
    });

    console.log("Events:", recurringEvents);
    setEvents(recurringEvents);
    setIsLoaded(true);
    console.log(siteRef);
  };

  const getEvents = async () => {
    try {
      const eventsCollectionRef = collection(db, "events");
      const data = await getDocs(eventsCollectionRef);

      const events = data.docs.map((doc) => {
        const event = doc.data();
        event.start = event.start_time.toDate();
        event.end = event.end_time.toDate();
        event.onSelectEvent = handleEventClick;
        return event;
      });

      const all_events = events.map((event) => {
        let start_time = event.start_time.toDate();
        let end_time = event.end_time.toDate();
        let final_date = event.final_date.toDate();

        if (event.recurrence == "weekly") {
          console.log("weekly");

          let new_events = [];

          let current_date = start_time;
          // add 7 days to start time
          while (current_date < final_date) {
            let new_event = event;
            new_event.start_time = current_date;
            new_event.end_time = new Date(
              current_date.getTime() +
                (end_time.getTime() - start_time.getTime())
            );
            new_events.push(new_event);
            current_date = new Date(
              current_date.getTime() + 7 * 24 * 60 * 60 * 1000
            );
          }

          return new_events;
        } else {
          console.log("Recurrence" + event.recurrence);
        }
      });

      // in the end, return one huge list of all recurring events
      console.log(all_events);
      setEvents(all_events);

      // setEvents(events);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getEventsBySiteId("TEL2OxBEjiwqNyK9W4tt");
  }, []);

  // make a ref
  const signupRef = useRef(null);

  const handleOptionChange = (e) => {
    setLocation(e.target.value);
    setIsLoaded(false);
    getEventsBySiteId(e.target.value);
  };

  const handleEventClick = (e) => {
    setSelectedEvent(e);
    openModal();
  };

  return (
    <div className="CalendarPage">
      <div className="page-content">
        <div className="block">
          <hr />
          <h1>Calendar</h1>

          <div>
            <select value={location} onChange={handleOptionChange}>
              <option value="TEL2OxBEjiwqNyK9W4tt">Community Servings</option>
              <option value="b2zDfVrhHdfPLWlOTmFu">Taylor School</option>
            </select>

            {/* <button onClick={openModal}>Modal</button> */}
          </div>

          <div className="block">{/* <EventManager /> */}</div>
        </div>

        <Modal
          isOpen={modalIsOpen}
          onRequestClose={closeModal}
          contentLabel="Content Label"
          overlayClassName="overlay"
          className="modal"
        >
          <InnerModal selectedEvent={selectedEvent} />
        </Modal>
        <div className="block">
          <div className="calendar">
            {isLoaded ? null : <Loading />}
            <Calendar
              localizer={localizer}
              events={events}
              startAccessor="start"
              endAccessor="end"
              min={moment().hour(8).minute(0).toDate()}
              max={moment().hour(19).minute(0).toDate()}
              defaultView="week"
              onSelectEvent={handleEventClick}
            />
          </div>
        </div>

        <div className="block">
          <h2 ref={signupRef}>This Week</h2>

          {selectedEvent && (
            <>
              <p>{selectedEvent.title}</p>
              <p>{selectedEvent.start.toLocaleString()}</p>
              <p>{selectedEvent.end.toLocaleString()}</p>
              <p>{selectedEvent.description}</p>
              <p>{selectedEvent.location}</p>
              {/* <p>{selectedEvent.volunteers}</p> */}
              <p>{selectedEvent.maxVolunteers}</p>
            </>
          )}

          <div className="dropdowns"></div>
        </div>

        <div className="block">
          <EventManager />
        </div>
      </div>
    </div>
  );
}

export default CalendarPage;
