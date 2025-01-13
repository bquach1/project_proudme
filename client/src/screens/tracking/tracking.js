import React, { useEffect, useState } from "react";
import axios from "axios";
import styled from "styled-components";
import {
  Select,
  Button,
  MenuItem,
  FormControl,
  Radio,
  FormLabel,
  RadioGroup,
  FormControlLabel,
} from "@mui/material";

import { useNavigate, Outlet } from 'react-router-dom';
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

import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import FolderIcon from '@mui/icons-material/Folder';
import RestoreIcon from '@mui/icons-material/Restore';
import FavoriteIcon from '@mui/icons-material/Favorite';
import LocationOnIcon from '@mui/icons-material/LocationOn';



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
  const ismobile = useMediaQuery({ query: "(max-width: 600px)" });
  const navigate = useNavigate();
  const [user, setUser] = useState([]);
  const [shownUser, setShownUser] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [userInput, setUserInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [userBehaviorData, setUserBehaviorData] = useState([]);
  const [allBehaviorData, setAllBehaviorData] = useState([]);

  const [chartType, setChartType] = useState("progress");

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
      startDate: subDays(new Date(), ismobile ? 5 : 7),
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
        console.log("eating behaviour type data", response.data)
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
        console.log("sleeping behaviour type data", response.data)
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

    const fetchAllUserBehaviors = async () => {
      try {
        const response = await axios.get(`${DATABASE_URL}/allBehaviors`, {
        });
        setAllBehaviorData(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchActivityBehaviors();
    fetchScreentimeBehaviors();
    fetchEatingBehaviors();
    fetchSleepBehaviors();
    fetchUserBehaviors();
    fetchAllUserBehaviors();
  }, [shownUser]);

  const [value, setValue] = React.useState('recents');

  const handleChange = (event, newValue) => {
    setValue(newValue);
  }

  console.log("filteredActivityBehaviorData", filteredActivityBehaviorData);
  return (
    <div>
      {ismobile && (
        <>
          <BottomNavigation style={{width: "100%", position: "fixed", bottom: 0, left: 0, zIndex: 1000, height: "10%", backgroundColor:  "#3C3293"}} value={value} onChange={handleChange}>
            <BottomNavigationAction
              label="Recents"
              value="recents"
              icon={<RestoreIcon />}
              onClick={() => navigate('/tracking/activityData')}
              sx={{
                "& .MuiBottomNavigationAction-label": {
                color: "white",  // Default color
                },
              }}
            />
            <BottomNavigationAction
              label="Favorites"
              value="favorites"
              icon={<FavoriteIcon />}
              onClick={() => navigate('/tracking/eatData')}
              sx={{
                "& .MuiBottomNavigationAction-label": {
                color: "white",  // Default color
                },
              }}
            />
            <BottomNavigationAction
              label="Nearby"
              value="nearby"
              icon={<LocationOnIcon />}
              onClick={() => navigate('/tracking/screenData')}
              sx={{
                "& .MuiBottomNavigationAction-label": {
                color: "white",  // Default color
                },
              }}
            />
            <BottomNavigationAction label="Folder" value="folder" icon={<FolderIcon />} onClick={() => navigate('/tracking/sleepData')}sx={{
                "& .MuiBottomNavigationAction-label": {
                color: "white",  // Default color
                },
              }}/>
          </BottomNavigation>
          <Outlet/>
        </>
      )}
      {!ismobile && (
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
                allBehaviorData={allBehaviorData}
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
              defaultValue="progress"
              name="radio-buttons-group"
              onChange={(e) => setChartType(e.target.value)}
              style={{ display: "flex", flexDirection: "row" }}
            >
              <FormControlLabel value="line" control={<Radio />} label="Line" />
              <FormControlLabel
                value="progress"
                control={<Radio />}
                label="Progress Bar"
              />
            </RadioGroup>
          </FormControl>
    
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
                months={3}
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
                  {shownUser.firstName}'s Physical Activity Behavior Data (minutes)
                </h1>
                <BehaviorLineChart
                  data={filteredActivityBehaviorData}
                  chartGoalType={"activity"}
                />
                <h1>{shownUser.firstName}'s Screen Time Behavior Data (minutes)</h1>
                <BehaviorLineChart
                  data={filteredScreentimeBehaviorData}
                  chartGoalType={"screentime"}
                />
                <h1>
                  {shownUser.firstName}'s Eating Fruits & Vegetables Behavior Data (servings)
                </h1>
                <BehaviorLineChart
                  data={filteredEatingBehaviorData}
                  chartGoalType={"eating"}
                />
                <h1>{shownUser.firstName}'s Sleep Behavior Data (hours)</h1>
                <BehaviorLineChart
                  data={filteredSleepBehaviorData}
                  chartGoalType={"sleep"}
                />
              </div>
            ) : (
              <>
                <div
                  style={{
                    width: "90%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    border: "1px solid black",
                    padding: 20,
                    margin: 50,
                  }}
                >
                  <h1>{shownUser.firstName}'s Physical Activity Behavior Data (minutes)</h1>
                  <BehaviorProgressBar
                    data={filteredActivityBehaviorData}
                    chartGoalType={"activity"}
                    type="goal"
                  />
                  <BehaviorProgressBar
                    data={filteredActivityBehaviorData}
                    chartGoalType={"activity"}
                    type="behavior"
                  />
                </div>
                <div
                  style={{
                    width: "90%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    border: "1px solid black",
                    padding: 20,
                    margin: 50,
                  }}
                >
                  <h1>{shownUser.firstName}'s Screen Time Behavior Data (minutes)</h1>
                  <BehaviorProgressBar
                    data={filteredScreentimeBehaviorData}
                    chartGoalType={"screentime"}
                    type="goal"
                  />
                  <BehaviorProgressBar
                    data={filteredScreentimeBehaviorData}
                    chartGoalType={"screentime"}
                    type="behavior"
                  />
                </div>
                <div
                  style={{
                    width: "90%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    border: "1px solid black",
                    padding: 20,
                    margin: 50,
                  }}
                >
                  <h1>
                    {shownUser.firstName}'s Eating Fruits & Vegetables Behavior Data (servings)
                  </h1>
                  <BehaviorProgressBar
                    data={filteredEatingBehaviorData}
                    chartGoalType={"eating"}
                    type="goal"
                  />
                  <BehaviorProgressBar
                    data={filteredEatingBehaviorData}
                    chartGoalType={"eating"}
                    type="behavior"
                  />
                </div>
                <div
                  style={{
                    width: "90%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    border: "1px solid black",
                    padding: 20,
                    margin: 50,
                  }}
                >
                  <h1>{shownUser.firstName}'s Sleep Behavior Data (hours) </h1>
                  <BehaviorProgressBar
                    data={filteredSleepBehaviorData}
                    chartGoalType={"sleep"}
                    type="goal"
                  />
                  <BehaviorProgressBar
                    data={filteredSleepBehaviorData}
                    chartGoalType={"sleep"}
                    type="behavior"
                  />
                </div>
              </>
            )}
          </div>
        </TrackingWrapper>
      )}
    
    </div>
    
  );
};

export default withAuth(TrackingScreen);
