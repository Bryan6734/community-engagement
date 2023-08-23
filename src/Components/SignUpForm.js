import React, { useState } from "react";
import {

  createUserWithEmailAndPassword,
} from "firebase/auth";
import { auth, db } from "../config/firebase";
import { collection, doc, setDoc } from "firebase/firestore";

function SignUpForm( { isSigningIn, setIsSigningIn }) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");

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
    const graduationYear = email.match(/\d+/g) ? email.match(/\d+/g)[0] : "0";
    
    // create user as a document in the collection
    const userRef = doc(collection(db, "users"), user.uid);
    const userData = {
      email: email,
      first_name: firstNameTitleCase,
      last_name: lastNameTitleCase,
      graduation_year: graduationYear,
      phone_number: phoneNumber,
      volunteer_history: [],
    };
    await setDoc(userRef, userData);

    localStorage.setItem("user", JSON.stringify(userData))
    
    // clear the form inputs
    setFirstName("");
    setLastName("");
    setEmail("");
    setPassword("");
    setPhoneNumber("");
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
      </div>

      <div className="row-2">
        <div className="field">
          <p>Milton Email</p>
          <input
            type="text"
            id='email'

            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="field">
          <p>Phone Number</p>
          <input
            type="text"
            id='phone-number'
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
          />
        </div>
      </div>

      <div className="field">
        <p>Password</p>
        <input
          type="password"
          id='password'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
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
