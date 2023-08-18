import React, { useState, useEffect } from "react";
import Card from "../Components/Card";
import Loading from "../Components/Loading";
import "./PartnersPage.css";

import { auth, googleProvider, db, storage } from "../config/firebase";
import {
  collection,
  getDocs,
  getDoc,
  addDoc,
  deleteDoc,
  updateDoc,
  doc,
} from "firebase/firestore";
import { ref, uploadBytes } from "firebase/storage";

function PartnersPage() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [partners, setPartners] = useState([]);
  const [selectedPartner, setSelectedPartner] = useState(null);

  useEffect(() => {
    const getPartners = async () => {
      const partnersRef = collection(db, "sites");
      const partnersDocs = await getDocs(partnersRef);
      let partners = [];
      partnersDocs.forEach((doc) => {
        let partner = doc.data();
        partner = { ...partner, id: doc.id };
        partners.push(partner);
      });

      setPartners(partners);
      setIsLoaded(true);
    };

    getPartners();
  }, []);

  return (
    <div className="PartnersPage">
      <div className="page-content">
        <div className="block">
          <hr />
          <h1>Our Partners</h1>
          <p>
            Community Engagement Programs and Partnerships (CEPP) partners with
            local organizations to provide Milton Academy student volunteers.
            These organizations tackle issues such as environmental justice,
            food and housing insecurity, public health, education, immigration,
            and more.
          </p>
        </div>

        <div className="block"></div>

        <div className="block">
          <div className="partner-sites-container">
            {isLoaded ? null : <Loading />}

            <ul className="partner-sites-list">
              {partners.map((partner, index) => {
                return (
                  <Card
                    key={partner.id}
                    partner={partner}
                    setSelectedPartner={setSelectedPartner}
                  ></Card>
                );
              })
              
              }
            </ul>

            <div className="selected-partner-info">
              <h2>{selectedPartner?.title}</h2>
              <p>{selectedPartner?.description}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PartnersPage;
