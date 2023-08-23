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
              })}
            </ul>

            <div className="selected-partner-info">
              <h2>{selectedPartner?.title}</h2>
              <p>{selectedPartner?.description}</p>
              <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quo modi nihil ut animi omnis et error deserunt, reiciendis possimus officia dignissimos magnam, at corrupti perspiciatis ratione repellendus doloremque quasi facere quas corporis eveniet nobis illo cupiditate minus! Molestiae nobis doloribus impedit ad autem suscipit quis voluptatibus. Vitae perspiciatis eligendi eaque a maxime! Voluptates consequatur vel fugit architecto quaerat corrupti libero, voluptatem culpa! Nemo, consequatur dolorem! Commodi laudantium, quia enim dolor unde, obcaecati deserunt labore repellat debitis fugiat sunt! Odio dolore, accusantium nobis dolorum impedit architecto necessitatibus totam. Quo, in consequuntur quaerat, quidem, suscipit aperiam ab velit voluptatem nihil eveniet excepturi numquam sunt qui soluta reprehenderit impedit dicta. Vel illo voluptate nam? Blanditiis quibusdam labore unde, beatae nisi mollitia aspernatur eligendi. Eaque similique atque dignissimos praesentium magni ipsa modi nihil, doloribus sed officia cumque. Est, velit! Delectus explicabo dicta officiis recusandae consequatur quos quis ab consectetur aut culpa commodi perferendis temporibus ex iste ipsum aliquam optio natus atque saepe deserunt modi possimus, ut nobis quasi. Voluptas error esse impedit sit mollitia, explicabo enim dolorem, dignissimos minima cupiditate nemo officiis reiciendis. Quo debitis recusandae, explicabo deserunt provident voluptate eos, omnis repudiandae, praesentium ad facere itaque inventore beatae! Itaque provident necessitatibus, voluptatum eius modi a blanditiis deserunt nobis ipsum, similique dolorum nihil voluptate voluptas aliquid quia temporibus esse vel eum aliquam accusantium quaerat culpa, aperiam distinctio? Nesciunt laboriosam tempore earum ipsum quod? Eveniet ab, odio, impedit omnis nihil nemo fugit tenetur rerum fuga ipsam et, ex sint eos ea maxime corporis delectus non consectetur. Optio nihil dicta reprehenderit. Consectetur eaque alias sequi tempore est officiis placeat recusandae quia, ex voluptas nulla unde fuga quasi magni explicabo at minus error ad cupiditate asperiores laboriosam nemo quibusdam! Eligendi deserunt nisi veritatis tempora itaque dolores quod, culpa sed dolore explicabo delectus at voluptas exercitationem modi perspiciatis!</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PartnersPage;
