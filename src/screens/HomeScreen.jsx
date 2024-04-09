import React from "react";
import "../styles/homescreen.css";
import { Link } from "react-router-dom";
import { UserButton, useUser } from "@clerk/clerk-react";
const HomeScreen = () => {
  const { user } = useUser();
  const primaryWeb3Wallet = user?.primaryWeb3Wallet;
  const checkIfUserHasMetamask = () => {
    if (
      primaryWeb3Wallet === "" ||
      primaryWeb3Wallet === null ||
      primaryWeb3Wallet === undefined
    ) {
      return (
        <div className="meta-msg">
          <span>Metamask not connected. Please connect to metamask.</span>
          <Link>Connect metamask</Link>
        </div>
      );
    }
  };
  return (
    <div className="home-container">
      <div className="navbar">
      <div class="company-name">Ether Shuttle</div>
      <div className="user-button-container">
        <UserButton
          showName={true}
          afterSignOutUrl="/"
          appearance={{
            elements: {
              userButtonOuterIdentifier: {
                color: "white",
                fontSize: "2rem"
              },
            },
          }}
        />
        {checkIfUserHasMetamask()}
      </div>
      </div>
      <div className="homescreen-body">
        <h1>This is the home screen </h1>
      </div>
    </div>
  );
};

export default HomeScreen;
