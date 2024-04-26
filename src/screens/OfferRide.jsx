import React, { useRef, useEffect, useState } from "react";
import "../styles/offerride.css";
import axios from "axios";
import formBg from "../assets/gmap_bg.jpg";
import { useUser } from "@clerk/clerk-react";
import AppNav from "../components/AppNav";
import { io } from "socket.io-client";

const socket = io.connect("http://localhost:9001");
const OfferRide = ({ apiKey }) => {
  const { user } = useUser();
  const mapRef = useRef();
  const sourceInputRef = useRef();
  const destinationInputRef = useRef();
  const [directionsService, setDirectionsService] = useState(null);
  const [directionsRenderer, setDirectionsRenderer] = useState(null);
  const [source, setSource] = useState("");
  const [destination, setDestination] = useState("");

  useEffect(() => {
    // Load Google Maps API
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
    script.async = true;
    script.onload = initMap;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, [apiKey]);

  useEffect(() => {
    if (directionsService && source && destination) {
      calculateAndDisplayRoute();
    }
  }, [directionsService, source, destination]);

  const initMap = () => {
    const map = new window.google.maps.Map(mapRef.current, {
      center: { lat: 28.6312, lng: 77.3709 },
      zoom: 15,
    });

    const directionsService = new window.google.maps.DirectionsService();
    const directionsRenderer = new window.google.maps.DirectionsRenderer();
    directionsRenderer.setMap(map);

    setDirectionsService(directionsService);
    setDirectionsRenderer(directionsRenderer);

    // Initialize autocomplete for source and destination input fields
    const sourceAutocomplete = new window.google.maps.places.Autocomplete(
      sourceInputRef.current
    );
    const destinationAutocomplete = new window.google.maps.places.Autocomplete(
      destinationInputRef.current
    );

    sourceAutocomplete.addListener("place_changed", () => {
      const place = sourceAutocomplete.getPlace();
      if (!place.geometry) {
        console.log("Place not found");
        return;
      }
      setSource(place.formatted_address);
    });

    destinationAutocomplete.addListener("place_changed", () => {
      const place = destinationAutocomplete.getPlace();
      if (!place.geometry) {
        console.log("Place not found");
        return;
      }
      setDestination(place.formatted_address);
    });
  };

  const calculateAndDisplayRoute = () => {
    directionsService.route(
      {
        origin: source,
        destination: destination,
        travelMode: "DRIVING",
      },
      (response, status) => {
        if (status === "OK") {
          directionsRenderer.setDirections(response);
        } else {
          window.alert("Directions request failed due to " + status);
        }
      }
    );
  };
  const handleSubmit = async (event) => {
    event.preventDefault();

    // Validation
    if (
      !source ||
      !destination ||
      !time ||
      !totalSeats ||
      !carnumber ||
      !carname
    ) {
      alert("Please fill out all fields.");
      return;
    }

    try {
      axios
        .post("http://localhost:9000/offeredRide/post", {
          source: source,
          driver: user?.username,
          dest: destination,
          time: time.toString(),
          metaid: user?.primaryWeb3Wallet.web3Wallet,
          totalSeats: parseInt(totalSeats),
          carNumber: carnumber,
          contact: parseInt(user?.primaryPhoneNumber.phoneNumber),
          carName: carname,
        })
        .then((res) => {
          setCarname("");
          setCarnumber("");
          setTime("");
          setTotalSeats(4);
          alert(res.data);
        })
        .catch((err) => {
          console.log(err);
          alert(err);
        });
    } catch (error) {
      console.error(error);
      alert("An error occurred while offering the ride.");
    }
  };

  const [time, setTime] = useState(null);
  const [totalSeats, setTotalSeats] = useState(4);
  const [carname, setCarname] = useState("");
  const [carnumber, setCarnumber] = useState("");
  return (
    <div>
      <AppNav />
      <div className="outer">
        <br />
        <br />
        <div className="topHeading">
          {" "}
          <h1>"Offer Your Ride"</h1>{" "}
        </div>

        <form className="inputForm">
          <div className="formLine line1">
            <div className="firstObj">
              <div className="icon">
                <i className="fa-solid fa-map-pin"></i>
              </div>
              <input
                type="text"
                placeholder="Enter source"
                className="ip"
                ref={sourceInputRef}
                onChange={(e) => setSource(e.target.value)}
              />
            </div>

            <div className="firstObj">
              <div className="icon">
                <i className="fa-solid fa-car"></i>
              </div>
              <input
                type="text"
                name="carname"
                id="car"
                className="ip"
                value={carname}
                placeholder="Enter Car Name"
                onChange={(e) => setCarname(e.target.value)}
              />
            </div>

            <div className="firstObj">
              <div className="icon">
                <i className="fa-solid fa-clock"></i>
              </div>
              <input
                type="time"
                name="time"
                id="time"
                className="ip"
                value={time}
                onChange={(e) => {
                  setTime(e.currentTarget.value);
                }}
              />
            </div>
          </div>

          <div className="formLine line2">
            <div className="secondObj">
              <div className="icon">
                <i className="fa-solid fa-location-arrow"></i>
              </div>
              <input
                type="text"
                placeholder="Enter destination"
                className="ip"
                ref={destinationInputRef}
              />
            </div>

            <div className="secondObj">
              <div className="icon">
                <i className="fa-solid fa-rug"></i>
              </div>
              <input
                type="text"
                name="carnumber"
                id="carnumber"
                className="ip"
                placeholder="Enter Car Number"
                value={carnumber}
                onChange={(e) => setCarnumber(e.target.value)}
              />
            </div>

            <div className="secondObj">
              <div className="icon">
                <i className="fa-solid fa-person"></i>
              </div>
              <select
                id="seats"
                name="seats"
                className="dropdown ip"
                defaultValue={totalSeats}
                onChange={(e) => setTotalSeats(e.target.value)}
              >
                <option value="1" className="ip">
                  1
                </option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
                <option value="6">6</option>
              </select>
            </div>
          </div>
          <div className="btn1">
            <button
              onClick={handleSubmit}
              type="submit"
              style={{
                padding: "1rem",
                border: "none",
                marginBottom: "1rem",
                backgroundColor: "#A3D8FF",
                borderRadius: "10px",
              }}
            >
              Offer Ride
            </button>
          </div>
        </form>

        <div
          style={{
            height: "80vh",
            width: "80%",
            border: "5px",
            borderRadius: "50px",
            marginLeft: "9.5rem",
          }}
          ref={mapRef}
        ></div>
      </div>
    </div>
  );
};

export default OfferRide;
