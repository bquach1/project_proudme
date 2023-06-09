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
import { Select, Button, MenuItem } from "@mui/material";

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
  const [shownUser, setShownUser] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [userInput, setUserInput] = useState("");
  const [loading, setLoading] = useState(true);

  const [activityBehaviorData, setActivityBehaviorData] = useState([]);
  const [screentimeBehaviorData, setScreentimeBehaviorData] = useState([]);
  const [eatingBehaviorData, setEatingBehaviorData] = useState([]);
  const [sleepBehaviorData, setSleepBehaviorData] = useState([]);

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
        setShownUser(data);
        setUserInput(data.name);
      })
      .then(() => setLoading(false))
      .catch((error) => console.error(error));

    fetch(`http://localhost:3001/allUsers`)
      .then((response) => response.json())
      .then((data) => {
        setAllUsers(data);
      })
      .catch((error) => console.error(error));
  }, []);

  useEffect(() => {
    const fetchActivityBehaviors = async () => {
      try {
        const response = await axios.get("http://localhost:3001/behaviorType", {
          params: {
            user: shownUser,
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
            user: shownUser,
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
            user: shownUser,
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
            user: shownUser,
            goalType: "sleep",
          },
        });
        setSleepBehaviorData(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchActivityBehaviors();
    fetchScreentimeBehaviors();
    fetchEatingBehaviors();
    fetchSleepBehaviors();
  }, [shownUser]);

  return (
    <>
      <FilterWrapper>
        <Select
          placeholder="Search for user"
          id="input"
          type="text"
          label="Search for user's behavior chart"
          value={loading ? "" : userInput}
          style={{ width: "200px" }}
          onChange={(e) => {
            setUserInput(e.target.value);
          }}
        >
          {allUsers.map((user, index) => (
            <MenuItem key={index} value={user.name}>
              {user.name}
            </MenuItem>
          ))}
        </Select>
        <Button
          onClick={() => {
            setShownUser(allUsers.find((user) => user.name === userInput));
          }}
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
        <h1>{shownUser.name}'s Activity Behavior Data</h1>
        <BehaviorLineChart data={activityBehaviorData} />
        <h1>{shownUser.name}'s Screentime Behavior Data</h1>
        <BehaviorLineChart data={screentimeBehaviorData} />
        <h1>{shownUser.name}'s Eating Behavior Data</h1>
        <BehaviorLineChart data={eatingBehaviorData} />
        <h1>{shownUser.name}'s Sleep Behavior Data</h1>
        <BehaviorLineChart data={sleepBehaviorData} />
      </div>
    </>
  );
};

export default TrackingScreen;
