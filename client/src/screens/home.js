import React, { useState, useEffect } from "react";
import "css/home.css";
import styled from "styled-components";

import withAuth from "components/auth/withAuth";
import { DATABASE_URL } from "constants";
import { THEME_COLORS } from "constants";

const Wrapper = styled.div`
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
  font-size: 20px;

  .home {
    text-align: center;
  }

  .title-text-box {
    font-size: 24px;
    margin-top: 2%;
  }

  .text-box {
    width: 50%;
    font-size: 18px;
    margin-top: 2%;
    padding: 30px;

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
      <div className="title-container">
        <h1>Welcome to ProudME!</h1>
      </div>
      <HomeWrapper>
        <div className="home"></div>
        <div style={{ margin: 0 }}>
          <div className="title-text-box">
            ProudMe is an adolescent obesity prevention intervention in
            Louisiana. Project ProudMe is led by Dr. Senlin Chen, Professor of
            LSU Kinesiology, and his team.
          </div>
          <div className="title-text-box">
            This website includes two main components of the intervention: SMART
            Goal-Setting and ProudMe PE resources.
          </div>
          <div style={{ display: "flex" }}>
            <div className="text-box">
              <strong
                style={{
                  color: THEME_COLORS.PURPLE,
                  fontSize: 24,
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                I. SMART Goal-Setting
              </strong>
              <ul>
                <li>
                  SMART Goal-Setting refers to setting goals that are smart,
                  measurable, attainable, realistic, and timely.{" "}
                </li>
                <li>
                  Middle school students who are part of the Project ProudMe
                  will be taught how to set SMART goals for their daily physical
                  activity, screen-time, fruit/vegetable consumption, and sleep
                  time.{" "}
                </li>
                <li>
                  Each student will be instructed to register a ProudMe account
                  using their email address and protect the account with a
                  password.{" "}
                </li>
                <li>
                  Each student will be asked to (1) sign in the ProudMe website,
                  (2) set SMART behavior goals regularly (e.g., once a day) and
                  then (3) track their engagement of each health-related
                  behavior (physical activity, screen time, fruit/vegetable
                  consumption, sleep time).{" "}
                </li>
                <li>
                  Each student, while on the Project ProudMe website, will
                  interact with the website to become mindful of their behavior
                  goals and behavior engagement in reference to the recommended
                  levels of the behaviors.
                </li>
                <li>
                  Each student, while on the Project ProudMe website, will be
                  asked to receive and process automatic feedback from the
                  website and then adjust their future behaviors, including
                  goal-setting, participation, and reflection.
                </li>
              </ul>
            </div>

            <div className="vertical-line"></div>

            <div className="text-box">
              <strong
                style={{
                  color: THEME_COLORS.PURPLE,
                  fontSize: 24,
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                II. ProudMe PE Resources{" "}
              </strong>
              <div className="info-text">
                This website publishes important resources related to the
                ProudMe PE curriculum.
              </div>
              <div className="info-text">
                This is a 12-lesson curriculum unit that educates middle school
                students' knowledge, skill, and disposition to adopt
                obesity-prevention behaviors (more physical activity, less
                screen time, more fruits/vegetables, and get enough sleep). The
                website contains lesson plans for the curriculum unit that are
                accessible for teacher users. It also contains videos and other
                resources that may facilitate the implementation of ProudMe PE
                lessons.
              </div>
              <div className="info-text">
                For questions about the Project ProudMe, please contact Dr.
                Chen’s lab – the Pedagogical Kinesiology Lab (
                <a href="mailto:pklab@lsu.edu?subject=Project%20ProudME%20Feedback">
                  pklab@lsu.edu
                </a>
                ). If your school is interested in becoming a partnership
                school, our lab offers small grants as incentives for you to
                participate. Please contact Dr. Chen (
                <a href="mailto:senlinchen@lsu.edu?subject=Project%20ProudME%20Partnership%20Request">
                  senlinchen@lsu.edu
                </a>
                ). Thank you!
              </div>
            </div>
          </div>
        </div>
      </HomeWrapper>
    </Wrapper>
  );
};

export default withAuth(HomeScreen);
