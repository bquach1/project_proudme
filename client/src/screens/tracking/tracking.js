import React, { useEffect, useState } from "react";
import axios from "axios";
import styled from "styled-components";
import {
  Select,
  Button,
  MenuItem,
  FormControl,
  InputLabel,
  Radio,
  FormLabel,
  RadioGroup,
  FormControlLabel,
} from "@mui/material";

import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { DateRange } from "react-date-range";
import { format, addDays, subDays } from "date-fns";

import BehaviorProgressBar from "screens/tracking/components/charts/BehaviorProgressBar";
import BehaviorLineChart from "screens/tracking/components/charts/BehaviorLineChart";

import { has } from "lodash";

import { BehaviorTrackingCSV } from "screens/journal/csv";
import { DATABASE_URL } from "constants";
import withAuth from "components/auth/withAuth";
import { useMediaQuery } from "react-responsive";

const TrackingWrapper = styled.div`
  padding-bottom: 50px;

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

// Render the chart component
const TrackingScreen = () => {

  const isMobile = useMediaQuery({ query: "(max-width: 800px)" });
  const isTablet = useMediaQuery({ query: "(max-width: 1200px)" });

  const [user, setUser] = useState([]);
  const [shownUser, setShownUser] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [userInput, setUserInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [userBehaviorData, setUserBehaviorData] = useState([]);

  const [chartType, setChartType] = useState("line");
  const [lineChartView, setLineChartView] = useState("behaviorOnly");

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
      startDate: subDays(new Date(), isMobile ? 5 : 7),
      endDate: addDays(subDays(new Date(), 7), 7),
      key: "selection",
    },
  ]);
  const [calendarOpen, setCalendarOpen] = useState(false);

  useEffect(() => {
    setFilteredActivityBehaviorData(
      activityBehaviorData.filter((item) => {
        return (
          new Date(item.date) <= dateRange[0].endDate &&
          new Date(item.date) >= dateRange[0].startDate
        );
      })
    );
    setFilteredScreentimeBehaviorData(
      screentimeBehaviorData.filter((item) => {
        return (
          new Date(item.date) <= dateRange[0].endDate &&
          new Date(item.date) >= dateRange[0].startDate
        );
      })
    );
    setFilteredEatingBehaviorData(
      eatingBehaviorData.filter((item) => {
        return (
          new Date(item.date) <= dateRange[0].endDate &&
          new Date(item.date) >= dateRange[0].startDate
        );
      })
    );
    setFilteredSleepBehaviorData(
      sleepBehaviorData.filter((item) => {
        return (
          new Date(item.date) <= dateRange[0].endDate &&
          new Date(item.date) >= dateRange[0].startDate
        );
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

    const fetchUserBehaviors = async () => {
      try {
        const response = await axios.get(`${DATABASE_URL}/behaviors`, {
          params: {
            user: shownUser,
          },
        });
        setUserBehaviorData(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchActivityBehaviors();
    fetchScreentimeBehaviors();
    fetchEatingBehaviors();
    fetchSleepBehaviors();
    fetchUserBehaviors();
  }, [shownUser]);

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
            behaviorData={userBehaviorData}
            user={shownUser.name}
            userData={shownUser}
          />
        </>
      )}

      <FormControl
        style={{
          display: "flex",
          alignItems: "center",
          flexDirection: "column",
        }}
      >
        <FormLabel id="demo-radio-buttons-group-label">Chart Type</FormLabel>
        <RadioGroup
          aria-labelledby="demo-radio-buttons-group-label"
          defaultValue="line"
          name="radio-buttons-group"
          onChange={(e) => setChartType(e.target.value)}
        >
          <FormControlLabel value="line" control={<Radio />} label="Line" />
          <FormControlLabel
            value="progress"
            control={<Radio />}
            label="Progress Bar"
          />
        </RadioGroup>
      </FormControl>

      {chartType === "line" && (
        <FormControl style={{ margin: "10px 0px" }}>
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
        {chartType === "line" ? (
          <div style={{ width: "90%" }}>
            <h1 style={{ marginTop: "1%" }}>
              {shownUser.firstName}'s Physical Activity Behavior Data
            </h1>
            <BehaviorLineChart
              data={filteredActivityBehaviorData}
              chartGoalType={"activity"}
              lineChartView={lineChartView}
            />
            <h1>{shownUser.firstName}'s Screen Time Behavior Data</h1>
            <BehaviorLineChart
              data={filteredScreentimeBehaviorData}
              chartGoalType={"screentime"}
              lineChartView={lineChartView}
            />
            <h1>
              {shownUser.firstName}'s Eating Fruits & Vegetables Behavior Data
            </h1>
            <BehaviorLineChart
              data={filteredEatingBehaviorData}
              chartGoalType={"eating"}
              lineChartView={lineChartView}
            />
            <h1>{shownUser.firstName}'s Sleep Behavior Data</h1>
            <BehaviorLineChart
              data={filteredSleepBehaviorData}
              chartGoalType={"sleep"}
              lineChartView={lineChartView}
            />
          </div>
        ) : (
          <>
            <h1>{shownUser.firstName}'s Physical Activity Behavior Data</h1>
            <BehaviorProgressBar
              data={filteredActivityBehaviorData}
              chartGoalType={"activity"}
              lineChartView={lineChartView}
            />
            <h1>{shownUser.firstName}'s Screen Time Behavior Data</h1>
            <BehaviorProgressBar
              data={filteredScreentimeBehaviorData}
              chartGoalType={"screentime"}
              lineChartView={lineChartView}
            />
            <h1>
              {shownUser.firstName}'s Eating Fruits & Vegetables Behavior Data
            </h1>
            <BehaviorProgressBar
              data={filteredEatingBehaviorData}
              chartGoalType={"eating"}
              lineChartView={lineChartView}
            />
            <h1>{shownUser.firstName}'s Sleep Behavior Data</h1>
            <BehaviorProgressBar
              data={filteredSleepBehaviorData}
              chartGoalType={"sleep"}
              lineChartView={lineChartView}
            />
          </>
        )}
      </div>
    </TrackingWrapper>
  );
};

export default withAuth(TrackingScreen);
