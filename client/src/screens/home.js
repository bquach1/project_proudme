import React, { useState, useEffect } from "react";
import "css/home.css";
import styled from "styled-components";

import withAuth from "components/auth/withAuth";
import { DATABASE_URL } from "constants";

const Wrapper = styled.div`
  .title-container {
    position: absolute;
    top: 55%; /* Adjust the vertical position as needed */
    right: 5%; /* Adjust the horizontal position as needed */
    text-align: center; /* Center the text horizontally */
    z-index: 2; /* Ensure the title is displayed above the images */
    color: #fff; /* Text color */
    font-size: 2em; /* Adjust the font size as needed */
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5); /* Add a text shadow (optional) */
  }
`

const HomeWrapper = styled.div`
  width: 90%;
  margin: 0 auto;
  margin-top: 1%;
  text-align: left;

  font-family: Calibri;
  font-size: 20px;

  .home {
    text-align: center;
  }

  .text-box {
    margin-top: 2%;

    li {
      list-style-position: inside;
    }
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

const HomeScreen = (props) => {
  const [user, setUser] = useState([]);
  const [exactTime, setExactTime] = useState("");
  const [currentTime, setCurrentTime] = useState("");

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

  useEffect(() => {
    const timerID = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 1000);

    return () => {
      clearInterval(timerID);
    };
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
        <div className="home">
          {/* <h4>{exactTime}</h4>
          <h4>
            {currentTime ? (
              currentTime
            ) : (
              <div className="timeload-dots">...</div>
            )}
          </h4> */}
        </div>
        <div style={{ margin: 0 }}>
          <div className="text-box">
            ProudMe is an adolescent
            obesity prevention intervention in Louisiana. Project ProudMe is led
            by Dr. Senlin Chen, Professor of LSU Kinesiology, and his team. This
            website includes two main components of the intervention: SMART
            Goal-Setting and ProudMe PE resources.
          </div>
          <div className="text-box">
            <strong>I. SMART Goal-Setting</strong>
            <ul>
              <li>
                SMART Goal-Setting refers to setting goals that are smart,
                measurable, attainable, realistic, and timely.{" "}
              </li>
              <li>
                Middle school students who are part of the Project ProudMe will
                be taught how to set SMART goals for their daily physical
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
                then (3) track their engagement of each health-related behavior
                (physical activity, screen time, fruit/vegetable consumption,
                sleep time).{" "}
              </li>
              <li>
                Each student, while on the Project ProudMe website, will
                interact with the website to become mindful of their behavior
                goals and behavior engagement in reference to the recommended
                levels of the behaviors.
              </li>
              <li>
                Each student, while on the Project ProudMe website, will be
                asked to receive and process automatic feedback from the website
                and then adjust their future behaviors, including goal-setting,
                participation, and reflection.
              </li>
            </ul>
          </div>

          <div className="text-box">
            <strong>II. ProudMe PE Resources </strong>
            <div>
              This website publishes important resources related to the ProudMe
              PE curriculum. This is a 12-lesson curriculum unit that educates
              middle school students' knowledge, skill, and disposition to adopt
              obesity-prevention behaviors (more physical activity, less screen
              time, more fruits/vegetables, and get enough sleep). The website
              contains lesson plans for the curriculum unit that are accessible
              for teacher users. It also contains videos and other resources
              that may facilitate the implementation of ProudMe PE lessons.
            </div>
          </div>

          <div className="text-box">
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
    </Wrapper>
  );
};

export default withAuth(HomeScreen);
