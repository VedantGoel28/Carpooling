import React from "react";
import "../styles/homescreen.css";
import { Link, NavLink } from "react-router-dom";
import { UserButton, useUser } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import AppNav from "../components/AppNav";

const HomeScreen = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const primaryWeb3Wallet = user?.primaryWeb3Wallet;

  const onClickBookRide = () => {
    navigate("/bookride");
  };

  const onClickOfferRide = () => {
    navigate("/offeride");
  };

  const checkIfUserHasMetamask = () => {
    if (
      primaryWeb3Wallet === "" ||
      primaryWeb3Wallet === null ||
      primaryWeb3Wallet === undefined
    ) {
      return (
        <div className="meta-msg">
          <span>
            Metamask not connected. Please connect to metamask in user {">"}{" "}
            manage account {">"} Web3 Wallets.
          </span>
        </div>
      );
    }
  };

  return (
    <div className="home-container">
      {checkIfUserHasMetamask()}
      <AppNav />
      <div className="home-body">
        <button className="btn btn-primary" onClick={onClickBookRide}>
          Book a ride
        </button>
        <button className="btn btn-primary" onClick={onClickOfferRide}>
          Offer a ride
        </button>
      </div>
    </div>
  );
};

export default HomeScreen;
