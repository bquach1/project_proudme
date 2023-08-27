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
  ReferenceLine,
  Cell,
  Legend,
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
  DateRangePicker,
} from "@mui/material";

import { has } from "lodash";

import withAuth from "../../components/auth/withAuth";
import { BehaviorTrackingCSV } from "../journal/csv";
import { DATABASE_URL } from "../../constants";

const FilterWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  margin-top: 1%;
  margin-bottom: 1%;
`;

export const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div
        style={{
          border: "1px solid rgb(204, 204, 204)",
          padding: "10px",
          backgroundColor: "white",
        }}
      >
        <p className="label">{`${label}`}</p>
        {payload.map((pld) => (
          <div>
            {pld.dataKey === "goalValue" ? (
              <div style={{ color: "#A7C7E7" }}>Goal Value: {pld.value}</div>
            ) : (
              <div style={{ color: "#8884d8" }}>
                Behavior Value: {pld.value}
              </div>
            )}
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export const CustomLegend = ({ payload }) => {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        flexDirection: "column",
        backgroundColor: "#D3D3D3",
        marginTop: "2%",
        width: "40%",
        margin: "0 auto",
        padding: 10,
        border: "1px solid black",
      }}
    >
      <h2 style={{ width: "20%" }}>Legend</h2>
      <div style={{ display: "flex", flexDirection: "column" }}>
        {payload.map((entry, index) => (
          <div style={{ display: "flex" }}>
            <div
              style={{
                backgroundColor:
                  entry.value === "goalValue" ? "#A7C7E7" : "#8884d8",
                width: 20,
                height: 15,
                marginRight: 10,
              }}
            />
            <div key={index}>
              {entry.value === "goalValue"
                ? "Goal Value"
                : entry.value === "behaviorValue"
                ? "Behavior Value (Met Goal)"
                : null}
            </div>
          </div>
        ))}
        <div style={{ display: "flex" }}>
          <div
            style={{
              backgroundColor: "#77DD77",
              width: 20,
              height: 15,
              marginRight: 10,
            }}
          />
          Behavior Value (Exceeds Goal)
        </div>
        <div style={{ display: "flex" }}>
          <div
            style={{
              backgroundColor: "#FF6961",
              width: 20,
              height: 15,
              marginRight: 10,
            }}
          />
          Behavior Value (Needs Improvement)
        </div>
        <div style={{ display: "flex" }}>
          <div
            style={{
              backgroundColor: "#FFC000",
              width: 20,
              height: 15,
              marginRight: 10,
            }}
          />
          Behavior Value (Close to Goal)
        </div>
      </div>
    </div>
  );
};

export const CustomBar = {};

const BehaviorLineChart = ({ data, chartType }) => {
  return (
    <LineChart
      width={1000}
      height={800}
      data={data}
      margin={{ top: 55, right: 80, left: 70, bottom: 70 }}
    >
      <CartesianGrid strokeDasharray="3 3" fill="white" />

      <XAxis dataKey="date">
        <Label value="Date" position="bottom" />
      </XAxis>

      <YAxis
        domain={[
          0,
          chartType === "activity"
            ? 70
            : chartType === "screentime"
            ? 130
            : chartType === "eating"
            ? 6
            : 9,
        ]}
      >
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

      <Tooltip content={<CustomTooltip />} />
      <Legend wrapperStyle={{ paddingTop: 20 }} content={<CustomLegend />} />
      <Line
        type="linear"
        dataKey="goalValue"
        stroke="#A7C7E7"
        strokeWidth={3}
        activeDot={{ r: 6 }}
      />
      <defs>
        <linearGradient id="colorUv" x1="0%" y1="0%" x2="100%" y2="0%">
          {data.map((entry, index) => {
            const colorOffset = (index / (data.length - 1)) * 100;            
            const stopColor =
              entry.behaviorValue > entry.goalValue
              ? "#77DD77"
              : entry.behaviorValue === entry.goalValue
              ? "#8884d8"
              : entry.behaviorValue < entry.goalValue / 2
              ? "#FF6961"
              : "#FFC000";

            return (
              <stop
                key={index}
                offset={`${colorOffset}%`}
                stopColor={stopColor}
              />
            );
          })}
        </linearGradient>
      </defs>
      <Line
        type="linear"
        dataKey="behaviorValue"
        stroke={'url(#colorUv)'}
        strokeWidth={3}
        activeDot={{ r: 6 }}
      />
      <ReferenceLine
        y={
          chartType === "activity"
            ? 60
            : chartType === "screentime"
            ? 120
            : chartType === "eating"
            ? 5
            : 9
        }
        label={{
          value: "Recommended Level",
          className: "tracking-reference",
          fill: "#FF7F50",
          position: "top",
        }}
        stroke="green"
        strokeWidth={2}
      />
    </LineChart>
  );
};

const BehaviorBarChart = ({ data, chartType }) => {
  return (
    <BarChart
      width={1000}
      height={800}
      data={data}
      margin={{ top: 55, right: 80, left: 70, bottom: 70 }}
    >
      <CartesianGrid strokeDasharray="3 3" fill="white" />

      <XAxis dataKey="date">
        <Label value="Date" position="bottom" />
      </XAxis>

      <YAxis
        domain={[
          0,
          chartType === "activity"
            ? 70
            : chartType === "screentime"
            ? 130
            : chartType === "eating"
            ? 6
            : 9,
        ]}
      >
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
      <Tooltip content={<CustomTooltip />} />
      <Bar dataKey="goalValue" fill="#A7C7E7" />
      <Bar dataKey="behaviorValue">
        {data.map((entry) => (
          <Cell
            fill={
              entry.behaviorValue > entry.goalValue
                ? "#77DD77"
                : entry.behaviorValue === entry.goalValue
                ? "#8884d8"
                : entry.behaviorValue < entry.goalValue / 2
                ? "#FF6961"
                : "#FFC000"
            }
          />
        ))}
      </Bar>
      <Legend wrapperStyle={{ paddingTop: 20 }} content={<CustomLegend />} />
      <ReferenceLine
        y={
          chartType === "activity"
            ? 60
            : chartType === "screentime"
            ? 120
            : chartType === "eating"
            ? 5
            : 9
        }
        label={{
          value: "Recommended Level",
          className: "tracking-reference",
          fill: "#FF7F50",
          position: "top",
        }}
        stroke="green"
        strokeWidth={2}
      />
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
  const [allBehaviorData, setAllBehaviorData] = useState([]);

  const [chartType, setChartType] = useState("bar");

  const [activityBehaviorData, setActivityBehaviorData] = useState([]);
  const [screentimeBehaviorData, setScreentimeBehaviorData] = useState([]);
  const [eatingBehaviorData, setEatingBehaviorData] = useState([]);
  const [sleepBehaviorData, setSleepBehaviorData] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    fetch(`${DATABASE_URL}/users`, {
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

    fetch(`${DATABASE_URL}/allUsers`)
      .then((response) => response.json())
      .then((data) => {
        setAllUsers(data);
      })
      .catch((error) => console.error(error));
  }, []);

  useEffect(() => {
    const fetchActivityBehaviors = async () => {
      try {
        const response = await axios.get(`${DATABASE_URL}/behaviorType`, {
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
        const response = await axios.get(`${DATABASE_URL}/behaviorType`, {
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
        const response = await axios.get(`${DATABASE_URL}/behaviorType`, {
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
        const response = await axios.get(`${DATABASE_URL}/behaviorType`, {
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
    const fetchSelectedUserGoals = async () => {
      try {
        const response = await axios.get(`${DATABASE_URL}/goals`, {
          params: {
            user: shownUser,
          },
        });
        setCurrentGoalData(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    const fetchAllBehaviors = async () => {
      try {
        const response = await axios.get(`${DATABASE_URL}/allBehaviors`, {});
        setAllBehaviorData(response.data);
      } catch (error) {
        console.error(error);
      }
    };
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
              value="bar"
              control={<Radio onClick={(e) => setChartType(e.target.value)} />}
              label="Bar Chart"
            />
            <FormControlLabel
              value="line"
              control={<Radio onClick={(e) => setChartType(e.target.value)} />}
              label="Line Chart"
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
