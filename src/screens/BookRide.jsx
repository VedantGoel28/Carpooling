import React from "react";
import AppNav from "../components/AppNav";
import { GoogleMap, useJsApiLoader, Marker } from "@react-google-maps/api";
import { Placeholder } from "react-bootstrap";
import "../styles/bookride.css";
import RideCard from "../components/RideCard";
const BookRide = () => {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.REACT_APP_GOOGLE_MAPS_API,
  });
  const center = { lat: 28.63041213046698, lng: 77.37111466441804 };
  const caricon = "/circle.png";

  const sampleList = [
    {
      name: "Rahul",
      phone: "9876543210",
      from: "Delhi",
      to: "Noida",
      totalSeats:4,
      availableSeats:2,
      time: "10:00",
    },
    {
      name: "Rohit",
      phone: "1234567890",
      from: "Noida",
      to: "Delhi",
      totalSeats:4,
      availableSeats:2,
      time: "11:00",
    },
  ];
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
      <h2 style={{ textAlign: "center", textDecoration: "underline",fontFamily:"lato",fontWeight:"700",fontSize:"2.7rem" }}>
        Available Rides
      </h2>
      <div className="ride-list">
        {sampleList.map((ride, index) => {
          return <RideCard key={index} rideObj={ride} />;
        })}
      </div>
    </div>
  );
};

export default BookRide;
