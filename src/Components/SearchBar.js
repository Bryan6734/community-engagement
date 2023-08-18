import React, { useState } from "react";
import "./SearchBar.css";
import SearchResult from "./SearchResult";
import { useNavigate } from "react-router-dom";
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

// Takes in two props
function SearchBar({ placeholder, data }) {
  const [userQuery, setUserQuery] = useState("");
  const [results, setResults] = useState([]);
  const navigate = useNavigate();

  const handleChange = async (e) => {
    setUserQuery(e.target.value);

    if (e.target.value === "") {
      setResults([]);
    }

    // lowercase
    if (e.target.value.toLowerCase().includes("@milton.edu")) {
      setUserQuery(e.target.value);

      const userRef = collection(db, "users");
      const emailQuery = query(userRef, where("email", "==", e.target.value.toLowerCase()));
      const querySnapshot = await getDocs(emailQuery);

      if (!querySnapshot.empty) {
        console.log("User Found");
        setResults(querySnapshot.docs.map((doc) => doc.data()));
      } else {
        console.log("User Not Found");
      }
    } 
  };

  const handleKeyDown = async (e) => {
    if (e.key === "Enter") {
      // if e.target.value contains space
      const userRef = collection(db, "users");


      // if only first name, no spaces:
      if (!e.target.value.trim().includes(" ")) {

        // convert to title case for database lookup
        const name = e.target.value.split(" ");
        const firstName = name[0].charAt(0).toUpperCase() + name[0].slice(1);
        
        const firstNameQuery = query(userRef, where("first_name", "==", firstName));
        const querySnapshot = await getDocs(firstNameQuery);

        if (!querySnapshot.empty) {
          console.log("User Found");
          setResults(querySnapshot.docs.map((doc) => doc.data()));
        } else {
          console.log("User Not Found");
          setResults([]);
        }
      } else {

        // do multiple queries for first and last name. sometimes, people have spaces in their last name, so we can't just split by space. get first name by 0th element, and last name by last element
        const name = e.target.value.split(" ");
        const firstName = name[0].charAt(0).toUpperCase() + name[0].slice(1).toLowerCase();
        const lastName = name[name.length - 1].charAt(0).toUpperCase() + name[name.length - 1].slice(1).toLowerCase();

        // query where firstname is firstname and lastname is lastname
        const firstNameQuery = query(userRef, where("first_name", "==", firstName), where("last_name", "==", lastName));

        const querySnapshot = await getDocs(firstNameQuery);

        if (!querySnapshot.empty) {
          console.log("User Found");
          setResults(querySnapshot.docs.map((doc) => doc.data()));
        } else {
          console.log("No users found.")
          setResults([]);
        }
        
      }
    }
  }

  return (
    <div className="search">
      <div className="search-inputs">
        <input
          type="text"
          placeholder={placeholder}
          value={userQuery}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
        />

        <div className="search-results">
          {results.map((result, index) => {
            return (
              <SearchResult user={result} key={index}/>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default SearchBar;
