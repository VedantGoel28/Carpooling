import React from "react";
import AppNav from "../components/AppNav";
import { GoogleMap, useJsApiLoader, Marker } from "@react-google-maps/api";
import { Placeholder } from "react-bootstrap";
import "../styles/bookride.css";
const BookRide = () => {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.REACT_APP_GOOGLE_MAPS_API,
  });
  const center = { lat: 28.63041213046698, lng: 77.37111466441804 };
  const caricon = "/circle.png";
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
            mapContainerStyle={{ height: "70vh", width: "60vw" }}
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
    </div>
  );
};

export default BookRide;
