import React from "react";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { useMediaQuery } from "react-responsive";
import "css/header.css";

const LeftNav = styled.div`
  margin-left: 1%;
  width: 80%;
  display: flex;
  justify-content: flex-start; 
  align-items: center;
  flex-wrap: wrap;
  overflow: auto;
  gap: 100px;
`;

const buttonStyles = (mediaType) => ({
  backgroundColor: "transparent",
  padding: mediaType === "ismobile" || mediaType === "istablet" ? 2 : "5px 15px",
  borderRadius: "25px",
  color: "white",
  fontWeight: "bold",
  textTransform: "none",
  fontSize: mediaType === "ismobile" || mediaType === "istablet" ? 10 : 16,
});

const Header = () => {
  const navigate = useNavigate();
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
        {token ? (
          <>
            <Button
              style={buttonStyles(ismobile ? "ismobile" : istablet ? "istablet" : "default")}
              onClick={() => navigate("/journal")}
            >
              My Journal
            </Button>
            <Button
              style={buttonStyles(ismobile ? "ismobile" : istablet ? "istablet" : "default")}
              onClick={() => navigate("/tracking")}
            >
              Behavior Charts
            </Button>
            <Button
              style={buttonStyles(ismobile ? "ismobile" : istablet ? "istablet" : "default")}
              onClick={() => navigate("/learnmore")}
            >
              Learn More
            </Button>
          </>
        ) : (
          <div style={{ display: "flex", gap: "10px" }}>
            <Button
              style={buttonStyles(ismobile ? "ismobile" : istablet ? "istablet" : "default")}
              onClick={() => navigate("/team")}
            >
              Project Team
            </Button>
            <Button
              style={buttonStyles(ismobile ? "ismobile" : istablet ? "istablet" : "default")}
              onClick={() => navigate("/learnmore")}
            >
              Learn More
            </Button>
          </div>
        )}
      </LeftNav>
      <div className="right-nav">
        {token ? (
          <p
            className="nav-link"
            onClick={() => {
              navigate("/login");
              localStorage.removeItem("authToken");
            }}
          >
            Sign Out
          </p>
        ) : (
          <p className="nav-link" onClick={() => navigate("/login")}>
            Sign In
          </p>
        )}
      </div>
    </nav>
  );
};

export default Header;