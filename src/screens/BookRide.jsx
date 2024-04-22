import React, { useState, useEffect } from "react";
import AppNav from "../components/AppNav";
import { GoogleMap, useJsApiLoader, Marker } from "@react-google-maps/api";
import { Placeholder } from "react-bootstrap";
import "../styles/bookride.css";
import RideCard from "../components/RideCard";
import axios from "axios";
import io from "socket.io-client";

const socket = io.connect("http://localhost:9001");
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
    const intervalId = setInterval(fetchRides, 60 * 1000);
    return () => clearInterval(intervalId);
  }, []);

  const handleRideClick = (ride) => {
    console.log(ride);
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
    </div>
  );
};

export default BookRide;
