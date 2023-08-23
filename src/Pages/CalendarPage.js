import React, { useState, useRef, useEffect, useMemo } from "react";
import "./CalendarPage.css";
import { Calendar, momentLocalizer } from "react-big-calendar";
import Modal from "react-modal";
import EventManager from "../Components/EventManager";
import moment from "moment";
import { getDocs, doc, query, where } from "firebase/firestore";
import { collection } from "firebase/firestore";
import { db } from "../config/firebase";
import InnerModal from "../Components/InnerModal";
import Loading from "../Components/Loading";

Modal.setAppElement("#root");

const localizer = momentLocalizer(moment);

function CalendarPage() {
  const [partnerSites, setPartnerSites] = useState([]);
  const [selectedPartnerSiteId, setSelectedPartnerSiteId] = useState("");
  const [selectedPartnerSite, setSelectedPartnerSite] = useState({});

  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const [isLoaded, setIsLoaded] = useState(true);
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  const getPartnerSites = async () => {
    const sitesRef = collection(db, "sites");
    const q = query(sitesRef);
    const querySnapshot = await getDocs(q);
    const data = querySnapshot.docs.map((doc) => {
      return { id: doc.id, ...doc.data() };
    });

    setPartnerSites(data);
    setSelectedPartnerSiteId(data[0]?.id.toString());
    setSelectedPartnerSite(data[0]);
  };



  const getEventsBySiteId = async (siteId) => {
    if (siteId === undefined) {
      return;
    }

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

      // calculate number of weeks between start and end date
      let weeks = Math.floor(
        (event.final_date.getTime() - event.start.getTime()) /
          (7 * 24 * 60 * 60 * 1000)
      );

      let weekIncrement = 1;

      if (event?.recurrence === "weekly") {
        weekIncrement = 1;
      } else if (event?.recurrence === "biweekly" || event?.recurrence === "bi-weekly") {
        weekIncrement = 2;
      } else if (event?.recurrence === "one-time") {
        recurringEvents.push(event);
        return;
      }

      for (let week = 0; week < weeks; week += weekIncrement) {
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

    setEvents(recurringEvents);
    setIsLoaded(true);
  };

  useEffect(() => {
    getPartnerSites();
    getEventsBySiteId();
  }, [selectedPartnerSiteId]);

  const signupRef = useRef(null);

  const handleOptionChange = (e) => {
    setIsLoaded(false);
    setSelectedPartnerSiteId(e.target.value);
    setSelectedPartnerSite(
      partnerSites.find((site) => site.id.toString() === e.target.value)
    );
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
            <select
              onChange={handleOptionChange}
              defaultValue="Select a partner site"
            >
              <option disabled>Select a partner site</option>
              {partnerSites.map((partner) => {
                return (
                  <option key={partner.id} value={partner.id}>
                    {partner.title}
                  </option>
                );
              })}
            </select>
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
          <InnerModal
            selectedEvent={selectedEvent}
            partnerSite={selectedPartnerSite}
          />
        </Modal>

        <div className="block">
          <div className="calendar-scroll-container">
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
