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
  InputLabel,
} from "@mui/material";

import { DateRange } from "react-date-range";
import { format, addDays, subDays } from "date-fns";

import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";

import { has } from "lodash";

import withAuth from "../../components/auth/withAuth";
import { BehaviorTrackingCSV } from "../journal/csv";
import { DATABASE_URL } from "../../constants";

const TrackingWrapper = styled.div`
  .input-box {
    cursor: pointer;
    width: 15%;
    padding: 10px;
    margin: 0 auto;
    text-align: center;
    display: flex;
  }

  .calendarElement {
    width: auto;
    margin: 0 auto;
  }
`;

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
        {payload.map((pld, index) => (
          <div key={index}>
            {pld.dataKey === "goalValue" ? (
              <div id={`goal-${index}`} style={{ color: "#A7C7E7" }}>
                Goal Value: {pld.value}
              </div>
            ) : pld.dataKey === "behaviorValue" ? (
              <div id={`behavior-${index}`} style={{ color: "#8884d8" }}>
                Behavior Value: {pld.value}
              </div>
            ) :
              <div id={`recommendedVal-${index}`} style={{ color: "green" }}>
                Recommended Value: {pld.value}
              </div>
            }
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
      <div style={{ display: "flex" }}>
          <div
            style={{
              backgroundColor: "#A7C7E7",
              width: 20,
              height: 15,
              marginRight: 10,
            }}
          />
          Goal Value
        </div>
        <div style={{ display: "flex" }}>
          <div
            style={{
              backgroundColor: "#8884d8",
              width: 20,
              height: 15,
              marginRight: 10,
            }}
          />
          Behavior Value (Met Goal)
        </div>
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

const BehaviorLineChart = ({ data, chartGoalType, lineChartView }) => {
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
          chartGoalType === "activity"
            ? 70
            : chartGoalType === "screentime"
            ? 130
            : chartGoalType === "eating"
            ? 6
            : 9,
        ]}
      >
        <Label
          value={
            chartGoalType === "sleep"
              ? "hours/day"
              : chartGoalType === "eating"
              ? "servings/day"
              : "minutes/day"
          }
          position="insideLeft"
          offset={-70}
        />
      </YAxis>

      <Tooltip content={<CustomTooltip />} />
      { lineChartView !== "behaviorOnly" &&
      <Line
        type="linear"
        dataKey="goalValue"
        stroke="#A7C7E7"
        strokeWidth={3}
        activeDot={{ r: 6 }}
        label
      />
      }
      
      <defs>
        <linearGradient
          id={`colorUv${chartGoalType}`}
          x1="0%"
          y1="0%"
          x2="100%"
          y2="0%"
        >
          {data.map((entry, index) => {
            const colorOffset = (index / (data.length - 1)) * 100;
            const stopColor =
              chartGoalType === "screentime" &&
              entry.behaviorValue > entry.goalValue * 2
                ? "#FF6961"
                : chartGoalType === "screentime" &&
                  entry.behaviorValue > entry.goalValue
                ? "#FFC000"
                : chartGoalType === "screentime" &&
                  entry.behaviorValue < entry.goalValue
                ? "#77DD77"
                : entry.behaviorValue > entry.goalValue
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

      { lineChartView !== "goalOnly" &&
      <Line
        type="linear"
        dataKey="behaviorValue"
        stroke={`url(#colorUv${chartGoalType})`}
        strokeWidth={3}
        activeDot={{ r: 6 }}
      />
      }
      <Legend wrapperStyle={{ paddingTop: 20 }} content={<CustomLegend />} />
      <ReferenceLine
        y={
          chartGoalType === "activity"
            ? 60
            : chartGoalType === "screentime"
            ? 120
            : chartGoalType === "eating"
            ? 5
            : 9
        }
        label={{
          value: "Recommended Level",
          className: "tracking-reference",
          fill: "black",
          position: "top",
        }}
        stroke="green"
        strokeWidth={2}
      />
    </LineChart>
  );
};

const BehaviorBarChart = ({ data, chartGoalType }) => {
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
          chartGoalType === "activity"
            ? 70
            : chartGoalType === "screentime"
            ? 130
            : chartGoalType === "eating"
            ? 6
            : 9,
        ]}
      >
        <Label
          value={
            chartGoalType === "sleep"
              ? "hours/day"
              : chartGoalType === "eating"
              ? "servings/day"
              : "minutes/day"
          }
          position="insideLeft"
          offset={-70}
        />
      </YAxis>
      <Tooltip content={<CustomTooltip />} />
      <Bar dataKey="recommendedValue" fill="green" stackId="stack" />
      <Bar dataKey="goalValue" fill="#A7C7E7" stackId="stack"/>
      <Bar dataKey="behaviorValue" stackId="stack">
        {data.map((entry, index) => (
          <Cell
            key={index}
            fill={
              chartGoalType === "screentime" &&
              entry.behaviorValue > entry.goalValue * 2
                ? "#FF6961"
                : chartGoalType === "screentime" &&
                  entry.behaviorValue > entry.goalValue
                ? "#FFC000"
                : chartGoalType === "screentime" &&
                  entry.behaviorValue < entry.goalValue
                ? "#77DD77"
                : entry.behaviorValue > entry.goalValue
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
      {/* <ReferenceLine
        y={
          chartGoalType === "activity"
            ? 60
            : chartGoalType === "screentime"
            ? 120
            : chartGoalType === "eating"
            ? 5
            : 9
        }
        label={{
          value: "Recommended Level",
          className: "tracking-reference",
          fill: "black",
          position: "top",
        }}
        stroke="green"
        strokeWidth={2}
      /> */}
      <Legend wrapperStyle={{ paddingTop: 20 }} content={<CustomLegend />} />
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
  const [lineChartView, setLineChartView] = useState("bothLines");

  const [activityBehaviorData, setActivityBehaviorData] = useState([]);
  const [filteredActivityBehaviorData, setFilteredActivityBehaviorData] =
    useState(activityBehaviorData);
  const [screentimeBehaviorData, setScreentimeBehaviorData] = useState([]);
  const [filteredScreentimeBehaviorData, setFilteredScreentimeBehaviorData] =
    useState(screentimeBehaviorData);
  const [eatingBehaviorData, setEatingBehaviorData] = useState([]);
  const [filteredEatingBehaviorData, setFilteredEatingBehaviorData] =
    useState(eatingBehaviorData);
  const [sleepBehaviorData, setSleepBehaviorData] = useState([]);
  const [filteredSleepBehaviorData, setFilteredSleepBehaviorData] =
    useState(sleepBehaviorData);

  const [dateRange, setDateRange] = useState([
    {
      startDate: subDays(new Date(), 7),
      endDate: addDays(subDays(new Date(), 7), 7),
      key: "selection",
    },
  ]);
  const [calendarOpen, setCalendarOpen] = useState(false);

  useEffect(() => {
    console.log(activityBehaviorData);
  })

  useEffect(() => {
    setFilteredActivityBehaviorData(
      activityBehaviorData.filter((item) => {
        if (
          new Date(item.date) < dateRange[0].endDate &&
          new Date(item.date) > dateRange[0].startDate
        ) {
          return item;
        }
      })
    );
    setFilteredScreentimeBehaviorData(
      screentimeBehaviorData.filter((item) => {
        if (
          new Date(item.date) < dateRange[0].endDate &&
          new Date(item.date) > dateRange[0].startDate
        ) {
          return item;
        }
      })
    );
    setFilteredEatingBehaviorData(
      eatingBehaviorData.filter((item) => {
        if (
          new Date(item.date) < dateRange[0].endDate &&
          new Date(item.date) > dateRange[0].startDate
        ) {
          return item;
        }
      })
    );
    setFilteredSleepBehaviorData(
      sleepBehaviorData.filter((item) => {
        if (
          new Date(item.date) < dateRange[0].endDate &&
          new Date(item.date) > dateRange[0].startDate
        ) {
          return item;
        }
      })
    );
  }, [
    dateRange,
    activityBehaviorData,
    screentimeBehaviorData,
    eatingBehaviorData,
    sleepBehaviorData,
  ]);

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
    <TrackingWrapper>
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

      {chartType === "line" && (
          <FormControl style={{margin: "10px 0px"}}>
            <InputLabel id="line-chart-view">Line View</InputLabel>
            <Select
              labelId="line-chart-view"
              id="line-view"
              value={lineChartView}
              label="Line View"
              onChange={(e) => setLineChartView(e.target.value)}
            >
              <MenuItem value="bothLines">Goal and Behavior Lines</MenuItem>
              <MenuItem value="goalOnly">Goal Line</MenuItem>
              <MenuItem value="behaviorOnly">Behavior Line</MenuItem>
            </Select>
          </FormControl>
        )}

      <div>
        <input
          value={`${format(dateRange[0].startDate, "MM/dd/yyyy")} to ${format(
            dateRange[0].endDate,
            "MM/dd/yyyy"
          )}`}
          readOnly
          className="input-box"
          onClick={() => setCalendarOpen(!calendarOpen)}
        />
        {calendarOpen && (
          <DateRange
            onChange={(item) => setDateRange([item.selection])}
            editableDateInputs={true}
            moveRangeOnFirstSelection={false}
            ranges={dateRange}
            months={1}
            direction="horizontal"
            className="calendarElement"
          />
        )}
      </div>

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
            data={filteredActivityBehaviorData}
            chartGoalType={"activity"}
            lineChartView={lineChartView}
          />
        ) : (
          <BehaviorBarChart
            data={filteredActivityBehaviorData}
            chartGoalType={"activity"}
          />
        )}
        <h1>{shownUser.name}'s Screentime Behavior Data</h1>
        {chartType === "line" ? (
          <BehaviorLineChart
            data={filteredScreentimeBehaviorData}
            chartGoalType={"screentime"}
            lineChartView={lineChartView}
          />
        ) : (
          <BehaviorBarChart
            data={filteredScreentimeBehaviorData}
            chartGoalType={"screentime"}
          />
        )}
        <h1>{shownUser.name}'s Eating Behavior Data</h1>
        {chartType === "line" ? (
          <BehaviorLineChart
            data={filteredEatingBehaviorData}
            chartGoalType={"eating"}
            lineChartView={lineChartView}
          />
        ) : (
          <BehaviorBarChart
            data={filteredEatingBehaviorData}
            chartGoalType={"eating"}
          />
        )}
        <h1>{shownUser.name}'s Sleep Behavior Data</h1>
        {chartType === "line" ? (
          <BehaviorLineChart
            data={filteredSleepBehaviorData}
            chartGoalType={"sleep"}
            lineChartView={lineChartView}
          />
        ) : (
          <BehaviorBarChart
            data={filteredSleepBehaviorData}
            chartGoalType={"sleep"}
          />
        )}
      </div>
    </TrackingWrapper>
  );
};

export default withAuth(TrackingScreen);
