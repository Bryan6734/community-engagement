import React, { useState, useEffect } from 'react'
import Card from '../Components/Card'
import './PartnersPage.css'

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

  const [partners, setPartners] = useState([])

  useEffect(() => {

    const getPartners = async () => {
      const partnersRef = collection(db, 'sites')
      const partnersDocs = await getDocs(partnersRef)

      let partners = []

      partnersDocs.forEach((doc) => {
        let partner = doc.data()
        partner = { ...partner, id: doc.id }
        partners.push(partner)
      }
      )

      setPartners(partners)
    }

    getPartners()


  }, [])

  return (
    <div className="PartnersPage">
      <div className="page-content">
        <div className="block">
          <hr />
          <h1>Our Partners</h1>
          <p>
            Community Engagement Programs and Partnerships (CEPP) partners with local organizations to provide Milton Academy student volunteers. These organizations tackle issues such as environmental justice, food and housing insecurity, public
            health, education, immigration, and more.
          </p>
        </div>

        <div className="block">
          <ul className="partner-sites-grid">
            {partners.map((partner) => {
              return <Card key={partner.id} title={partner.title}></Card>;
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default PartnersPage