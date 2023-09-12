import React, { useState, useEffect } from "react";

import "./AdminPage.css";
import UserAdminModule from "../Components/AdminModules/UserAdminModule";
import EventAdminModule from "../Components/AdminModules/EventAdminModule";
import PartnerAdminModule from "../Components/AdminModules/PartnerAdminModule";

function AdminPage() {
  useEffect(() => {}, []);

  const [module, setModule] = useState();

  const handleModuleChange = (selectedModule) => {
    setModule(selectedModule);
  };

  return (
    <div className="AdminPage">
      <div className="page-content">
        <div className="block">
          <hr />
          <h1>Admin Panel</h1>
        </div>
        <div className="block">
          <div className="search-buttons">
            <button onClick={() => handleModuleChange("users")}>Users</button>
            <button onClick={() => handleModuleChange("events")}>Events</button>
            <button onClick={() => handleModuleChange("partners")}>
              Partners
            </button>
            <button onClick={() => handleModuleChange("calendar")}>
              Calendar
            </button>
          </div>

          <div className="search-bar">
            {module === "users" ? (
              <UserAdminModule />
            ) : module === "events" ? (
              <EventAdminModule />
            ) : module === "partners" ? (
              <PartnerAdminModule />
            ) : (
              <div></div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminPage;
