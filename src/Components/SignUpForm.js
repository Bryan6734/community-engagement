import React, { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../config/firebase";
import { collection, doc, setDoc } from "firebase/firestore";

function SignUpForm({ isSigningIn, setIsSigningIn }) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [homeStatus, setHomeStatus] = useState("day");
  const [studentDriver, setStudentDriver] = useState("no");
  const [driverCapacity, setDriverCapacity] = useState(0);

  const handleSignUp = async (e) => {
    e.preventDefault();

    // perform all needed checks for first and last name (strings)
    if (firstName === "" || lastName === "") {
      alert("Please enter a valid first and last name.");
      return;
    }

    // perform all needed checks for email (string)
    if (email === "" || !email.toLowerCase().includes("@milton.edu")) {
      alert("Please enter a valid Milton Academy email.");
      return;
    }

    // perform all needed checks for password (string)
    if (password === "") {
      alert("Please enter a valid password.");
      return;
    }

    // convert to title case for database lookup
    const firstNameTitleCase =
      firstName.charAt(0).toUpperCase() + firstName.slice(1);
    const lastNameTitleCase =
      lastName.charAt(0).toUpperCase() + lastName.slice(1);

    try {
      // create user in the login database (but not in the collection)
      const { user } = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      // check if email has numbers. if so, it is a student email
      const graduationYear = email.match(/\d+/g) ? "20" + email.match(/\d+/g)[0] : "0";

      // create user as a document in the collection
      const userRef = doc(collection(db, "users"), user.uid);
      const userData = {
        email: email,
        first_name: firstNameTitleCase,
        last_name: lastNameTitleCase,
        graduation_year: graduationYear,
        phone_number: phoneNumber,
        home_status: homeStatus,
        student_driver: studentDriver,
        driver_capacity: driverCapacity,
        volunteer_history: [],
      };
      await setDoc(userRef, userData);

      localStorage.setItem("user", JSON.stringify(userData));

      // clear the form inputs
      setFirstName("");
      setLastName("");
      setEmail("");
      setPassword("");
      setPhoneNumber("");
      setHomeStatus("day");
      setStudentDriver("no");
      setDriverCapacity(0);
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <form onSubmit={handleSignUp}>
      <div className="row">
        <div className="field">
          <p>Preferred First Name</p>
          <input
            type="text"
            id="first-name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
        </div>

        <div className="field">
          <p>Last Name</p>
          <input
            type="text"
            id="last-name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
        </div>

        <div className="field">
          <p>Day/Boarder</p>
          <select
            onChange={(e) => setHomeStatus(e.target.value)}
            value={homeStatus}
          >
            <option value="day">Day Student</option>
            <option value="boarder">Boarding Student</option>
            <option value="other">Other</option>
          </select>
        </div>
      </div>

      <div className="row-2">
        <div className="field">
          <p>Milton Email</p>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="field">
          <p>Phone Number</p>
          <input
            type="tel"
            id="phone-number"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
          />
        </div>
      </div>

      <div className="field">
        <p>Password</p>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      <div className="row">
        <div className="field">
          <p>Student Driver</p>
          <label htmlFor="">
            Would you be able to offer rides to students? If so, please indicate
            your ride capacity.
          </label>
          <div className="row-persist">
            <select
              onChange={(e) => {
                if (e.target.value === "no") {
                  setDriverCapacity(0);
                }
                setStudentDriver(e.target.value)}}
              value={studentDriver}
            >
              <option value="no">No</option>
              <option value="yes">Yes</option>
              <option value="maybe">Maybe</option>
            </select>
            <input
              type="number"
              value={driverCapacity}
              placeholder={0}
              onChange={(e) => {
                if (studentDriver === "no") {
                  alert("Please indicate that you are a student driver.");
                  return;
                }
                setDriverCapacity(e.target.value);
              }}
            />
          </div>
        </div>
      </div>

      <div className="sign-in-submit">
        <button className="submit" type="submit">
          Create an Account
        </button>
        <button type="button" onClick={() => setIsSigningIn(!isSigningIn)}>
          Login
        </button>
      </div>
    </form>
  );
}

export default SignUpForm;
