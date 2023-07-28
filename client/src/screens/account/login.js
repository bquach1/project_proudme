import React, { useState, useEffect } from "react";
import { Button, CircularProgress } from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import "../../css/login.css";

const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();

    setLoading(true);

    axios
      .post("https://project-proudme.onrender.com/login", {
        email,
        password,
      })
      .then((response) => {
        localStorage.setItem("authToken", response.data);
        setIsSubmitted(true);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        error.code === "ERR_NETWORK"
          ? alert(
              "There seems to be a server-side error. Please wait a moment before trying again."
            )
          : alert("Incorrect email or password. Please try again.");
      });
  };

  const renderForm = (
    <div className="form">
      <form onSubmit={handleSubmit}>
        <div className="input-container">
          <label>Email: </label>
          <input
            type="email"
            onChange={(e) => setEmail(e.target.value)}
            name="emailInput"
            required
          />
        </div>
        <div className="input-container">
          <label>Password: </label>
          <input
            type="password"
            onChange={(e) => setPassword(e.target.value)}
            name="passwordInput"
            required
          />
        </div>
        <div className="button-container">
          {loading ? 
          <div style={{display: "flex", alignItems: "center", margin: "auto"}}>
            <span style={{marginRight: "5%", fontWeight: "bold"}}>Loading...</span>
            <CircularProgress style={{display: "flex"}}/>
          </div>
          :
          <Button
          style={{
            backgroundColor: "#D7A746",
            color: "white",
            padding: "10px 50px 10px 50px",
            borderRadius: "20px",
            textTransform: "none",
            marginTop: "2%",
            height: "60px",
            width: "40%",
            fontSize: "25px",
            margin: "auto",
            marginBottom: "0px",
          }}
          type="submit"
        >
          Log In
        </Button>
          }
        </div>
        <div className="registration">
          <div className="registration-link">
            <h2>
              Forgot your
              <a className="nav-select" onClick={() => navigate("/recovery")}>
                Password
              </a>
              ?
            </h2>
          </div>
          <div className="registration-link">
            <h2>
              Don't have an account?{" "}
              <a className="nav-select" onClick={() => navigate("/signup")}>
                Register Here
              </a>
              !
            </h2>
          </div>
        </div>
      </form>
    </div>
  );

  function successfulLogin() {
    setTimeout(() => {
      navigate("/home");
    }, 3000);
    return <div className="success-login">User successfully logged in!</div>;
  }

  return (
    <div className="login">
      <h1 id="welcome">Welcome back to ProudME!</h1>
      {isSubmitted ? successfulLogin() : renderForm}
    </div>
  );
};

export default LoginScreen;
