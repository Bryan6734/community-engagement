import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth, googleProvider, db, storage } from "../config/firebase";
import { signOut } from "firebase/auth";

function Profile() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
      }
    });
  }, []);

  return (
    <div className="Profile">
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
