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
            adolescent obesity prevention intervention based in Louisiana.
            Project ProudMe is led by Dr. Senlin Chen and his team.
          </div>
          <div className="title-text-box">
            This website includes three main components of the intervention:
            SMART Goal-Setting (My Journal + Behavior Charts), ProudMe PE, and
            ProudMe Cafeteria.
          </div>
          <div style={{ display: "flex" }}>
            <div className="text-box">
              <strong
                style={{
                  color: THEME_COLORS.PURPLE,
                  fontSize: ismobile ? 16 : 24,
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                I. SMART Goal-Setting (“My Journal”)
              </strong>
              <ul>
                <li>
                  SMART Goal-Setting refers to setting goals that are specific,
                  measurable, attainable/achievable, realistic, and timely or
                  time-bound.
                </li>
                <li>
                  Middle school students who are part of the Project ProudMe
                  will be taught how to set SMART goals for their daily physical
                  activity, screen-time, fruits/vegetables consumption, and
                  sleep time.
                </li>
                <li>
                  Each student will be instructed to register a ProudMe account
                  using their email address and protect the account with a
                  password.
                </li>
                <li>
                  Each registered student will be asked to (1) sign in the
                  ProudMe website (2) set SMART behavior goals regularly (e.g.,
                  at least 3 times per week) (3) track goal progress for each
                  behavior (physical activity, screen time, F/V consumption,
                  sleep time) (4) type their reflective thoughts to
                  self-evaluate goal attainment (5) receive AI-generated
                  feedback to make SMARTer goals in the future (6) review the
                  Figures (under "Behavior Charts") to visualize progress and
                  achievement.
                </li>
                <li>
                  Each student, by interacting with the Project ProudMe website,
                  will become mindful of their behavior goals and behavior
                  engagement, in reference to the recommended levels of the
                  behaviors.
                </li>
              </ul>
            </div>

            <div className="vertical-line"></div>

            <div className="text-box">
              <strong
                style={{
                  color: THEME_COLORS.PURPLE,
                  fontSize: ismobile ? 16 : 24,
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                II. ProudMe PE Resources{" "}
              </strong>
              <div className="info-text">
                This website publishes important resources related to the
                ProudMe PE curriculum. This is a 12-lesson curriculum unit that
                educates middle school students important knowledge, skill, and
                disposition needed for adopting health-enhancing behaviors (more
                physical activity, less screen time, more fruits/vegetables, and
                get enough sleep).
              </div>
              <div className="info-text">
                The website contains lesson plans for the curriculum unit that
                are accessible for teacher users. The demo videos and other
                resources are also available for teachers to conveniently teach
                the ProudMe PE lessons.
              </div>
            </div>

            <div className="vertical-line"></div>

            <div className="text-box">
              <strong
                style={{
                  color: THEME_COLORS.PURPLE,
                  fontSize: ismobile ? 16 : 24,
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                III. ProudMe Cafeteria{" "}
              </strong>
              <div className="info-text">
                The ProudMe Cafeteria is designed to help schools make
                environmental and policy changes to their cafeterias. Our
                research team assesses the cafeterias using the Smarter
                Lunchroom Scorecard. We then offer specific training and support
                to the lunchroom staff within each school and assist them in
                making effective and efficient changes at the cafeteria.
              </div>
              <div className="info-text">
                A healthy food environment empowers healthy eating. The ProudMe
                Cafeteria will promote healthier eating among students at the
                participating schools.
              </div>
            </div>
          </div>
          <div className="info-text">
            For questions about the Project ProudMe, please contact Dr. Chen’s
            lab – the Pedagogical Kinesiology Lab (
            <a href="mailto:pklab@lsu.edu?subject=Project%20ProudME%20Feedback">
              pklab@lsu.edu
            </a>
            ). If your school is interested in becoming a partnership school,
            our lab offers small grants as incentives for you to participate.
            Please contact Dr. Chen (
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
