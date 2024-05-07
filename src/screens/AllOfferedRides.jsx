import React, { useEffect, useState } from "react";
import AllOffered from "../components/AllOffered";
import "../styles/alloffered.css";
import axios from "axios";
import { useUser } from "@clerk/clerk-react";
import AppNav from "../components/AppNav";

const AcceptedOffers = ()=>{

}

const AllOfferedRides = () => {
  const { user } = useUser();
  const [offeredRides, setOfferedRides] = useState([]);
  const [selectedOffer,setSelectedOffer] = useState(null);
  useEffect(() => {
    if (user && user.primaryWeb3Wallet && user.primaryWeb3Wallet.web3Wallet) {
      axios
        .post("http://localhost:9000/getOfferedRides", {
          metaid: user.primaryWeb3Wallet.web3Wallet,
        })
        .then((res) => {
          setOfferedRides(res.data.offeredRides);
        });
    }
  }, [user]);
  return (
    <div>
      <AppNav />
      {offeredRides.length > 0 ? (
        <div>
          {offeredRides.map((ride, index) => {
            return <AllOffered key={index} offeredRide={ride} />;
          })}
        </div>
      ) : (
        <h1>No Offered Rides</h1>
      )}
    </div>
  );
};

export default AllOfferedRides;
