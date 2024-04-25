import React, { useState, useEffect } from "react";
import AppNav from "../components/AppNav";
import { GoogleMap, useJsApiLoader, Marker } from "@react-google-maps/api";
import { Placeholder } from "react-bootstrap";
import "../styles/bookride.css";
import RideCard from "../components/RideCard";
import axios from "axios";
import io from "socket.io-client";
import { useNavigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";

const socket = io.connect("http://localhost:9001");
const ConfirmForm = ({ onClose, ride }) => {
  useEffect(() => {
    // When the component mounts, add the no-scroll class to the body
    document.body.classList.add("no-scroll");

    // When the component unmounts, remove the no-scroll class from the body
    return () => {
      document.body.classList.remove("no-scroll");
    };
  }, []);
  const handleSubmit = () => {
    socket.emit("send_offer", {
      username: userName,
      user_contact: userContact,
      source: source,
      dest: destination,
      offered: offeredamount,
      passengers_count: passengers,
      driver_id: selectedRide.metaid,
    });
  };
  const { user } = useUser();
  const [userName, setUserName] = useState(user.username);
  const [userContact, setUserContact] = useState(null);
  const [source, setSource] = useState("");
  const [destination, setDestination] = useState("");
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
      <form onSubmit={handleSubmit} style={{ marginTop: "1.7rem" }}>
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
            <input
              type="text"
              id="contact"
              name="contact"
              required
              defaultValue={userContact}
              onChange={(e) => setUserContact(e.target.value)}
            />
          </div>
        </div>
        <div className="loc-details">
          <div className="pickUp" style={{ display: "inline-block" }}>
            <label htmlFor="source" style={{ color: "black" }}>
              Source
            </label>
            <br />
            <input
              type="text"
              id="source"
              name="source"
              required
              defaultValue={source}
              onChange={(e) => setSource(e.target.value)}
            />
          </div>
          <div className="drop" style={{ display: "inline-block" }}>
            <label htmlFor="dest" style={{ color: "black" }}>
              Destination
            </label>
            <br />
            <input
              type="text"
              id="dest"
              name="dest"
              required
              defaultValue={destination}
              onChange={(e) => setDestination(e.target.value)}
            />
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
          <button type="submit" className="form-btn">
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
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API,
  });
  const center = { lat: 28.63041213046698, lng: 77.37111466441804 };
  const caricon = "/circle.png";

  const [rides, setRides] = useState([]);
  const baseurl = import.meta.env.VITE_BASE_URL;

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
    // const intervalId = setInterval(fetchRides, 60 * 1000);
    // return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    socket.on("recieve_offer", (data) => {
      alert(`${data.offeredamount} ${data.username} ${data.source}`);
    });
  }, [socket]);

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
  return (
    <div className="bookride-container">
      <AppNav />
      {!isLoaded ? (
        <div>Loading....</div>
      ) : (
        <div className="map-container">
          <GoogleMap
            center={center}
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
              position={center}
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
          <ConfirmForm onClose={handleCloseConfirmForm} ride={selectedRide} />
        </div>
      )}
    </div>
  );
};

export default BookRide;
