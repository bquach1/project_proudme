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
    font-size: 20px;
  }
`;

const FormWrapper = styled.div`
  background-color: white;
  width: 50%;
  height: 100%;
  position: absolute;
  right: 0;
  font-family: Roboto;
  display: flex;
  flex-direction: column;
  justify-content: center;
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

  const isMobile = useMediaQuery({ query: "(max-width: 800px)" });
  const isTablet = useMediaQuery({ query: "(max-width: 1200px)" });

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
          style={{ width: isTablet ? "30%" : "50%", margin: "0 auto" }}
        />
        <img
          src={require("../../components/images/login/logo.png")}
          alt="ProudME mini official Logo"
          style={{
            position: "absolute",
            width: isMobile ? 20 : 40,
            top: isMobile ? 10 : 20,
            right: isMobile ? 10 : 20,
          }}
        />
        <div
          style={{
            fontFamily: "Montserrat",
            fontSize: isMobile ? 20 : isTablet ? 32 : 46,
            width: isMobile ? "50%" : "70%",
            margin: "0 auto",
            textAlign: "left",
            marginTop: "1%",
          }}
        >
          Login to your ProudME dashboard
        </div>
        <form onSubmit={handleSubmit}>
          <div className="input-container">
            <label style={{ width: "100%", fontSize: isMobile ? 16 : 20 }}>
              Email or Username:{" "}
            </label>
            <input
              type="text"
              onChange={(e) => setEmail(e.target.value)}
              name="emailInput"
              className="login-input"
              style={{
                width: isMobile ? "80%" : "100%",
                height: isMobile || isTablet ? 20 : 40,
              }}
              required
            />
          </div>
          <div className="input-container">
            <label style={{ width: "100%", fontSize: isMobile ? 16 : 20 }}>
              Password:{" "}
            </label>
            <input
              type="password"
              onChange={(e) => setPassword(e.target.value)}
              name="passwordInput"
              className="login-input"
              style={{
                width: isMobile ? "80%" : "100%",
                height: isMobile || isTablet ? 20 : 40,
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
                  height: isMobile ? 50 : 60,
                  width: "40%",
                  fontSize: isMobile ? 15 : isTablet ? 20 : 25,
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
                  flexDirection: isMobile || isTablet ? "column" : "row",
                  fontSize: isMobile || isTablet ? 20 : 28,
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
                  flexDirection: isMobile || isTablet ? "column" : "row",
                  fontSize: isMobile || isTablet ? 20 : 28,
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
      </FormWrapper>
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
