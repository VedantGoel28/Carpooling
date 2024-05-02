import React, { useState, useEffect, useRef } from "react";
import AppNav from "../components/AppNav";
import {
  GoogleMap,
  useJsApiLoader,
  Marker,
  Autocomplete,
} from "@react-google-maps/api";
import { Placeholder } from "react-bootstrap";
import "../styles/bookride.css";
import RideCard from "../components/RideCard";
import axios from "axios";
import io from "socket.io-client";
import { useNavigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";

const socket = io.connect("http://localhost:9001");
const ConfirmForm = ({ onClose, ride, src, dest }) => {
  useEffect(() => {
    // When the component mounts, add the no-scroll class to the body
    document.body.classList.add("no-scroll");

    // When the component unmounts, remove the no-scroll class from the body
    return () => {
      document.body.classList.remove("no-scroll");
    };
  }, []);
  const handleSubmit = (event) => {
    event.preventDefault();
    console.log("Submitted");
    console.log(user.id);
    const data = {
      username: userName,
      userid: user.primaryWeb3Wallet.web3Wallet,
      user_contact: user.primaryPhoneNumber.phoneNumber,
      source: src,
      dest: dest,
      offered: offeredamount,
      passengers_count: passengers,
      driver_id: ride.metaid,
    };
    const broadcast = socket.emit("sendoffer", data);
    axios.post("http://localhost:9000/offeredRide/updateOffers", {
      metaid: data.driver_id,
      userid: data.userid,
      username: data.username,
      contact: data.user_contact,
      offeredamt: data.offered,
      usrsrc: data.source,
      usrdst: data.dest,
      passengerscnt: data.passengers_count,
    });
    console.log(broadcast);
    onClose();
  };
  const { user } = useUser();
  const [userName, setUserName] = useState(user.username);

  const [offeredamount, setOfferedAmount] = useState(100);
  const [passengers, setPassengers] = useState(1);

  return (
    <div
      className="confirm-form"
      style={{
        overflow: "auto",
        wordWrap: "break-word",
        scrollbarWidth: "none",
      }}
    >
      <h3
        style={{ color: "black", textAlign: "center", marginBottom: "0.8rem" }}
      >
        Confirm Ride
      </h3>
      <h5 style={{ color: "black", marginBottom: "0.8rem" }}>Ride Details</h5>
      <div className="selected-ride-details" style={{ color: "black" }}>
        <p>Driver Name : {ride.driver}</p>
        <p>Car Name : {ride.carName}</p>
      </div>
      <h5 style={{ color: "black", marginBottom: "0.8rem" }}>User Details</h5>
      <form
        method="post"
        onSubmit={handleSubmit}
        style={{ marginTop: "1.7rem" }}
      >
        <div className="form-user-details">
          <div className="form-name" style={{ display: "inline-block" }}>
            <label htmlFor="name" style={{ color: "black" }}>
              Name
            </label>
            <br />
            <input
              type="text"
              id="name"
              name="name"
              required
              defaultValue={userName}
              onChange={(e) => {
                setUserName(e.target.value);
              }}
            />
          </div>
          <div className="form-contact" style={{ display: "inline-block" }}>
            <label htmlFor="contact" style={{ color: "black" }}>
              Contact
            </label>
            <br />
            <div id="contact">{user.primaryPhoneNumber.phoneNumber}</div>
          </div>
        </div>
        <div
          className="input-wrapper"
          style={{
            display: "flex",
            marginTop: "1rem",
            justifyContent: "space-around",
          }}
        >
          <div>
            <label htmlFor="amount" style={{ color: "black" }}>
              Offered Amount
            </label>
            <br />
            <span style={{ marginRight: "5px", color: "black" }}>₹</span>
            <input
              type="number"
              id="amount"
              name="amount"
              required
              defaultValue={offeredamount}
              onChange={(e) => setOfferedAmount(e.target.value)}
              min={100}
            />
          </div>
          <div>
            <label htmlFor="seats" style={{ color: "black" }}>
              Passengers
            </label>
            <br />
            <input
              type="number"
              id="seats"
              name="seats"
              required
              defaultValue={passengers}
              onChange={(e) => setPassengers(e.target.value)}
              min={1}
            />
          </div>
        </div>
        <div className="form-buttons" style={{ marginTop: "2.5rem" }}>
          <button type="submit" className="form-btn" onClick={handleSubmit}>
            Submit
          </button>
          <button onClick={onClose} className="form-btn">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};
const BookRide = () => {
  const [location, setLocation] = useState({
    lat: 28.63041213046698,
    lng: 77.37111466441804,
  });
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API,
    libraries: ["places"],
  });
  const caricon = "/circle.png";

  const [rides, setRides] = useState([]);
  const { user } = useUser();
  const baseurl = import.meta.env.VITE_BASE_URL;
  const sourceRef = useRef();
  const destRef = useRef();

  useEffect(() => {
    const fetchRides = async () => {
      try {
        const response = await axios.get(baseurl + "/get");
        setRides(response.data);
      } catch (error) {
        console.error("Failed to fetch rides:", error);
      }
    };
    fetchRides();
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => console.log(error)
      );
    }
    const intervalId = setInterval(fetchRides, 60 * 1000);
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    if (user && user.primaryWeb3Wallet && user.primaryWeb3Wallet.web3Wallet) {
      socket.on(`recieveoffer`, (data) => {
        if (data.driver_id === user.primaryWeb3Wallet.web3Wallet) {
          alert(`${data.offered.toString()} ${data.username} ${data.source}`);
        }
      });
      socket.on(`offeraccepted`, (data) => {
        if (data.userid === user.primaryWeb3Wallet.web3Wallet) {
          alert(
            `Your offer of ${data.acceptedamt} has been accepted by ${data.driver_id}`
          );
        }
      });

      return () => {
        socket.off(`recieveoffer`);
        socket.off(`offeraccepted`);
      };
    }
  }, [user]);

  const navigate = useNavigate();
  const [showConfirmForm, setShowConfirmForm] = useState(false);
  const [selectedRide, setSelectedRide] = useState(null);
  const handleRideClick = (ride) => {
    socket.emit("join", ride.metaid);
    setSelectedRide(ride);
    setShowConfirmForm(true);
  };
  const handleCloseConfirmForm = () => {
    setShowConfirmForm(false);
  };

  const handleSearchRides = () => {};
  return (
    <div className="bookride-container">
      <AppNav />
      <div
        className="loc-details"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginTop: "3rem",
        }}
      >
        <div
          className="pickUp"
          style={{
            display: "flex",
            width: "30%",
            justifyContent: "flex-start",
            alignItems: "center",
          }}
        >
          <span>
            <i
              className="fa-solid fa-location-arrow"
              style={{
                display: "inline-block",
                fontSize: "2rem",
                marginRight: "1rem",
              }}
            ></i>
          </span>
          <Autocomplete>
            <input
              type="text"
              id="source"
              name="source"
              required
              ref={sourceRef}
              style={{
                flex: "1",
                height: "2rem",
                padding: "1.2rem",
              }}
            />
          </Autocomplete>
        </div>
        <div
          className="drop"
          style={{
            display: "flex",
            width: "30%",
            justifyContent: "flex-start",
            alignItems: "center",
          }}
        >
          <i
            className="fa-solid fa-location-arrow"
            style={{
              display: "inline-block",
              fontSize: "2rem",
              marginRight: "1rem",
            }}
          ></i>
          <Autocomplete>
            <input
              type="text"
              id="dest"
              name="dest"
              required
              ref={destRef}
              style={{
                flexGrow: "1",
                height: "2rem",
                padding: "1.2rem",
              }}
            />
          </Autocomplete>
          <button
            style={{
              padding: "1rem",
              border: "none",
              borderRadius: "1rem",
              marginLeft: "1rem",
            }}
          >
            Search Rides
          </button>
        </div>
      </div>
      {!isLoaded ? (
        <div>Loading....</div>
      ) : (
        <div className="map-container">
          <GoogleMap
            center={location}
            zoom={16}
            mapContainerStyle={{
              height: "70vh",
              width: "60vw",

              borderRadius: "2%",
              border: "1px solid antiquewhite",
            }}
            options={{
              disableDefaultUI: true,
              fullscreenControl: false,
              keyboardShortcuts: false,
            }}
          >
            <Marker
              position={location}
              icon={{
                url: caricon,
                scaledSize: new window.google.maps.Size(10, 10),
              }}
              opacity={0.6}
            ></Marker>
          </GoogleMap>
        </div>
      )}
      <h2
        style={{
          textAlign: "center",
          textDecoration: "underline",
          fontFamily: "lato",
          fontWeight: "700",
          fontSize: "2.7rem",
        }}
      >
        Available Rides
      </h2>
      {rides.length > 0 ? (
        <div className="ride-list">
          {rides.map((ride, index) => (
            <RideCard
              key={index}
              rideObj={ride}
              handleRideClick={handleRideClick}
            />
          ))}
        </div>
      ) : (
        <div>No rides available</div>
      )}
      {showConfirmForm && (
        <div className="overlay">
          <ConfirmForm
            onClose={handleCloseConfirmForm}
            ride={selectedRide}
            src={sourceRef.current.value}
            dest={destRef.current.value}
          />
        </div>
      )}
    </div>
  );
};

export default BookRide;
