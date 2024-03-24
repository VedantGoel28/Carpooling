import React from "react";
import "../styles/signin.css";
import { useNavigate } from "react-router-dom";
import {
  SignIn,
  SignUp,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/clerk-react";
import HomeScreen from "./HomeScreen";
const Signin = () => {
  const navigate = useNavigate();
  const handleAfterSignIn = () => {
    navigate("/home");
  };
  return (
    <div className="signinscreen-container">
      <SignedOut>
        <div className="signin-container">
          <SignIn afterSignIn={handleAfterSignIn} />
        </div>
      </SignedOut>
      <SignedIn>
        <div className="afterSignIn-container">
        <UserButton showName={true} afterSignOutUrl='/signin'/>
        <HomeScreen />
        </div>
      </SignedIn>
    </div>
  );
};

export default Signin;
