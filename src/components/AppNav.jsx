import React from "react";
import { UserButton } from "@clerk/clerk-react";

const AppNav = () => {
  return (
    <div className="navbar">
      <div className="company-name" data-aos="slide-left">
        Ether Shuttle
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
  );
};

export default AppNav;
