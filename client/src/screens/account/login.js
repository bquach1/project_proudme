import React, { useState } from "react";
import { Button, CircularProgress } from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import styled from "styled-components";

import "css/login.css";
import { DATABASE_URL, THEME_COLORS } from "constants";
import { useMediaQuery } from "react-responsive";

const PageWrapper = styled.div`
  @media (max-width: 600px) {
    width: 100%;
    font-size: 20px;
  }
`;



const SuccessWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 100vh;

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
          : alert("Incorect email or password. Please try again.");
      });
  };

  const ismobile = useMediaQuery({ query: "(max-width: 600px)" });
  const istablet = useMediaQuery({ query: "(max-width: 1200px)" });

  const renderForm = (
    <PageWrapper>
      <div>
        <img
          src={require("../../components/images/login/schoolkids.png")}
          alt="Jumping schoolkids"
          style={{
            width: "50%",
            minWidth: 300,
            height: "100%",
            position: "absolute",
            left: 0,
            top: 0,
            display: ismobile ? "none" : "block", // Hide the image on mobile
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
            display: ismobile ? "none" : "block",
          }}
        />
      </div>
      <div className="FormWrapper">
        <div className="backGround">
          <img
            src = {require("../../components/images/login/schoolkids.png")}
            alt = "logo"
          />
        </div>
        <img
          src={require("../../components/images/login/proudme_logo.png")}
          alt="ProudMe official Logo"
          style={{ width: istablet ? "30%" : "50%", margin: "0 auto" }}
        />
        <img
          src={require("../../components/images/login/logo.png")}
          alt="ProudMe mini official Logo"
          style={{
            position: "absolute",
            width: ismobile ? 20 : 40,
            top: ismobile ? 10 : 20,
            right: ismobile ? 10 : 20,
          }}
        />
        <div
          style={{
            fontFamily: "Montserrat",
            fontSize: ismobile ? 20 : istablet ? 32 : 46,
            width: ismobile ? "50%" : "70%",
            margin: "0 auto",
            textAlign: "left",
            marginTop: "1%",
          }}
        >
          Login to your ProudMe dashboard
        </div>
        <form onSubmit={handleSubmit}>
          <div className="input-container">
            <label style={{ width: "100%", fontSize: ismobile ? 16 : 20 }}>
              Email or Username:{" "}
            </label>
            <input
              type="text"
              onChange={(e) => setEmail(e.target.value)}
              name="emailInput"
              className="login-input"
              style={{
                width: ismobile ? "80%" : "100%",
                height: ismobile || istablet ? 20 : 40,
              }}
              required
            />
          </div>
          <div className="input-container">
            <label style={{ width: "100%", fontSize: ismobile ? 16 : 20 }}>
              Password:{" "}
            </label>
            <input
              type="password"
              onChange={(e) => setPassword(e.target.value)}
              name="passwordInput"
              className="login-input"
              style={{
                width: ismobile ? "80%" : "100%",
                height: ismobile || istablet ? 20 : 40,
              }}
              required
            />
          </div>
          <div className="button-container" style={{height: 60,}}>
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
                  backgroundColor: THEME_COLORS.PURPLE,
                  color: "white",
                  padding: "10px 50px 10px 50px",
                  borderRadius: "25px",
                  textTransform: "none",
                  marginTop: "2%",
                  height: ismobile ? 50 : 60,
                  width: "40%",
                  fontSize: ismobile ? 15 : istablet ? 20 : 25,
                  fontWeight: 500,
                  margin: "auto",
                }}
                type="submit"
              >
                Log In
              </Button>
            )}
          </div>
          <div
            className="registration"
            style={{ width: "90%", margin: "0 auto" }}
          >
            <div className="registration-link">
              <h2
                style={{
                  display: "flex",
                  justifyContent: "center",
                  flexDirection: ismobile || istablet ? "column" : "row",
                  fontSize: ismobile || istablet ? 20 : 28,
                }}
              >
                Forgot your
                <div
                  className="nav-select"
                  onClick={() => navigate("/recovery")}
                >
                  &nbsp;Username or Password?
                </div>
              </h2>
            </div>
            <div className="registration-link">
              <h2
                style={{
                  display: "flex",
                  justifyContent: "center",
                  flexDirection: ismobile || istablet ? "column" : "row",
                  fontSize: ismobile || istablet ? 20 : 28,
                }}
              >
                Don't have an account?{" "}
                <div className="nav-select" onClick={() => navigate("/signup")}>
                  &nbsp;Register Here!
                </div>
              </h2>
            </div>
          </div>
        </form>
      </div>
      
    </PageWrapper>
  );

  function successfulLogin() {
    setTimeout(() => {
      navigate("/home");
    }, 3000);
    return (
      <SuccessWrapper className="success-login">
        <span>User successfully logged in!</span>
        <span>Loading Page</span>
        <div className="loading-dots">
          <span></span>
          <span></span>
          <span></span>
        </div>
        <img
          src={require("../../components/images/login/proudme_logo.png")}
          alt="ProudMe official logo"
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
