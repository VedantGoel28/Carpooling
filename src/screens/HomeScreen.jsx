import React from "react";
import "../styles/homescreen.css";
import { UserButton } from "@clerk/clerk-react";
const HomeScreen = () => {
  return (
    <div className="home-container">
      <div className="user-button-container">
        <UserButton showName={true} afterSignOutUrl="/" />
      </div>
      <div className="homescreen-body">
        <h1>This is the home screen</h1>
      </div>
    </div>
  );m
};

export default HomeScreen;
