import React, { useState, useEffect } from "react";
import "css/journal.css";
import withAuth from "components/auth/withAuth";
import DurationPicker from "components/journal/durationPicker";
import axios from "axios";
import styled from "styled-components";
import { Outlet } from 'react-router-dom';
import { TextField, Tooltip, Button, CircularProgress } from "@mui/material";
import { useLocation } from 'react-router-dom';

import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import EditIcon from "@mui/icons-material/Edit";
import LockIcon from "@mui/icons-material/Lock";
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Grow from '@mui/material/Grow';
import Paper from '@mui/material/Paper';
import Popper from '@mui/material/Popper';
import MenuList from '@mui/material/MenuList';
import Stack from '@mui/material/Stack';

import { Link } from 'react-router-dom';

import {
  SAVE_ICON_COLORS,
  MAX_FEEDBACK_LINES,
  generateSaveTooltipMessage,
} from "screens/journal/constants/constants";
import {
  getSaveButtonColor,
  createChatbotRequest,
  updateBehaviorValue,
} from "screens/journal/helpers/helpers";
import { useSpring } from "react-spring";
import ExpandableText from "screens/journal/components/ExpandableText";
import { DATABASE_URL } from "constants";
import { useMediaQuery } from "react-responsive";

const Wrapper = styled.div`
  padding-bottom: 5%;
  height: 100vh;
  width: 100%; /* Change to 100% for mobile */
  margin: auto;
  font-family: Montserrat;

  .information-text {
    font-size: 12px;
  }

  .disabled-behavior:hover {
    border-radius: 5px;
    background-color: #90ee90;
  }

  @media only screen and (max-width: 600px) {
    width: 100%;
    flex-direction: column;
  }
`;

const JournalWrapper = styled.table`
  display: flex;
  align-items: center;
  width: 100%;
  justify-content: center;
  position: relative;
  margin: 0 auto;
  flex-direction: column; /* Use column for better alignment */

  .lock-icon {
    &:hover {
      color: #800000;
    }
  }


  @media only screen and (max-width: 600px) {
    display: none;
  }
`;


const BehaviorInfoText = styled.div`
  display: flex;
  align-items: center;
  margin-top: 1%;
`;

const GoalContainer = styled.tr`
  .edit-icon {
    &:hover {
      cursor: pointer;
      transition: 0.5s;
      color: gray;
    }

    &.save:hover {
      color: green;
    }
  }
`;



const ActivitiyScreen = () => {

  const [forward, setForward] = useState(true);

  const props = useSpring({
    opacity: 1,
    transform: `translateY(${forward ? -1000 : -1050}px)`,
    from: { transform: "translateY(-1250px)" },
    onRest: () => {
      setForward(!forward);
    },
    config: { duration: 1000 },
    translateX: 50,
  });


  const [user, setUser] = useState([]);
  const [goalData, setGoalData] = useState([]);

  const [loggedActivityToday, setLoggedActivityToday] = useState(false);
  const [loggedScreentimeToday, setLoggedScreentimeToday] = useState(false);
  const [loggedEatingToday, setLoggedEatingToday] = useState(false);
  const [loggedSleepToday, setLoggedSleepToday] = useState(false);

  const [editingBehaviorId, setEditingBehaviorId] = useState(-1);

  var dateToday = new Date(),
    month = dateToday.getMonth(),
    day = dateToday.getDate(),
    year = dateToday.getFullYear(),
    date = month + 1 + "/" + day + "/" + year;

  // Local states to manage event changes in React.
  const [activityGoal, setActivityGoal] = useState([
    {
      id: 0,
      goalType: "activity",
      goalValue: 0,
      divInfo1: "Get at least 60 minutes of physical activity per day",
      divInfo2:
        "Do exercises like running or playing sports for at least an hour a day.",
      reflection: "",
      behaviorValue: 0,
      date: date,
      recommendedValue: 60,
    },
  ]);
  const [screentimeGoal, setScreentimeGoal] = useState([
    {
      id: 1,
      goalType: "screentime",
      goalValue: 0,
      divInfo1: "Limit screentime to 2 hours a day",
      divInfo2:
        "Go outside instead of using tech like laptops, phones, and televisions.",
      reflection: "",
      behaviorValue: 0,
      date: date,
      recommendedValue: 120,
    },
  ]);
  const [eatingGoal, setEatingGoal] = useState([
    {
      id: 2,
      goalType: "eating",
      goalValue: 0,
      divInfo1: "Eat 5 or more servings of fruits and/or vegetables",
      divInfo2: "Reach target increments for servings of healthy foods.",
      reflection: "",
      behaviorValue: 0,
      date: date,
      recommendedValue: 5,
    },
  ]);
  const [sleepGoal, setSleepGoal] = useState([
    {
      id: 3,
      goalType: "sleep",
      goalValue: 0,
      divInfo1: "Get at least 9 hours of sleep a night",
      divInfo2:
        "Sleep at least 9-11 hours a night to feel the best and most productive.",
      reflection: "",
      behaviorValue: 0,
      date: date,
      recommendedValue: 9,
    },
  ]);

  const [activityResponseLoading, setActivityResponseLoading] = useState(false);
  const [screentimeResponseLoading, setScreentimeResponseLoading] =
    useState(false);
  const [eatingResponseLoading, setEatingResponseLoading] = useState(false);
  const [sleepResponseLoading, setSleepResponseLoading] = useState(false);

  // Stores goal data pulled from MongoDB.
  const [activityData, setActivityData] = useState({});
  const [screentimeData, setScreentimeData] = useState({});
  const [eatingData, setEatingData] = useState({});
  const [sleepData, setSleepData] = useState({});

  useEffect(() => {
    const fetchDailyBehavior = async (goalType) => {
      try {
        const response = await axios.get(`${DATABASE_URL}/dailyBehavior`, {
          params: {
            user: user,
            goalType: goalType,
            date: date,
          },
        });
        if (response.data.length) {
          if (goalType === "activity") {
            setLoggedActivityToday(true);
          } else if (goalType === "screentime") {
            setLoggedScreentimeToday(true);
          }
          if (goalType === "eating") {
            setLoggedEatingToday(true);
          }
          if (goalType === "sleep") {
            setLoggedSleepToday(true);
          }
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchDailyBehavior("activity");
    fetchDailyBehavior("screentime");
    fetchDailyBehavior("eating");
    fetchDailyBehavior("sleep");
  }, [user]);

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
      })
      .catch((error) => console.error(error));
  }, []);

  useEffect(() => {
    const fetchGoals = async () => {
      try {
        const response = await axios.get(`${DATABASE_URL}/goals`, {
          params: {
            user: user,
          },
        });
        setGoalData(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchGoals();
  }, [user, activityGoal, screentimeGoal, eatingGoal, sleepGoal]);

  useEffect(() => {
    const fetchEatingGoals = async () => {
      try {
        const response = await axios.get(`${DATABASE_URL}/goalType`, {
          params: {
            user: user,
            goalType: "eating",
          },
        });
        setEatingData(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchEatingGoals();
  }, [goalData, eatingGoal]);

  useEffect(() => {
    const fetchEatingGoals = async () => {
      try {
        const response = await axios.get(`${DATABASE_URL}/dailyBehavior`, {
          params: {
            user: user,
            goalType: "eating",
            date: date,
          },
        });
        if (response.data.length === 0 || !loggedEatingToday) {
          setEatingGoal(eatingGoal);
        } else {
          setEatingGoal(response.data);
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchEatingGoals();
  }, [user, loggedEatingToday]);

  useEffect(() => {
    const fetchActivityGoals = async () => {
      try {
        const response = await axios.get(`${DATABASE_URL}/goalType`, {
          params: {
            user: user,
            goalType: "activity",
          },
        });
        setActivityData(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchActivityGoals();
  }, [goalData, activityGoal]);

  useEffect(() => {
    const fetchActivityGoals = async () => {
      try {
        const response = await axios.get(`${DATABASE_URL}/dailyBehavior`, {
          params: {
            user: user,
            goalType: "activity",
            date: date,
          },
        });
        if (response.data.length && loggedActivityToday) {
          setActivityGoal(response.data);
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchActivityGoals();
  }, [user, loggedActivityToday]);

  useEffect(() => {
    const fetchSleepGoals = async () => {
      try {
        const response = await axios.get(`${DATABASE_URL}/goalType`, {
          params: {
            user: user,
            goalType: "sleep",
          },
        });
        setSleepData(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchSleepGoals();
  }, [goalData, sleepGoal]);

  useEffect(() => {
    const fetchSleepGoals = async () => {
      try {
        const response = await axios.get(`${DATABASE_URL}/dailyBehavior`, {
          params: {
            user: user,
            goalType: "sleep",
            date: date,
          },
        });
        if (response.data.length === 0 || !loggedSleepToday) {
          setSleepGoal(sleepGoal);
        } else {
          setSleepGoal(response.data);
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchSleepGoals();
  }, [user, loggedSleepToday]);

  useEffect(() => {
    const fetchScreentimeGoals = async () => {
      try {
        const response = await axios.get(`${DATABASE_URL}/goalType`, {
          params: {
            user: user,
            goalType: "screentime",
          },
        });
        setScreentimeData(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchScreentimeGoals();
  }, [goalData, screentimeGoal]);

  useEffect(() => {
    const fetchScreentimeGoals = async () => {
      try {
        const response = await axios.get(`${DATABASE_URL}/dailyBehavior`, {
          params: {
            user: user,
            goalType: "screentime",
            date: date,
          },
        });
        if (response.data.length && loggedScreentimeToday) {
          setScreentimeGoal(response.data);
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchScreentimeGoals();
  }, [user, loggedScreentimeToday]);

  const activityDate = new Date(
    activityData.length && activityData[0].dateToday
  );
  const screentimeDate = new Date(
    screentimeData.length && screentimeData[0].dateToday
  );
  const eatingDate = new Date(eatingData.length && eatingData[0].dateToday);
  const sleepDate = new Date(sleepData.length && sleepData[0].dateToday);

  const dates = [activityDate, screentimeDate, eatingDate, sleepDate];

  const validDates = dates.filter((date) => date);
  const mostRecentDate = new Date(Math.max(...validDates)),
    mostRecentDay = mostRecentDate.toLocaleDateString(),
    mostRecentTime = mostRecentDate.toLocaleTimeString();
  const location = useLocation();
  useEffect(() => {
    // Set overflow to hidden on specific pages, otherwise allow overflow
    if (location.pathname === "/journal/activity") {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [location.pathname]);
  return (
    <div style={{ display: "flex", flexDirection: "row", alignItems: "center", textAlign: "center", overflow: "hidden", zIndex: "100"}}>
      <GoalContainer>
        <td style={styles.titleGroup}>
          <img
            style={styles.icon}
            src={require("../../../components/images/journal/activity_goals.png")}
            alt="Activity goals icon on activity goals page"
          />
          <h2 style={{ position: 'fixed', left: '20px', top: '220px' }}>Physical Activity</h2>
        </td>
        <table>
          <td style = {styles.fullwidth}>
            <h3 style={{ position: 'fixed', left: '20px', top: '300px', zIndex: "100" }}>My goal</h3>
            <div style={{ width: "50%", position: 'fixed', left: '130px', top: '290px', zIndex: "100" }}>
              <Tooltip
                title={
                  loggedActivityToday && editingBehaviorId !== 0
                    ? "You've already logged this goal today! You can change it by clicking the edit button to the right."
                    : ""
                }
              >
                <DurationPicker
                  loggedGoalToday={loggedActivityToday}
                  editingBehaviorId={editingBehaviorId}
                  goalData={activityData}
                  goal={activityGoal}
                  setGoalData={setActivityGoal}
                  editingId={0}
                  style={{zIndex: 100}}
                />
              </Tooltip>
            </div>  
          </td>
        </table>
        <table>
          <td >
            <h3 style={{ position: 'fixed', left: '20px', top: '400px' }}>My result</h3>
            <div style={{ width: "50%", position: 'fixed', left: '130px', top: '390px' }}>
              <Tooltip
                title={
                  loggedActivityToday && editingBehaviorId !== 0
                    ? "You've already logged this behavior today! You can change it by clicking the edit button to the right."
                    : ""
                }
              >
                <DurationPicker
                  loggedGoalToday={loggedActivityToday}
                  editingBehaviorId={editingBehaviorId}
                  goalData={activityData}
                  goal={activityGoal}
                  setGoalData={setActivityGoal}
                  editingId={0}
                  type={"behavior"}
                />
              </Tooltip>
            </div>
          </td>
        </table>
      </GoalContainer>
      <div>
        <h3 style={{ position: 'fixed', left: '20px', top: '500px' }}>Reflect</h3>
        <div style={{ position: 'fixed', width: "60%", left: '130px', top: '490px' }}>
          <TextField
            type="text"
            placeholder="Type my thoughts"
            multiline
            rows={activityGoal[0].reflection.length > 27 ? 2 : 1}
            style={{ width: "90%" }}
            value={activityGoal.length && activityGoal[0].reflection}
            onChange={(e) => {
              setActivityGoal((prevActivityGoal) => {
                const updatedActivityGoal = prevActivityGoal.map(
                  (goal) => {
                    const newActivityReflection = {
                      ...goal,
                      reflection: e.target.value,
                    };
                    return newActivityReflection;
                  }
                );
                return updatedActivityGoal;
              });
            }}
          />
        </div>  
 
        <Tooltip
          title={generateSaveTooltipMessage(
            activityGoal,
            activityData,
            loggedActivityToday,
            "Activity"
          )}
        >
        <div style={{ position: 'fixed', left: '300px', top: '570px' }}>
          <Button
            className="save edit-icon"
            style={{
              backgroundColor: getSaveButtonColor(
                loggedActivityToday,
                activityData,
                activityGoal
              ),
              color: "white",
              border: "1px solid black",
            }}
            onClick={() => {
              updateBehaviorValue(
                user,
                activityGoal[0].goalValue,
                activityGoal[0].behaviorValue,
                activityGoal[0].reflection,
                setActivityGoal,
                activityGoal,
                activityData,
                "activity",
                date,
                60
              );
              setLoggedActivityToday(true);
              setEditingBehaviorId(-1);
              createChatbotRequest(
                activityGoal,
                setActivityGoal,
                user,
                date,
                setActivityResponseLoading
              );
            }}
          >
            SAVE
          </Button>
        </div>
        </Tooltip>
        <th style={{ position: 'fixed', left: '10px', top: '600px' }}>AI-Generated Feedback</th>
        <div style={{ width: "100%", position: 'fixed', left: '10px', top: '630px' }}>
          <td >
              {activityResponseLoading ? (
                <CircularProgress />
              ) : !activityGoal[0].feedback ? (
                <div>Please save for feedback!</div>
              ) : activityData.length ? (
                <ExpandableText
                  text={activityGoal[0].feedback}
                  maxLines={MAX_FEEDBACK_LINES}
                />
              ) : (
                <Tooltip title="Set an Activity goal today to see feedback!">
                  <LockIcon
                    style={{ margin: "auto", width: "30%" }}
                    className="lock-icon"
                  />
                </Tooltip>
              )}
          </td>
        </div>
      </div>
    </div>
  )
}

export default ActivitiyScreen


let styles = {
  fullwidth: {
    width: "100%", /* Takes up the entire width of the parent */
    textalign: "left", /* Aligns the text content to the left */
  },
  goalScreen: {
    position: "absolute",
    zIndex: "900",
    display: "flex",
    flexDirection: "column",
    margin: "auto",
    marginLeft: "8%",
    width: "80%",
    height: "90%",
    justifyContent: "space-between",
  },
  rightGoalScreen: {
    position: "absolute",
    zIndex: "900",
    display: "flex",
    flexDirection: "column",
    margin: "auto",
    marginLeft: "2%",
    width: "80%",
    height: "90%",
    justifyContent: "space-between",
  },
  goalLabel: {
    fontSize: 22,
    position: "relative",
    left: "90px",
  },
  inputBox: {
    width: "70%",
    marginLeft: "auto",
    marginRight: "auto",
    size: "10px",
  },
  icon: {
    width: "30px",
    position: "fixed",
    left: "60px",
    top: "210px",
  },
  titleGroup: {
    display: "flex",
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  feedback: {
    color: "#000080",
    padding: 5,
    overflowY: "scroll",
    maxHeight: 20,
  },
};
