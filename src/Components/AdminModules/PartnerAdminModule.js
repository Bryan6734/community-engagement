import React, { useEffect, useState } from "react";
import "./AdminModule.css";
import { collection, query, getDocs, addDoc } from "firebase/firestore";
import { db } from "../../config/firebase";

function PartnerAdminModule() {
  const [partnerSites, setPartnerSites] = useState([]);
  const [newPartnerSite, setNewPartnerSite] = useState({
    title: "",
    location: "",
    description: "",
    link: ""
  });

  useEffect(() => {
    const getPartnerSites = async () => {
      const sitesRef = collection(db, "sites");
      const q = query(sitesRef);
      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map((doc) => {
        return { id: doc.id, ...doc.data() };
      });
      return data;
    };

    setPartnerSites(getPartnerSites());
  }, []);

  const postPartnerSite = async () => {

    if (
      newPartnerSite?.title == "" ||
      newPartnerSite?.description == "" ||
      newPartnerSite?.location == "" ||
      newPartnerSite?.link == ""
    ) {
      alert("Please complete all fields");
      return;
    }

    try {
      console.log(newPartnerSite)
      const sitesRef = collection(db, "sites");
      const docRef = await addDoc(sitesRef, newPartnerSite);
      console.log(docRef);
      alert("Successfully posted site");
    } catch (error) {
      alert(error.error);
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setNewPartnerSite((prevState) => ({
      ...prevState,
      [name]: value
    }))
  }

  return (
    <div className="PartnerAdminModule admin-module">
      <div className="field">
        <p>Partner Site Name</p>
        <input
          name="title"
          type="text"
          id="title"
          value={newPartnerSite?.title}
          onChange={handleInputChange}
        />
      </div>
      <div className="field">
        <p>Location(s)</p>
        <input
          name="location"
          type="text"
          id="location"
          value={newPartnerSite?.location}
          onChange={handleInputChange}
        />
      </div>
      <div className="field">
        <p>Description</p>
        <textarea
          name="description"
          type="text"
          id="description"
          value={newPartnerSite?.description}
          onChange={handleInputChange}
        />
      </div>
      <div className="field">
        <p>Link (video or document if applicable)</p>
        <input
          name="link"
          type="text"
          id="link"
          value={newPartnerSite?.link}
          onChange={handleInputChange}
        />
      </div>

      <button className="post-partner-site" onClick={postPartnerSite}>
        Create Partner Site
      </button>

      
    </div>
  );
}

export default PartnerAdminModule;
