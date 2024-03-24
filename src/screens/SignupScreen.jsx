import React from "react";
import { SignUp } from "@clerk/clerk-react";
import "../styles/signup.css";
import { useNavigate } from "react-router-dom";

const SignupScreen = () => {
  const navigate = useNavigate();
  const handleAfterSignUp = () => {
    navigate("/signin");
  };
  return (
    <div className="signup-container">
      <h1 className="pg-heading kanit-bold">Sign up Page</h1>
      <SignUp afterSignUp={handleAfterSignUp} />
    </div>
  );
};

export default SignupScreen;
