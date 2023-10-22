import React, { useState } from "react";
import { Button, CircularProgress, Alert} from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import styled from "styled-components";

import "../../css/login.css";
import { DATABASE_URL } from "../../constants";

const FormWrapper = styled.div`
  background-color: white;
  width: 50%;
  height: 100%;
  position: absolute;
  right: 0;
  font-family: Roboto;
`;

const SuccessWrapper = styled.div`
  .loading-dots {
    text-align: center;
  }

  .loading-dots span {
    display: inline-block;
    width: 10px;
    height: 10px;
    background-color: #000;
    border-radius: 50%;
    margin: 0 5px;
    animation: dot-animation 1.5s infinite;
  }

  @keyframes dot-animation {
    0%,
    100% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.25);
    }
  }
`;

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
      .post(`${DATABASE_URL}/login`, {
        email,
        password,
      })
      .then((response) => {
        localStorage.setItem("authToken", response.data);
        setIsSubmitted(true);
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        console.error(error);
        error.code === "ERR_NETWORK"
          ? alert(
              "There seems to be a server-side error. Please wait a moment before trying again."
            )
          : alert("Incorrect email or password. Please try again.");
      });
  };

  const renderForm = (
    <>
      <div>
        <img
          src={require("../../components/images/login/schoolkids.png")}
          alt="Jumping schoolkids"
          style={{
            width: "50%",
            height: "100%",
            position: "absolute",
            left: 0,
            top: 0,
          }}
        />
        <img
          src={require("../../components/images/login/purple_background.png")}
          alt="Jumping schoolkids"
          style={{
            width: "50%",
            height: "100%",
            position: "absolute",
            left: 0,
            top: 0,
            opacity: 0.8,
          }}
        />
      </div>
      <FormWrapper>
        <img
          src={require("../../components/images/login/proudme_logo.png")}
          alt="ProudME official Logo"
          style={{ width: "50%" }}
        />
        <img
          src={require("../../components/images/login/logo.png")}
          alt="ProudME mini official Logo"
          style={{ position: "absolute", top: 20, right: 20 }}
        />
        <div
          style={{
            fontFamily: "Montserrat",
            fontSize: 46,
            width: "70%",
            margin: "0 auto",
            textAlign: "left",
            marginTop: "1%",
          }}
        >
          Login to your ProudME dashboard
        </div>
        <form onSubmit={handleSubmit}>
          <div className="input-container">
            <label>Email or Username: </label>
            <input
              type="text"
              onChange={(e) => setEmail(e.target.value)}
              name="emailInput"
              className="login-input"
              required
            />
          </div>
          <div className="input-container">
            <label>Password: </label>
            <input
              type="password"
              onChange={(e) => setPassword(e.target.value)}
              name="passwordInput"
              className="login-input"
              required
            />
          </div>
          <div className="button-container">
            {loading ? (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  margin: "auto",
                }}
              >
                <span style={{ marginRight: "5%", fontWeight: "bold" }}>
                  Loading...
                </span>
                <CircularProgress style={{ display: "flex" }} />
              </div>
            ) : (
              <Button
                style={{
                  backgroundColor: "#3C3293",
                  color: "white",
                  padding: "10px 50px 10px 50px",
                  borderRadius: "25px",
                  textTransform: "none",
                  marginTop: "2%",
                  height: "60px",
                  width: "40%",
                  fontSize: "25px",
                  fontWeight: 500,
                  margin: "auto",
                }}
                type="submit"
              >
                Log In
              </Button>
            )}
          </div>
          <div className="registration">
            <div className="registration-link">
              <h2 style={{ display: "flex", justifyContent: "center" }}>
                Forgot your
                <div
                  className="nav-select"
                  onClick={() => navigate("/recovery")}
                >
                  &nbsp;Username or Password
                </div>
                ?
              </h2>
            </div>
            <div className="registration-link">
              <h2 style={{ display: "flex", justifyContent: "center" }}>
                Don't have an account?{" "}
                <div className="nav-select" onClick={() => navigate("/signup")}>
                  &nbsp;Register Here
                </div>
                !
              </h2>
            </div>
          </div>
        </form>
      </FormWrapper>
    </>
  );

  function successfulLogin() {
    setTimeout(() => {
      navigate("/home");
    }, 3000);
    return (
      <SuccessWrapper className="success-login">
        <span>User successfully logged in!</span>
        <span>Loading Page</span>
        <div class="loading-dots">
          <span></span>
          <span></span>
          <span></span>
        </div>
        <img
          src={require("../../components/images/login/proudme_logo.png")}
          alt="ProudME official logo"
          style={{
            width: "20%",
            height: "auto",
            display: "flex",
            justifyContent: "center",
            margin: "0 auto",
          }}
        />
      </SuccessWrapper>
    );
  }

  return (
    <div className="login">{isSubmitted ? successfulLogin() : renderForm}</div>
  );
};

export default LoginScreen;
