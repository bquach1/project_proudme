import React from "react";
import "css/home.css";
import styled from "styled-components";

import { THEME_COLORS } from "constants";
import { useMediaQuery } from "react-responsive";
import { useNavigate } from "react-router";
import { BEHAVIOR_COLORS } from "constants";

const Wrapper = styled.div`
  width: 100%;
  .title-container {
    position: absolute;
    height: 100%;
    width: 100%;
    top: 30%;
    text-align: center;
    z-index: 2;
    color: #fff;
    font-size: 2em;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
  }
  @media only screen and (max-width: 600px) {
      width: 100%;
  }
`;

const HomeWrapper = styled.div`
  width: 90%;
  margin: 0 auto;
  margin-top: 1%;
  text-align: left;
  font-family: Montserrat;

  .home {
    text-align: center;
  }

  .title-text-box {
    font-size: ${(props) =>
      props.mobile === "true" || props.tablet === "true" ? 16 : 24}px;
    margin-top: 2%;
  }

  .text-box {
    width: 50%;
    font-size: ${(props) =>
      props.mobile === "true" || props.tablet === "true" ? 12 : 18}px;
    margin-top: 2%;
    padding: ${(props) =>
      props.mobile === "true" || props.tablet === "true" ? 10 : 30}px;

    li {
      list-style-position: inside;
      padding: 10px;
    }
  }

  .info-text {
    padding: 10px;
  }

  .vertical-line {
    width: 1px;
    background-color: black;
    margin-top: 2%;
    margin-bottom: 2%;
  }

  @keyframes shake {
    0% {
      transform: translateX(0);
    }
    25% {
      transform: translateX(-5px);
    }
    50% {
      transform: translateX(5px);
    }
    75% {
      transform: translateX(-5px);
    }
    100% {
      transform: translateX(0);
    }
  }

  .timeload-dots {
    animation: shake 1s infinite;
  
  @media only screen and (max-width: 600px) {
      width: 100%;
  }
`;

const HomeScreen = () => {
  const ismobile = useMediaQuery({ query: "(max-width: 800px)" });
  const istablet = useMediaQuery({ query: "(max-width: 1200px)" });

  const navigate = useNavigate();

  return (
    <Wrapper>
      <img
        src={require("components/images/home/home_schoolkids.png")}
        alt="Home schoolkids"
        style={{
          width: "100%",
        }}
      />
      <img
        src={require("components/images/home/home_vector.png")}
        alt="Purple vector background"
        style={{
          width: "100%",
          objectFit: "cover",
          position: "absolute",
          left: 0,
          top: 80,
          opacity: 0.9,
        }}
      />
      <div
        className="title-container"
        style={{ top: ismobile || istablet ? "11%" : "20%" }}
      >
        <h1 style={{ fontSize: ismobile ? 32 : istablet ? 48 : 64 }}>
          Welcome to ProudMe!
        </h1>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {!localStorage.getItem("authToken") && (
            <>
              <div
                className="home-nav-select"
                onClick={() => navigate("/login")}
                style={{
                  fontSize: ismobile ? 28 : istablet ? 44 : 60,
                  backgroundColor: BEHAVIOR_COLORS.PURPLE,
                  borderRadius: 20,
                  padding:
                    ismobile || istablet ? "0px 10px 5px" : "0px 10px 15px",
                }}
              >
                Login
              </div>
              <div
                style={{
                  fontSize: ismobile ? 28 : istablet ? 44 : 60,
                  padding:
                    ismobile || istablet ? "0px 10px 5px" : "0px 10px 15px",
                }}
              >
                &nbsp;or&nbsp;
              </div>
              <div
                className="home-nav-select"
                onClick={() => navigate("/signup")}
                style={{
                  fontSize: ismobile ? 28 : istablet ? 44 : 60,
                  backgroundColor: BEHAVIOR_COLORS.PURPLE,
                  borderRadius: 20,
                  padding:
                    ismobile || istablet ? "0px 10px 5px" : "0px 10px 15px",
                }}
              >
                Register
              </div>
            </>
          )}
        </div>
      </div>
      <HomeWrapper mobile={ismobile.toString()} tablet={istablet.toString()}>
        <div style={{ margin: 0 }}>
          <div className="title-text-box">
            Welcome to the home page of Project ProudMe! Project ProudMe is an
            adolescent obesity prevention intervention based in Louisiana. ProudMe has 4 components: ProudMe Curriculum, ProudMe Tech, ProudMe Cafeteria and ProudMe PD.
            Thank you for being part of the project!
            For questions about the project, please contact Dr. Chen’s
            lab – the Pedagogical Kinesiology Lab (
            <a href="mailto:pklab@lsu.edu?subject=Project%20ProudME%20Feedback">
              pklab@lsu.edu
            </a>
            ) or Dr. Chen (
            <a href="mailto:senlinchen@lsu.edu?subject=Project%20ProudME%20Partnership%20Request">
              senlinchen@lsu.edu
            </a>
            ). Thank you!
          </div>
        </div>
      </HomeWrapper>
    </Wrapper>
  );
};

export default HomeScreen;
