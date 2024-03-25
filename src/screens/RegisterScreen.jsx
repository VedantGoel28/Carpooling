import React from "react";
import "../styles/regscreen.css";
import { useNavigate } from "react-router-dom";

const RegisterScreen = () => {
  const navigate = useNavigate();
  const onClickSignIn = () => {
    navigate("/signin");
  };
  const onClickSignUp = () => {
    navigate("/signup");
  };
  return (
    <div className="container">
      <div className="app-image"></div>
      <div className="app-options">
        <div className="wlc-msg">
          <h1 className="poppins-regular">Welcome to Carpooling</h1>
        </div>
        <div className="btns">
          <button
            className="signInbtn btn poppins-regular"
            onClick={onClickSignIn}
          >
            Sign In
          </button>
          <button
            className="signUpbtn btn poppins-regular"
            onClick={onClickSignUp}
          >
            Sign Up
          </button>
        </div>
      </div>
    </div>
  );
};

export default RegisterScreen;
