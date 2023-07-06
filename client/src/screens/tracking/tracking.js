import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import axios from "axios";
import styled from "styled-components";
import { TextField, Button } from "@mui/material";

const FilterWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  margin-top: 1%;
  margin-bottom: 1%;
`;

const BehaviorLineChart = ({ data }) => {
  return (
    <LineChart
      width={600}
      height={400}
      data={data}
      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      title={"Activity Data Graph"}
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="formattedDate" label="Time" />
      <YAxis label="minutes/day" />
      <Tooltip />
      <Legend />
      <Line
        type="monotone"
        dataKey="behaviorValue"
        stroke="#8884d8"
        activeDot={{ r: 8 }}
      />
    </LineChart>
  );
};

// Render the chart component
const TrackingScreen = () => {
  const [user, setUser] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [userInput, setUserInput] = useState("");

  const [behaviorData, setBehaviorData] = useState([]);
  const [activityBehaviorData, setActivityBehaviorData] = useState([]);
  const [screentimeBehaviorData, setScreentimeBehaviorData] = useState([]);
  const [eatingBehaviorData, setEatingBehaviorData] = useState([]);
  const [sleepBehaviorData, setSleepBehaviorData] = useState([]);
  const [allBehaviorData, setAllBehaviorData] = useState([]);

  useEffect(() => {
    console.log(allUsers);
  });

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    fetch(`http://localhost:3001/users`),
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
        .then((response) => response.json())
        .then((data) => {
          setAllUsers(data);
        })
        .catch((error) => console.error(error));
  });

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    fetch(`http://localhost:3001/users`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setUser(data);
      })
      .catch((error) => console.error(error));
  }, []);

  useEffect(() => {
    const fetchBehaviors = async () => {
      try {
        const response = await axios.get("http://localhost:3001/behaviors", {
          params: {
            user: user,
          },
        });
        setBehaviorData(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    const fetchActivityBehaviors = async () => {
      try {
        const response = await axios.get("http://localhost:3001/behaviorType", {
          params: {
            user: user,
            goalType: "activity",
          },
        });
        setActivityBehaviorData(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    const fetchScreentimeBehaviors = async () => {
      try {
        const response = await axios.get("http://localhost:3001/behaviorType", {
          params: {
            user: user,
            goalType: "screentime",
          },
        });
        setScreentimeBehaviorData(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    const fetchEatingBehaviors = async () => {
      try {
        const response = await axios.get("http://localhost:3001/behaviorType", {
          params: {
            user: user,
            goalType: "eating",
          },
        });
        setEatingBehaviorData(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    const fetchSleepBehaviors = async () => {
      try {
        const response = await axios.get("http://localhost:3001/behaviorType", {
          params: {
            user: user,
            goalType: "sleep",
          },
        });
        setSleepBehaviorData(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    const fetchAllBehaviors = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3001/allBehaviors",
          {}
        );
        setAllBehaviorData(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchBehaviors();
    fetchActivityBehaviors();
    fetchScreentimeBehaviors();
    fetchEatingBehaviors();
    fetchSleepBehaviors();
    fetchAllBehaviors();
  }, [user]);

  return (
    <>
      <FilterWrapper>
        <TextField
          label="Search for user"
          id="input"
          type="text"
          value={userInput}
          onChange={(e) => {
            setUserInput(e.target.value);
          }}
        />
        <Button
          onClick={() => console.log(userInput)}
          style={{ backgroundColor: "green", color: "white" }}
        >
          Submit
        </Button>
      </FilterWrapper>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <h1>{user.name}'s Activity Behavior Data</h1>
        <BehaviorLineChart data={activityBehaviorData} />
        <h1>{user.name}'s Screentime Behavior Data</h1>
        <BehaviorLineChart data={screentimeBehaviorData} />
        <h1>{user.name}'s Eating Behavior Data</h1>
        <BehaviorLineChart data={eatingBehaviorData} />
        <h1>{user.name}'s Sleep Behavior Data</h1>
        <BehaviorLineChart data={sleepBehaviorData} />
      </div>
    </>
  );
};

export default TrackingScreen;
