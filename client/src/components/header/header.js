import React from "react";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";

import "css/header.css";
import { useMediaQuery } from "react-responsive";

const buttonStyles = (mediaType) => {
  return {
    backgroundColor: "transparent",
    padding:
      mediaType === "isMobile" || mediaType === "isTablet"
        ? 2
        : "5px 15px 5px 15px",
    borderRadius: "25px",
    color: "white",
    fontWeight: "bold",
    textTransform: "none",
    fontSize: mediaType === "isMobile" || mediaType === "isTablet" ? 10 : 16,
  };
};

const Header = () => {
  let navigate = useNavigate();

  const token = localStorage.getItem("authToken");

  const isMobile = useMediaQuery({ query: "(max-width: 800px)" });
  const isTablet = useMediaQuery({ query: "(max-width: 1200px)" });

  return (
    <nav>
      <div className="left-nav">
        <Button onClick={() => navigate("/home")}>
          <img
            style={{ width: isMobile ? 20 : 40 }}
            src={require("components/images/white_proudme_logo.png")}
            alt="White mini ProudMe logo"
          />
        </Button>
        <Button
          style={
            isMobile
              ? buttonStyles("isMobile")
              : isTablet
              ? buttonStyles("isTablet")
              : buttonStyles()
          }
          onClick={() => navigate("/journal")}
        >
          My Journal
        </Button>
        <Button
          style={
            isMobile
              ? buttonStyles("isMobile")
              : isTablet
              ? buttonStyles("isTablet")
              : buttonStyles()
          }
          onClick={() => navigate("/tracking")}
        >
          Track Behaviors
        </Button>
        <Button
          style={
            isMobile
              ? buttonStyles("isMobile")
              : isTablet
              ? buttonStyles("isTablet")
              : buttonStyles()
          }
          onClick={() => navigate("/pe")}
        >
          ProudME PE
        </Button>
        <Button
          style={
            isMobile
              ? buttonStyles("isMobile")
              : isTablet
              ? buttonStyles("isTablet")
              : buttonStyles()
          }
          onClick={() => navigate("/cafeteria")}
        >
          ProudME Cafeteria
        </Button>
        <Button
          style={
            isMobile
              ? buttonStyles("isMobile")
              : isTablet
              ? buttonStyles("isTablet")
              : buttonStyles()
          }
          onClick={() => navigate("/pet")}
        >
          My Pet
        </Button>
        <Button
          style={
            isMobile
              ? buttonStyles("isMobile")
              : isTablet
              ? buttonStyles("isTablet")
              : buttonStyles()
          }
          onClick={() => navigate("/pet")}
        >
          Pet Store
        </Button>
      </div>

      <div className="right-nav">
        {token === null ? (
          <p className="nav-link" onClick={() => navigate("/login")}>
            Sign In
          </p>
        ) : (
          <p
            className="nav-link"
            onClick={() => {
              navigate("/login");
              localStorage.removeItem("authToken");
            }}
          >
            Sign Out
          </p>
        )}
      </div>
    </nav>
  );
};

export default Header;
