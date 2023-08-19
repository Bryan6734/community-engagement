import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth, googleProvider, db, storage } from "../config/firebase";
import { signOut } from "firebase/auth";
import { collection, getDoc, doc } from "firebase/firestore";
import Loading from "./Loading";

function Profile() {
  const [user, setUser] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [graduationYear, setGraduationYear] = useState("");

  const fetchUser = async () => {
    if (!auth.currentUser?.uid || auth.currentUser?.uid === undefined) {
      console.log("id is undefined");
      return;
    }

    const userRef = doc(db, "users", auth.currentUser?.uid);
    const userDoc = await getDoc(userRef);

    if (userDoc.exists) {
      const userData = userDoc.data();

      setFirstName(userData.first_name);
      setLastName(userData.last_name);
      setEmail(userData.email);
      setPhoneNumber(userData.phone_number);
      setGraduationYear(userData.graduation_year);
      setIsLoaded(true);
    } else {
      console.log("User not found");
    }
  };

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
      }
    });

    fetchUser();
  }, []);

  return (
    <div className="Profile">
      {isLoaded ? null : <Loading />}
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
