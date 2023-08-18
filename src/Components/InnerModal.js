import React, { useState, useEffect } from "react";
import { addUserToEvent } from "../config/utils";
import "./InnerModal.css";

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
            {formatDate(event?.start)} - {formatDate(event?.final_date)}
          </div>

          <div className="tag-row emphasis">
            <ClockIcon className="clock-icon" />
            {toTitleCase(event?.recurrence)} from {formatTime(event?.start)} to{" "}
            {formatTime(event?.end)}
          </div>

          <div className="tag-row emphasis">
            <UserIcon className="user-icon" />
            {event?.max_volunteers - Object.keys(event?.volunteers).length}{" "}
            slots remaining
          </div>

          {/* <p>{event?.description}</p> */}
          <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Maxime eaque animi deserunt veritatis eveniet, soluta ipsa voluptas. Sapiente eligendi ut aut dolores at dolorem voluptas assumenda placeat? Vitae mollitia sapiente inventore fugiat voluptates, id repellendus illum enim laudantium nesciunt animi aut assumenda possimus! Eveniet corrupti rem repellat quisquam quis quasi saepe aspernatur maiores dignissimos praesentium. Doloribus sapiente ex sequi minus non magni vitae nisi ad corrupti at accusamus voluptate, necessitatibus ea quisquam natus tempore amet odit? Saepe nihil consequuntur voluptatibus, numquam molestias itaque consequatur nesciunt aliquam. Sed esse quam minima, vitae reiciendis provident iste laborum in cupiditate accusamus ipsam iusto officia, necessitatibus reprehenderit, amet ducimus vel perferendis. Excepturi quam illum, tempora veritatis laboriosam quaerat. Animi, laborum dicta est sit molestiae architecto fugiat mollitia eos pariatur nemo ipsum amet itaque cum reprehenderit commodi dolor nulla iste, quo aspernatur tenetur harum aliquam! In, alias molestias quidem itaque impedit mollitia beatae unde, quibusdam similique nemo modi possimus a, deleniti eius facilis temporibus doloribus repellendus autem atque ex commodi velit nesciunt dignissimos! Quo et corrupti magnam omnis, illum, sit, vitae obcaecati dolor possimus ad quod quas consequatur illo. Dolorem saepe commodi quos ut voluptatibus impedit, similique error eaque voluptas distinctio dicta dolorum nesciunt voluptates sint laborum omnis tempore eos ullam accusantium deleniti sed doloremque ab esse. Ad ut rem repellendus optio aut natus. Non voluptatem ex suscipit dolor, voluptas aspernatur eaque vero reprehenderit repellendus nobis iste at quo, tenetur necessitatibus reiciendis incidunt ratione accusamus sed earum, soluta magni in. Hic exercitationem praesentium tempore ratione ipsum illo est placeat temporibus ut blanditiis? Mollitia cum eos illum, molestias tenetur error reprehenderit beatae earum a fugiat aut hic cumque ipsa recusandae doloribus obcaecati eum illo laudantium fugit ipsum consequuntur exercitationem culpa minima! Earum rerum sequi expedita, voluptas quibusdam accusantium temporibus. Ut voluptatibus soluta aspernatur illo, perspiciatis saepe.</p>
          <p>{event?.location}</p>
        </div>

        <div className="flex-bottom">
          <button className="sign-up-event" onClick={handleButtonClick}>
            Volunteer
          </button>
          <p className='note'>
            NOTE: By signing up, you are making a
            {" " + event?.recurrence.toUpperCase() + " "}
            commitment to volunteer here. Please double-check your schedule
            before signing up.
          </p>
        </div>
      </div>

      {/* <ul>
        <p>Current Volunteers:</p>
        {Object.keys(event?.volunteers).map((volunteer) => {
          return (
            <li key={volunteer}>
              <span>{volunteer}</span>
            </li>
          );
        })}
      </ul>

      <button className="sign-up-event" onClick={handleButtonClick}>
        Volunteer
      </button> */}
    </div>
  );
}

export default InnerModal;
