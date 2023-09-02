import React, { useState, useEffect } from "react";
import "../css/home.css";
import Button from "@mui/material/Button";
import styled from "styled-components";

import { useNavigate } from "react-router-dom";
import withAuth from "../components/auth/withAuth";
import { DATABASE_URL } from "../constants";

const HomeWrapper = styled.div`
  width: 80%;
  margin: 0 auto;
  margin-top: 1%;

  .text-box {
    margin-top: 3%;

    li {
        list-style-position: inside;
    }
  }
`;

const HomeScreen = (props) => {
  const [user, setUser] = useState([]);
  const [exactTime, setExactTime] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    fetch(`${DATABASE_URL}/users`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => setUser(data))
      .catch((error) => console.error(error));

    setExactTime(date);
  }, []);

  var dateToday = new Date(),
    date =
      "Today's date is " +
      (dateToday.getMonth() + 1) +
      "/" +
      dateToday.getDate() +
      "/" +
      dateToday.getFullYear() +
      ".";

  var currentTime = dateToday.toLocaleTimeString();

  return (
    <HomeWrapper className="home">
      <h1 className="title">Hello {user.firstName}!</h1>
      <h4>{exactTime}</h4>
      <h4>{currentTime}</h4>
      <div className="text-box">
        Welcome to the home page of ProudMe! ProudMe is an adolescent obesity
        prevention intervention in Louisiana. Project ProudMe is led by Dr.
        Senlin Chen, Professor of LSU Kinesiology, and his team. This website
        includes two main components of the intervention: SMART Goal-Setting and
        ProudMe PE resources.
      </div>
      <div className="text-box">
        <strong>I. SMART Goal-Setting</strong>
        <ul>
          <li>
            SMART Goal-Setting refers to setting goals that are smart,
            measurable, attainable, realistic, and timely.{" "}
          </li>
          <li>
            Middle school students who are part of the Project ProudMe will be
            taught how to set SMART goals for their daily physical activity,
            screen-time, fruit/vegetable consumption, and sleep time.{" "}
          </li>
          <li>
            Each student will be instructed to register a ProudMe account using
            their email address and protect the account with a password.{" "}
          </li>
          <li>
            Each student will be asked to (1) sign in the ProudMe website, (2)
            set SMART behavior goals regularly (e.g., once a day) and then (3)
            track their engagement of each health-related behavior (physical
            activity, screen time, fruit/vegetable consumption, sleep time).{" "}
          </li>
          <li>
            Each student, while on the Project ProudMe website, will interact
            with the website, to become mindful of their behavior goals and
            behavior engagement, in reference to the recommended levels of the
            behaviors.
          </li>
          <li>
            Each student, while on the Project ProudMe website, will be asked to
            receive and process automatic feedback from the website and then
            adjust their future behaviors, including goal-setting,
            participation, and reflection.
          </li>
        </ul>
      </div>

      <div className="text-box">
        <strong>II. ProudMe PE Resources </strong>
        <div>This website publishes important resources
        related to the ProudMe PE curriculum. This is a 12-lesson curriculum
        unit that educates middle school students' knowledge, skill, and disposition to
        adopt obesity-prevention behaviors (more physical activity, less screen
        time, more fruits/vegetables, and get enough sleep). The website
        contains lesson plans for the curriculum unit that are accessible for
        teacher users. It also contains videos and other resources that may
        facilitate the implementation of ProudMe PE lessons.
        </div>
      </div>

      <div className="text-box">
        For questions about the Project ProudMe, please contact Dr. Chen’s lab –
        the Pedagogical Kinesiology Lab (
        <a href="mailto:pklab@lsu.edu?subject=Project%20ProudME%20Feedback">
          pklab@lsu.edu
        </a>
        ). If your school is interested in becoming a partnership school, our
        lab offers small grants as incentives for you to participate. Please
        contact Dr. Chen (
        <a href="mailto:senlinchen@lsu.edu?subject=Project%20ProudME%20Partnership%20Request">
          senlinchen@lsu.edu
        </a>
        ). Thank you!
      </div>
      {/* <div className="imageWrapper">
        <div className="left-icons">
          <a className="click-icons" onClick={() => navigate("/pet")}>
            <img
              className="miniGamesIcon"
              src={require("../components/images/home/mini_games_icon.png")}
            />
          </a>
          <a className="click-icons" onClick={() => navigate("/pe")}>
            <img
              className="peIcon"
              src={require("../components/images/home/proudme_pe_icon.png")}
            />
          </a>
          <a className="click-icons" onClick={() => navigate("/pet")}>
            <img
              className="petStoreIcon"
              src={require("../components/images/home/pet_store_icon.png")}
            />
          </a>
        </div>
        <img
          className="petRoom"
          src={require("../components/images/home/pet_room_icon.png")}
        />
        <Button
          style={{
            fontSize: "25px",
            position: "absolute",
            zIndex: "1",
            margin: "auto",
            textTransform: "none",
            backgroundColor: "#EED5AB",
            borderRadius: "50px",
            color: "#A87B06",
            fontWeight: "bold",
            padding: "10px 30px 10px 30px",
            marginTop: "29%",
          }}
        >
          Visit PetName!
        </Button>
        <div className="right-icons">
          <a className="click-icons" onClick={() => navigate("/journal")}>
            <img
              className="checkinIcon"
              src={require("../components/images/home/checkin_icon.png")}
            />
          </a>
          <a className="click-icons" onClick={() => navigate("/journal")}>
            <img
              className="journalIcon"
              src={require("../components/images/home/journal_icon.png")}
            />
          </a>
        </div>
      </div> */}
    </HomeWrapper>
  );
};

export default withAuth(HomeScreen);
