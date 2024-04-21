import "./App.css";
import { useUser } from "@clerk/clerk-react";
import { useState, useLayoutEffect, useEffect } from "react";
import { ChakraProvider, theme } from '@chakra-ui/react'
import { useNavigate, Routes, Route } from "react-router-dom";
import RegisterScreen from "./screens/RegisterScreen";
import Signin from "./screens/Signin";
import SignupScreen from "./screens/SignupScreen";
import HomeScreen from "./screens/HomeScreen";
import BookRide from "./screens/BookRide";
import OfferRide from "./screens/OfferRide";
import Map from "./screens/Map";

function App() {
  const user = useUser();
  const navigate = useNavigate();

  const [selectedLocation, setSelectedLocation] = useState({
    lat: 28.7041,
    lng: 77.1025,
  });

  useLayoutEffect(() => {
    if (user.isSignedIn) {
      navigate("/home");
    }
  }, []);

  return (
    <Routes>
      <Route path="/" element={<RegisterScreen />} />
      <Route path="/signin" element={<Signin />} />
      <Route path="/signup" element={<SignupScreen />} />
      <Route path="/home" element={<HomeScreen />} />
      <Route path="/bookride" element={<BookRide/>} />
      <Route path="/offeride" element={
      <div style={{ height: "100vh", width: "100%" }}>
      <OfferRide setSelectedLocation={setSelectedLocation} />
      <Map selectedLocation={selectedLocation} />
    </div>} />
      <Route path="*" element={<h1>404:Page not found</h1>} />
    </Routes>
  );
}

export default App;