import React from "react";
import { UserButton } from "@clerk/clerk-react";

const AppNav = () => {
  return (
    <div className="home-head container-fluid">
      <div className="home-app-name" style={{ marginLeft: "1rem" }}>
        <h1>Ether Shuttle</h1>
      </div>
      <div className="user-button-container">
        <UserButton
          showName={true}
          afterSignOutUrl="/"
          appearance={{
            elements: {
              userButtonOuterIdentifier: {
                color: "white",
                fontSize: "20px",
                textTransform: "capitalize",
              },
            },
          }}
        />
      </div>
    </div>
  );
};

export default AppNav;
