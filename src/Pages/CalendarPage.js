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

Modal.setAppElement("#root");

const localizer = momentLocalizer(moment);

function CalendarPage() {
  const [location, setLocation] = useState("TEL2OxBEjiwqNyK9W4tt");
  const [viewMode, setViewMode] = useState("week");
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);

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

    const events = data.docs.map((doc) => {
      const event = doc.data();
      event.start = event.start_time.toDate();
      event.end = event.end_time.toDate();

      return event;
    });
    setEvents(events);
    console.log(siteRef);
    console.log("Events:", events);
  };

  const getEvents = async () => {
    try {
      const eventsCollectionRef = collection(db, "events");
      const data = await getDocs(eventsCollectionRef);

      const events = data.docs.map((doc) => {
        const event = doc.data();
        event.start = event.start_time.toDate();
        event.end = event.end_time.toDate();

        return event;
      });
      setEvents(events);
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
    getEventsBySiteId(e.target.value);
  };

  const handleEventClick = (e) => {
    // setViewMode("day");
    setSelectedEvent(e);

    const element = signupRef.current;
    const offset = 45;
    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition = elementPosition - offset + window.scrollY;

    window.scrollTo({
      top: offsetPosition,
      behavior: "smooth",
    });

    // e.action();
  };

  const handleViewChange = (view) => {
    setViewMode(view.name);
  };

  return (
    <div className="CalendarPage">
      <div className="page-content">
        <div className="block">
          <hr />
          <h1>Calendar</h1>
          <p>
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Deserunt
            ullam unde dolorum repellendus voluptatem optio debitis magnam ipsum
            quo repellat officia velit soluta nam fugit, fuga illo beatae iste
            sit veniam quibusdam temporibus doloribus? Accusamus, natus laborum
            consequuntur sit accusantium quae molestias quasi, sequi amet
            incidunt est enim ea temporibus.
          </p>

          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Maiores, id
            mollitia, perspiciatis dolorum perferendis distinctio et
            necessitatibus est minus impedit recusandae dignissimos ducimus illo
            temporibus eveniet exercitationem fugiat cumque ipsa?
          </p>
        </div>

        <div className="block">
          <EventManager />
        </div>

        <Modal
          isOpen={modalIsOpen}
          onRequestClose={closeModal}
          contentLabel="Content Label"
          overlayClassName="overlay"
          className="modal"
        >
          {/* <button onClick={closeModal}>Close</button> */}
          <h1>Hello</h1>


        </Modal>

        <div className="block">
          <h2>Sign Up</h2>
          <p>Select a site:</p>
          <select value={location} onChange={handleOptionChange}>
            <option value="TEL2OxBEjiwqNyK9W4tt">Community Servings</option>
            <option value="b2zDfVrhHdfPLWlOTmFu">Taylor School</option>
          </select>

          <button onClick={openModal}>Modal</button>
        </div>

        <div className="block">
          <div className="calendar">
            <Calendar
              localizer={localizer}
              events={events}
              startAccessor="start"
              endAccessor="end"
              min={moment().hour(8).minute(0).toDate()}
              max={moment().hour(19).minute(0).toDate()}
              defaultView="week"
              onSelectEvent={handleEventClick}
              onView={handleViewChange}
              view={viewMode}
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
              <p>{selectedEvent.volunteers}</p>
              <p>{selectedEvent.maxVolunteers}</p>
            </>
          )}

          <div className="dropdowns"></div>
        </div>

        <div className="block">
          <p>
            Lorem ipsum, dolor sit amet consectetur adipisicing elit. Error
            fugiat repellendus tenetur incidunt voluptatum, quod dolor sapiente
            repudiandae, sed ratione earum autem quia quaerat inventore
            consequatur iusto. Iure, id. Magnam harum doloribus repellat beatae
            temporibus quam hic autem quaerat natus. Tempore repellat autem
            molestias nisi sequi ipsum doloremque distinctio fuga culpa tempora
            voluptates commodi velit expedita, quidem error saepe in numquam
            quia. Dignissimos possimus, eligendi consequuntur, harum eveniet
            officia officiis atque maxime libero ratione assumenda ipsam esse
            fuga dolore cupiditate sunt molestias consequatur eius doloribus,
            sapiente porro. Est molestias, ratione assumenda sit laudantium
            expedita tenetur dolore quis numquam aperiam quae quam. Reiciendis,
            optio! Cumque obcaecati eos repellendus ea similique deserunt
            quibusdam velit, rerum perspiciatis doloremque ipsam ullam porro,
            possimus deleniti in sit eius voluptas neque maiores veritatis
            dolorem. Quia voluptas officia ducimus corrupti! Id veniam ab
            molestias hic rem in nemo unde. Aliquid expedita dolorum sequi minus
            repellat adipisci ex ratione facere quae praesentium libero numquam
            non autem odio, ut dicta quod reprehenderit tenetur hic vitae iste
            voluptatem natus cupiditate beatae. Error nobis, molestias provident
            quibusdam ipsum praesentium quas enim dolorem vero nam. Quaerat eius
            commodi animi iure aut corrupti deleniti necessitatibus ullam
            maxime, natus provident molestiae officia totam, harum sunt odio
            assumenda impedit officiis aliquam consequuntur accusantium, porro
            sit. Minus placeat tenetur suscipit labore repellendus soluta autem
            aut sapiente! A incidunt enim mollitia inventore. Exercitationem
            expedita numquam quam non necessitatibus quis assumenda rerum
            officia adipisci earum ullam illo vero ipsa eaque nemo alias, atque
            quidem inventore saepe deserunt, error nobis consequatur quae
            accusantium! Adipisci, officiis quos voluptate possimus fugit ipsum
            eius, explicabo ad ea fuga excepturi quia sequi ipsa sed quo alias
            molestiae hic totam atque quidem culpa. Hic sapiente necessitatibus
            facilis libero voluptatem quod saepe quam sit ducimus reprehenderit?
            Explicabo officiis saepe fuga eveniet sunt voluptates voluptatibus,
            consectetur itaque minima officia molestias? Molestias ipsam labore
            consequatur natus consectetur placeat excepturi pariatur eligendi
            molestiae culpa. Veritatis ducimus quos in quae, porro vel ut saepe
            repudiandae vitae! Quod accusamus in natus et at recusandae
            aspernatur alias dolorum id ab! Tempora nesciunt aspernatur quam,
            magni accusamus cum pariatur dolor eos necessitatibus soluta,
            consectetur iure! Incidunt officia, optio debitis commodi sed ab
            sequi, provident pariatur voluptatibus ad fugit nemo harum libero
            iusto tempora reiciendis minima voluptate quisquam? Provident magnam
            reprehenderit modi numquam maxime sunt! Aperiam natus nisi minima
            dolorum soluta pariatur nihil cupiditate totam a quibusdam voluptas
            eaque reprehenderit sit nostrum id alias libero doloribus illum,
            obcaecati animi neque. Sequi sint, reprehenderit aliquid architecto
            quos optio, molestiae ipsum assumenda, qui maiores magni
            perspiciatis quod error officia quam facilis adipisci minus quaerat
            dicta. Architecto placeat perspiciatis nihil, deleniti voluptatem
            eaque fugit ea, obcaecati iste earum quos nisi ab repellendus eius
            quia! Sed voluptatem praesentium, unde suscipit odio illo eligendi!
            Similique veritatis quo, explicabo ipsa eaque, nisi officiis unde
            nulla deserunt magnam obcaecati eveniet, ex reiciendis numquam iure
            ducimus sunt a. Aspernatur ipsam quia repellendus repellat nostrum
            impedit quibusdam odit saepe, voluptatibus quaerat nihil est iste
            excepturi delectus pariatur officia magnam eius labore quisquam!
          </p>
        </div>
      </div>
    </div>
  );
}

export default CalendarPage;
