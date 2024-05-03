import React from "react";
import { UserButton } from "@clerk/clerk-react";
import { NavLink } from "react-router-dom";

const AppNav = () => {
  return (
    <div className="navbar">
      <div className="company-name" data-aos="slide-left">
        Ether Shuttle
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
        <div className="nav-links" data-aos="slide-right">
          <NavLink to="/offers" className="nav-link">
            OFFERS
          </NavLink>
        </div>
        <div className="user-button-container" data-aos="slide-right">
          <UserButton
            showName={true}
            afterSignOutUrl="/"
            appearance={{
              elements: {
                userButtonOuterIdentifier: {
                  color: "white",
                  fontSize: "2rem",
                  textTransform: "none",
                },
              },
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default AppNav;
