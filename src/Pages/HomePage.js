import React, { useRef, useEffect, useState } from "react";
import { signInWithPopup, signInWithRedirect, signOut } from "firebase/auth";
import { auth, googleProvider, db, storage } from "../config/firebase";
import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  updateDoc,
  doc,
} from "firebase/firestore";
import { ref, uploadBytes } from "firebase/storage";
import "./HomePage.css";
import Typed from "typed.js";
import Card from "../Components/Card";

import cardImage from "../Assets/hero.jpg";
import teamImage from "../Assets/team.png";

import Footer from "../Components/Footer";

function HomePage() {
  const heroText = useRef(null);

  const [users, setUsers] = useState([]);

  const [fileUpload, setFileUpload] = useState();

  const usersCollectionRef = collection(db, "users");

  useEffect(() => {
    const getUsers = async () => {
      try {
        const data = await getDocs(usersCollectionRef);
        const users = data.docs.map((doc) => doc.data());
        setUsers(users);
        console.log(users);
      } catch (error) {
        console.error(error);
      }
    };

    getUsers();

    const options = {
      strings: [
        "Connect with your community.",
        "Volunteer with your community.",
        "Engage with your community.",
      ],
      typeSpeed: 40,
      backDelay: 2000,
      backSpeed: 35,
      loop: true,
    };

    // console.log("hello");
    const typed = new Typed(heroText.current, options);

    return () => {
      typed.destroy();
    };
  }, []);

  const signInWithGoogle = async () => {
    try {
      if (auth.currentUser) {
        console.log("Already signed in.");
        return;
      }

      const result = await signInWithPopup(auth, googleProvider);

      console.log(result.user.email)

      // if (!result.user.email.endsWith("@milton.edu")) {
      //   console.log("Not a Milton email.")
      //   await signOut(auth);
      //   alert("Please log in with a Milton Academy email.");
      //   return;
      // }

      // console.log(auth.currentUser)
    } catch (err) {
      console.error(err);
    }
  };

  const signOutWithGoogle = async () => {
    try {
      await signOut(auth);
      console.log("signed out");
    } catch (error) {
      console.error(error);
    }
  };

  const createUser = async () => {
    try {
      await addDoc(usersCollectionRef, {
        email: "testing@gmail.com",
        first_name: "Todd",
        last_name: "Bland",
        phone_number: "1234567890",
        role: 1,
        graduation_year: 2024,
        profile_url: "bryan-profile",
        volunteer_history: ["1", "2"],
        created_at: new Date(),
        created_by: auth?.currentUser?.uid,
      });
    } catch (error) {
      console.error(error);
    }
  };

  const removeUser = async () => {
    try {
      const docRef = doc(db, "users", "smeMvRMcbZ5uO4hFciBv");
      await deleteDoc(docRef);
    } catch (error) {
      console.error(error);
    }
  };

  // should be stored in a state
  const updateUser = async () => {
    try {
      const docRef = doc(db, "users", "smeMvRMcbZ5uO4hFciBv");
      await updateDoc(docRef, {
        email: "toddbland@gmail.com",
        first_name: "Toddy",
      });
    } catch (error) {
      console.error(error);
    }
  };

  const uploadFile = async () => {
    if (!fileUpload) return;
    const filesFolderRef = ref(storage, `profiles/${fileUpload.name}`);
    try {
      await uploadBytes(filesFolderRef, fileUpload);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="HomePage">
      <div className="hero-section">
        <div className="hero-text">
          <h1>
            <span ref={heroText}></span>
          </h1>
        </div>

        <div className="buttons">
          <button className="learn-more">About Us</button>
          <button className="login" onClick={signInWithGoogle}>Volunteer</button>
        </div>
      </div>

      <div className="page-content blur">
        <div className="block">
          <hr />
          <h1 className="center">Community Engagement</h1>
          <div className="block"></div>

          <p>
            Welcome to the home of Milton Academy's Community Engagement
            Program! Our program invites intentional exploration of the issues
            that shape our communities, in hopes that students develop a
            lifelong sense of civic responsibility. Students can make weekly
            volunteer commitments to assist in local public schools, adult
            English language learning programs, residences for elderly and
            differently abled community members, and more.
          </p>

          <div className="card-container">
            <Card title="Our Team" image={teamImage} />
            <Card title="Calendar" image={teamImage} />
            <Card title="Scrapbook" image={teamImage} />
          </div>
        </div>

        <div className="block">
          <button onClick={signInWithGoogle}>Sign in w/ Google</button>
          <button onClick={signOutWithGoogle}>Sign out w/ Google</button>
          <button onClick={createUser}>Submit Event</button>
          <button onClick={removeUser}>Delete Event</button>
          <button onClick={updateUser}>Update User</button>
          <input
            type="file"
            onChange={(e) => {
              setFileUpload(e.target.files[0]);
            }}
          />
          <button onClick={uploadFile}>Upload File</button>
        </div>

        {/* display current authenticated user  */}
        <div className="block">
          <h1>Current User</h1>
          <p>{auth?.currentUser?.email}</p>
          <p>{auth?.currentUser?.displayName}</p>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default HomePage;
