import React from "react";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";

import "css/header.css";
import { useMediaQuery } from "react-responsive";
import styled from "styled-components";

const LeftNav = styled.div`
  margin-left: 1%;
  width: 80%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  overflow: auto;
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

  return (
    <nav>
      <Button onClick={() => navigate("/home")} style={{ marginLeft: "1%" }}>
        <img
          style={{ width: ismobile ? 20 : 40 }}
          src={require("components/images/white_proudme_logo.png")}
          alt="White mini ProudMe logo"
        />
      </Button>
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
        {/* Add Learn More Button */}
        <Button
          style={
            ismobile
              ? buttonStyles("ismobile")
              : istablet
              ? buttonStyles("istablet")
              : buttonStyles()
          }
          onClick={() => navigate("/learnmore")}
        >
          Learn More
        </Button>
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
