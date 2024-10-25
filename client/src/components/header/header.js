import React from "react";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
import { Link } from 'react-router-dom';
import "css/header.css";
import { useMediaQuery } from "react-responsive";
import styled from "styled-components";
import { useState } from "react";
const LeftNav = styled.div`
  margin-left: 1%;
  width: 80%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  overflow: auto;
  @media only screen and (max-width: 600px) {
    display: none;
  }
`;

const buttonStyles = (mediaType) => {
  return {
    backgroundColor: "transparent",
    padding:
      mediaType === "ismobile" || mediaType === "istablet"
        ? 2
        : "5px 15px 5px 15px",
    borderRadius: "25px",
    color: "white",
    fontWeight: "bold",
    textTransform: "none",
    fontSize: mediaType === "ismobile" || mediaType === "istablet" ? 10 : 16,
  };
};

const Header = () => {
  let navigate = useNavigate();

  const token = localStorage.getItem("authToken");

  const ismobile = useMediaQuery({ query: "(max-width: 800px)" });
  const istablet = useMediaQuery({ query: "(max-width: 1200px)" });

  const [isBurgerOpen, setIsBurgerOpen] = useState(false);

  // Function to toggle the burger menu
  const toggleBurger = () => {
    setIsBurgerOpen((prev) => !prev);
  };

  return (
    <nav>
      <>
        <Button className = "logo" onClick={() => navigate("/home")} style={{ marginLeft: "1%" }}>
          <img
            src={require("components/images/white_proudme_logo.png")}
            alt="White mini ProudMe logo"
          />
        </Button>
        <div className="burger-menu-btn" onClick={toggleBurger}>
          <img
            src={
              isBurgerOpen
                ? require("components/images/arrow.png") // Image for when burger is open
                : require("components/images/menu-bar.png")   // Image for when burger is closed
            }
            alt={isBurgerOpen ? "Close Menu Icon" : "Menu Icon"}
          />
        </div>
      </>

      {isBurgerOpen && (
      <div className="burger-menu">
        <ul>
          <li>
            <Link 
              to= "/tracking/activitydata" 
              onClick={() => setIsBurgerOpen(false)}
            >
              Behaviours Chart
            </Link>
          </li>
          <li>
            <Link 
              to= "/journal/activity" 
              onClick={() => setIsBurgerOpen(false)}
            >
              My Journal
            </Link>
          </li>
          <li>
            <a href="#pe" onClick={() => {navigate("/pe"); setIsBurgerOpen(false);}}>
              ProudMe PE
            </a>
          </li>
          <li>
            <a href="#cafeteria" onClick={() => {navigate("/cafeteria"); setIsBurgerOpen(false)}}>
              Cafeteria
            </a>
          </li>
        </ul>
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
      </div>
      )}
      <LeftNav>
        <Button
          style={
            ismobile
              ? buttonStyles("ismobile")
              : istablet
              ? buttonStyles("istablet")
              : buttonStyles()
          }
          onClick={() => navigate("/team")}
        >
          Project Team
        </Button>
        {token && (
          <>
            <Button
              style={
                ismobile
                  ? buttonStyles("ismobile")
                  : istablet
                  ? buttonStyles("istablet")
                  : buttonStyles()
              }
              onClick={() => navigate("/journal")}
            >
              My Journal
            </Button>
            <Button
              style={
                ismobile
                  ? buttonStyles("ismobile")
                  : istablet
                  ? buttonStyles("istablet")
                  : buttonStyles()
              }
              onClick={() => navigate("/tracking")}
            >
              Behavior Charts
            </Button>
            <Button
              style={
                ismobile
                  ? buttonStyles("ismobile")
                  : istablet
                  ? buttonStyles("istablet")
                  : buttonStyles()
              }
              onClick={() => navigate("/pe")}
            >
              ProudMe PE
            </Button>
            <Button
              style={
                ismobile
                  ? buttonStyles("ismobile")
                  : istablet
                  ? buttonStyles("istablet")
                  : buttonStyles()
              }
              onClick={() => navigate("/cafeteria")}
            >
              ProudMe Cafeteria
            </Button>
            <Button
              style={
                ismobile
                  ? buttonStyles("ismobile")
                  : istablet
                  ? buttonStyles("istablet")
                  : buttonStyles()
              }
              onClick={() => navigate("/tech-help")}
            >
              ProudMe Tech
            </Button>
          </>
        )}
      </LeftNav>

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
