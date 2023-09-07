import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../config/firebase";
import { signOut } from "firebase/auth";
import {
  getDocs,
  getDoc,
  doc,
  query,
  collection,
  where,
} from "firebase/firestore";
import Loading from "./Loading";
import { documentId } from "firebase/firestore";

function Profile() {
  const [user, setUser] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [graduationYear, setGraduationYear] = useState("");
  const [homeStatus, setHomeStatus] = useState("");
  const [studentDriver, setStudentDriver] = useState("");
  const [driverCapacity, setDriverCapacity] = useState("");
  const [volunteerHistory, setVolunteerHistory] = useState([]);
  const [currentView, setCurrentView] = useState("Account Information");

  const toTitleCase = (str) => {
    if (str === undefined || str === "") {
      return "";
    }
    return str.replace(
      /\w\S*/g,
      (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
    );
  };

  const fetchFirebaseUser = async () => {
    const userRef = doc(db, "users", auth.currentUser?.uid);
    const userDoc = await getDoc(userRef);

    if (userDoc.exists) {
      const userData = userDoc.data();

      setFirstName(userData?.first_name);
      setLastName(userData?.last_name);
      setEmail(userData?.email);
      setPhoneNumber(userData?.phone_number);
      setGraduationYear(userData?.graduation_year);
      setHomeStatus(userData?.home_status);
      setStudentDriver(userData?.student_driver);
      setDriverCapacity(userData?.driver_capacity?.toString());

            
      //docs.google.com/spreadsheets/d/15nJV-2AO6Yr_xx778B5Y2L55xolB-EDVfPG-Da42TyQ/edit?usp=sharingusere

      localStorage.setItem("user", JSON.stringify(userData));
      setIsLoaded(true);
    } else {
      console.log("User not found");
      localStorage.removeItem("user");
    }
  };

  const fetchLocalStorageUser = () => {
    const userData = JSON.parse(localStorage.getItem("user"));
    if (userData) {
      setUser(user);
      setFirstName(userData?.first_name);
      setLastName(userData?.last_name);
      setEmail(userData?.email);
      setPhoneNumber(userData?.phone_number);
      setGraduationYear(userData?.graduation_year);
      setHomeStatus(userData?.home_status);
      setStudentDriver(userData?.student_driver);
      setDriverCapacity(userData?.driver_capacity);
    }
    setIsLoaded(true);
  };

  const fetchVolunteerHistory = async () => {
    if (auth.currentUser === null || auth.currentUser === undefined) {
      return;
    }

    const userRef = doc(db, "users", auth.currentUser?.uid);
    const userDoc = await getDoc(userRef);

    if (userDoc.exists) {
      const userData = userDoc.data();

      if (userData?.volunteer_history === undefined) {
        return;
      }

      // get a list of ids for the user's volunteer events
      const volunteerEventIds = userData?.volunteer_history.map(
        (volunteerEvent) => {
          return volunteerEvent?.event_id;
        }
      );

      if (volunteerEventIds.length === 0) {
        return;
      }

      // get all the volunteer events by id
      const volunteerEventsRef = query(
        collection(db, "events"),
        where(documentId(), "in", volunteerEventIds)
      );

      // get docs from the query
      const volunteerEventDocs = await getDocs(volunteerEventsRef);

      // create an array of volunteer events
      const volunteerEvents = [];

      volunteerEventDocs.forEach((doc) => {
        const volunteerEventData = doc.data();
        volunteerEventData.id = doc.id;

        userData?.volunteer_history.find((volunteerEvent) => {
          if (volunteerEvent?.event_id === doc.id) {
            volunteerEventData.joined_at = volunteerEvent?.joined_at?.toDate();
            volunteerEventData.left_at = volunteerEvent?.left_at?.toDate();
            volunteerEventData.abscences = volunteerEvent?.abscences?.toDate();
          }
        });
        volunteerEvents.push(volunteerEventData);
      });

      setVolunteerHistory(volunteerEvents);
    } else {
      console.log("User not found");
    }
  };

  const formatDate = (date) => {
    const options = { month: "long", day: "numeric", year: "numeric" };
    return new Date(date).toLocaleDateString("en-US", options);
  };

  const formatTime = (date) => {
    const options = { hour: "numeric", minute: "numeric", hour12: true };
    return new Date(date).toLocaleTimeString("en-US", options);
  };

  const calculateHoursVolunteered = (
    join_date,
    start_date,
    end_date,
    recurrence
  ) => {
    const join = new Date(join_date);
    const start = new Date(start_date);
    const end = new Date(end_date);

    if (recurrence.toLowerCase() === "weekly") {
      recurrence = 1;
    } else if (
      recurrence.toLowerCase() === "biweekly" ||
      recurrence.toLowerCase() === "bi-weekly"
    ) {
      recurrence = 2;
    } else if (recurrence.toLowerCase() === "monthly") {
      recurrence = 4;
    } else {
      recurrence = 1;
    }

    // find number of weeks between start and join date
    let weeksBetween = Math.abs(
      Math.floor((start.getTime() - join.getTime()) / (1000 * 60 * 60 * 24 * 7))
    );

    // divide by recurrence to get nubmer of weeks volunteered
    let weeksVolunteered = Math.ceil(weeksBetween / recurrence);

    let startMins = start.getHours() * 60 + start.getMinutes();
    let endMins = end.getHours() * 60 + end.getMinutes();

    let minutesPerSession = endMins - startMins;

    let hoursVolunteered = Math.round(
      (weeksVolunteered * minutesPerSession) / 60
    );

    return hoursVolunteered;
  };

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user && localStorage.getItem("user") === null) {
        setUser(user);
        fetchFirebaseUser();
      } else {
        fetchLocalStorageUser();
      }

      fetchVolunteerHistory();
    }, []);
  }, []);

  useEffect(() => {
    console.log(driverCapacity)


  }, [])

  const AccountInformation = () => {
    return (
      <>
        <div className="row">
          <div className="field">
            <p>First Name</p>
            <input
              readOnly
              type="text"
              id="first-name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </div>

          <div className="field">
            <p>Last Name</p>
            <input
              readOnly
              type="text"
              id="last-name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>
        </div>

        <div className="row-2">
          <div className="field">
            <p>Milton Email</p>
            <input
              readOnly
              type="text"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="field">
            <p>Phone Number</p>
            <input
              readOnly
              type="text"
              id="phone-number"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
          </div>
          <div className="field">
            <p>Year</p>
            <input
              readOnly
              type="text"
              id="graduation-year"
              value={graduationYear}
              onChange={(e) => setGraduationYear(e.target.value)}
            />
          </div>
        </div>
        <div className="row">
          <div className="field">
            <p>Driving Capacity</p>
            <input
              readOnly
              type="text"
              id="driving-capacity"
              value={driverCapacity}
              onChange={(e) => {
                setDriverCapacity(e.target.value);
              }}
            />
          </div>
          <div className="field">
            <p>Student Driver</p>
            <input
              readOnly
              type="text"
              id="driving-capacity"
              value={toTitleCase(studentDriver)}
              onChange={(e) => setStudentDriver(e.target.value)}
            />
          </div>
          <div className="field">
            <p>Day/Boarder</p>
            <input
              readOnly
              type="text"
              id="home-status"
              value={toTitleCase(homeStatus)}
              onChange={(e) => setHomeStatus(e.target.value)}
            />
          </div>
        </div>
      </>
    );
  };

  const VolunteerHistoryEvent = (new_event) => {
    const event = new_event?.new_event;

    return (
      <div className="VolunteerHistoryEvent">
        <div className="left">
          <h3>{event?.title}</h3>
          <p>Started on {formatDate(event?.start_time.toDate())}</p>
          <p>
            {toTitleCase(event?.recurrence)} from{" "}
            {formatTime(event?.start_time.toDate())} {" - "}{" "}
            {formatTime(event?.end_time.toDate())}
          </p>
        </div>
        <div className="right">
          <p className="num">
            {calculateHoursVolunteered(
              event?.joined_at,
              event?.start_time.toDate(),
              event?.end_time.toDate(),
              event?.recurrence
            )}{" "}
          </p>
          <p className="bold">hours</p>
        </div>
      </div>
    );
  };

  const VolunteerHistoryInformation = () => {
    return (
      <ul className="VolunteerHistory">
        {volunteerHistory.map((volunteerEvent) => {
          return (
            <VolunteerHistoryEvent
              key={volunteerEvent?.id}
              new_event={volunteerEvent}
            />
          );
        })}
      </ul>
    );
  };

  return (
    <div className="Profile">
      {isLoaded ? null : <Loading />}

      <div className="profile-views">
        <button onClick={() => setCurrentView("Account Information")}>
          Account Information
        </button>
        <button onClick={() => setCurrentView("Volunteer History")}>
          Volunteer History
        </button>
      </div>

      {currentView === "Account Information" ? (
        <AccountInformation />
      ) : (
        <VolunteerHistoryInformation />
      )}

      <button
        onClick={() => {
          signOut(auth);
          setUser(null);
          navigate("/");
        }}
      >
        Sign Out
      </button>
    </div>
  );
}

export default Profile;
