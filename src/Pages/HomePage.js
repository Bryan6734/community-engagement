import React, { useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"
import { signOut } from "firebase/auth";
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
import teamImage from "../Assets/team.png";

import Footer from "../Components/Footer";

function HomePage() {
  const heroText = useRef(null);
  const navigate = useNavigate();

  const usersCollectionRef = collection(db, "users");

  const [user, setUser] = useState(null);

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
      }
    });
  }, [user]);

useEffect(() => {
  const options = {
    strings: ["Volunteer with your community."],
    typeSpeed: 40,
    backDelay: 2000,
    backSpeed: 35,
    loop: false,
  };

  const typed = new Typed(heroText.current, options);

  return () => {
    typed.destroy();
  };
}, []);

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
          <button className="login" onClick={() => {
            if (user){
              navigate('/calendar')
            } else {
              navigate('/account')
            }
          }}>Volunteer</button>
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

        
        </div>


      </div>

      {/* <Footer /> */}
    </div>
  );
}

export default HomePage;
