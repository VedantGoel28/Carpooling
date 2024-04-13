import "./App.css";
import { useUser } from "@clerk/clerk-react";
import { useState, useLayoutEffect, useEffect } from "react";
import { useNavigate, Routes, Route } from "react-router-dom";
import RegisterScreen from "./screens/RegisterScreen";
import Signin from "./screens/Signin";
import SignupScreen from "./screens/SignupScreen";
import HomeScreen from "./screens/HomeScreen";
import BookRide from "./screens/BookRide";

function App() {
  const user = useUser();
  const navigate = useNavigate();

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
      <Route path="/offeride" element={<h1>offer a ride</h1>} />
      <Route path="*" element={<h1>404:Page not found</h1>} />
    </Routes>
  );
}

export default App;