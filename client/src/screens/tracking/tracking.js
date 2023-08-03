import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
  Label,
} from "recharts";
import axios from "axios";
import styled from "styled-components";
import {
  Select,
  Button,
  MenuItem,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";

import { has } from "lodash";

import withAuth from "../../components/auth/withAuth";
import { BehaviorTrackingCSV, GoalCSV } from "../journal/csv";

const FilterWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  margin-top: 1%;
  margin-bottom: 1%;
`;

const BehaviorLineChart = ({ data, chartType }) => {
  return (
    <LineChart
      width={800}
      height={600}
      data={data}
      margin={{ top: 55, right: 80, left: 70, bottom: 70 }}
    >
      <CartesianGrid strokeDasharray="3 3" />

      <XAxis dataKey="date">
        <Label value="Date" position="bottom" />
      </XAxis>

      <YAxis>
        <Label
          value={
            chartType === "sleep"
              ? "hours/day"
              : chartType === "eating"
              ? "servings/day"
              : "minutes/day"
          }
          position="insideLeft"
          offset={-70}
        />
      </YAxis>

      <Tooltip />
      <Line
        type="monotone"
        dataKey="behaviorValue"
        stroke="#8884d8"
        activeDot={{ r: 8 }}
      />
    </LineChart>
  );
};

const BehaviorBarChart = ({ data, chartType }) => {
  return (
    <BarChart
      width={800}
      height={600}
      data={data}
      margin={{ top: 55, right: 80, left: 70, bottom: 70 }}
    >
      <CartesianGrid strokeDasharray="3 3" />

      <XAxis dataKey="date">
        <Label value="Date" position="bottom" />
      </XAxis>

      <YAxis>
        <Label
          value={
            chartType === "sleep"
              ? "hours/day"
              : chartType === "eating"
              ? "servings/day"
              : "minutes/day"
          }
          position="insideLeft"
          offset={-70}
        />
      </YAxis>
      <Tooltip />
      <Bar dataKey="behaviorValue" fill="#8884d8" />
    </BarChart>
  );
};

// Render the chart component
const TrackingScreen = () => {
  const [user, setUser] = useState([]);
  const [shownUser, setShownUser] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [userInput, setUserInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentGoalData, setCurrentGoalData] = useState([]);
  const [allGoalData, setAllGoalData] = useState([]);
  const [allBehaviorData, setAllBehaviorData] = useState([]);

  const [chartType, setChartType] = useState("line");

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

  useEffect(() => {
    const fetchAllGoals = async () => {
      try {
        const response = await axios.get("http://localhost:3001/allGoals", {});
        setAllGoalData(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    const fetchSelectedUserGoals = async () => {
      try {
        const response = await axios.get("http://localhost:3001/goals", {
          params: {
            user: shownUser,
          },
        });
        setCurrentGoalData(response.data);
        console.log(response.data);
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
        console.log(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchAllGoals();
    fetchSelectedUserGoals();
    fetchAllBehaviors();
  }, [user]);

  return (
    <>
      {!has(user, "admin") ? (
        <div
          style={{
            textAlign: "center",
            fontSize: 30,
            fontWeight: "bold",
            margin: "1%",
          }}
        >
          Behavior Tracking
        </div>
      ) : (
          <div
            style={{
              textAlign: "center",
              fontSize: 30,
              fontWeight: "bold",
              margin: "1%",
            }}
          >
            Behavior Tracking (Admin)
          </div>
      )}

      {has(user, "admin") && (
        <>
          <Select
            placeholder="Search for user"
            id="input"
            type="text"
            label="Search"
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
            style={{
              backgroundColor: "green",
              color: "white",
              marginLeft: "1rem",
              textTransform: "none",
            }}
          >
            Submit
          </Button>
          <GoalCSV goalData={currentGoalData} user={shownUser.name} />
          <BehaviorTrackingCSV
            allBehaviorData={allBehaviorData}
            user={shownUser.name}
          />
        </>
      )}

      <FilterWrapper>
        <FormControl>
          <FormLabel id="demo-radio-buttons-group-label">Chart Type</FormLabel>
          <RadioGroup
            aria-labelledby="demo-radio-buttons-group-label"
            value={chartType}
            name="radio-buttons-group"
            style={{ display: "flex", flexDirection: "row" }}
          >
            <FormControlLabel
              value="line"
              control={<Radio onClick={(e) => setChartType(e.target.value)} />}
              label="Line Chart"
            />
            <FormControlLabel
              value="bar"
              control={<Radio onClick={(e) => setChartType(e.target.value)} />}
              label="Bar Chart"
            />
          </RadioGroup>
        </FormControl>
      </FilterWrapper>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <h1>{shownUser.name}'s Activity Behavior Data</h1>
        {chartType === "line" ? (
          <BehaviorLineChart
            data={activityBehaviorData}
            chartType={"activity"}
          />
        ) : (
          <BehaviorBarChart
            data={activityBehaviorData}
            chartType={"activity"}
          />
        )}
        <h1>{shownUser.name}'s Screentime Behavior Data</h1>
        {chartType === "line" ? (
          <BehaviorLineChart
            data={screentimeBehaviorData}
            chartType={"screentime"}
          />
        ) : (
          <BehaviorBarChart
            data={screentimeBehaviorData}
            chartType={"screentime"}
          />
        )}
        <h1>{shownUser.name}'s Eating Behavior Data</h1>
        {chartType === "line" ? (
          <BehaviorLineChart data={eatingBehaviorData} chartType={"eating"} />
        ) : (
          <BehaviorBarChart data={eatingBehaviorData} chartType={"eating"} />
        )}
        <h1>{shownUser.name}'s Sleep Behavior Data</h1>
        {chartType === "line" ? (
          <BehaviorLineChart data={sleepBehaviorData} chartType={"sleep"} />
        ) : (
          <BehaviorBarChart data={sleepBehaviorData} chartType={"sleep"} />
        )}
      </div>
    </>
  );
};

export default withAuth(TrackingScreen);
