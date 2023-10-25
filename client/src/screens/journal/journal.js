import React, { useState, useEffect } from "react";
import "css/journal.css";
import withAuth from "components/auth/withAuth";
import DurationPicker from "components/journal/durationPicker";
import axios from "axios";

import { TextField, Tooltip, Button, CircularProgress } from "@mui/material";
import styled from "styled-components";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import EditIcon from "@mui/icons-material/Edit";
import LockIcon from "@mui/icons-material/Lock";

import {
  SAVE_ICON_COLORS,
  generateSaveTooltipMessage,
} from "screens/journal/constants/constants";
import {
  getSaveButtonColor,
  createChatbotRequest,
} from "screens/journal/helpers/helpers";
import ExpandableText from "screens/journal/components/ExpandableText";
import { DATABASE_URL } from "constants";

const Wrapper = styled.div`
  padding-bottom: 20%;
  height: 100vh;
  width: 90%;
  margin: auto;

  .disabled-behavior:hover {
    border-radius: 5px;
    background-color: #90ee90;
  }

  .pending-behavior {
    background-color: ${SAVE_ICON_COLORS.YELLOW};
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
    margin-left: 1%;
    animation: shake 1s infinite;
  }
`;

const JournalWrapper = styled.table`
  display: flex;
  align-items: center;
  width: 100%;
  justify-content: center;
  position: relative;
  padding-top: 2%;

  .lock-icon {
    &:hover {
      color: #800000;
    }
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

const ReflectionContainer = styled.td`
  display: flex;
  flex-direction: row;
  width: 50%;

  .edit-icon {
    margin-left: 3%;

    &:hover {
      cursor: pointer;
      transition: 0.5s;
      opacity: 0.7;
    }

    &.save:hover {
      background-color: green;
    }
  }
`;

const JournalScreen = () => {
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

  async function updateBehaviorValue(
    id,
    newGoalValue,
    newBehaviorValue,
    newReflection
  ) {
    if (id === 0) {
      setActivityGoal((prevActivityGoal) => {
        const updatedActivityGoal = prevActivityGoal.map((goal) => {
          const updatedGoal = { ...goal, behaviorValue: +newBehaviorValue };
          axios
            .post(`${DATABASE_URL}/goals`, {
              user: user._id,
              name: user.name,
              goalType: "activity",
              goalValue: +newGoalValue,
              behaviorValue: newBehaviorValue,
              goalStatus: activityData.length
                ? newBehaviorValue >= activityData[0].goalValue
                  ? "yes"
                  : "no"
                : newBehaviorValue >= activityGoal[0].goalValue
                ? "yes"
                : "no",
              reflection: newReflection,
              dateToday: new Date(),
              recommendedValue: 60,
            })
            .then((response) => {
              console.log(response.data);
            })
            .catch((error) => {
              console.error(error);
            });
          axios
            .post(`${DATABASE_URL}/behaviors`, {
              user: user._id,
              name: user.name,
              goalType: "activity",
              date: date,
              dateToday: new Date(),
              goalValue: +newGoalValue,
              behaviorValue: newBehaviorValue,
              goalStatus: activityData.length
                ? newBehaviorValue >= activityData[0].goalValue
                  ? "yes"
                  : "no"
                : newBehaviorValue >= activityGoal[0].goalValue
                ? "yes"
                : "no",
              divInfo1: activityGoal[0].divInfo1,
              divInfo2: activityGoal[0].divInfo2,
              reflection: newReflection,
              recommendedValue: 60,
              feedback: activityGoal[0].feedback,
            })
            .then((response) => {
              console.log(response.data);
            })
            .catch((error) => {
              console.error(error);
            });
          return updatedGoal;
        });
        return updatedActivityGoal;
      });
    } else if (id === 1) {
      setScreentimeGoal((prevScreentimeGoal) => {
        const updatedScreentimeGoal = prevScreentimeGoal.map((goal) => {
          const updatedGoal = { ...goal, behaviorValue: +newBehaviorValue };
          axios
            .post(`${DATABASE_URL}/goals`, {
              user: user._id,
              name: user.name,
              goalType: "screentime",
              goalValue: +newGoalValue,
              behaviorValue: newBehaviorValue,
              goalStatus: screentimeData.length
                ? newBehaviorValue >= screentimeData[0].goalValue
                  ? "yes"
                  : "no"
                : newBehaviorValue >= screentimeGoal[0].goalValue
                ? "yes"
                : "no",
              reflection: newReflection,
              dateToday: new Date(),
              recommendedValue: 120,
            })
            .then((response) => {
              console.log(response.data);
            })
            .catch((error) => {
              console.error(error);
            });
          axios
            .post(`${DATABASE_URL}/behaviors`, {
              user: user._id,
              name: user.name,
              goalType: "screentime",
              date: date,
              dateToday: new Date(),
              goalValue: +newGoalValue,
              behaviorValue: newBehaviorValue,
              goalStatus: screentimeData.length
                ? newBehaviorValue >= screentimeData[0].goalValue
                  ? "yes"
                  : "no"
                : newBehaviorValue >= screentimeGoal[0].goalValue
                ? "yes"
                : "no",
              divInfo1: screentimeGoal[0].divInfo1,
              divInfo2: screentimeGoal[0].divInfo2,
              reflection: newReflection,
              recommendedValue: 120,
              feedback: screentimeGoal[0].feedback,
            })
            .then((response) => {
              console.log(response.data);
            })
            .catch((error) => {
              console.error(error);
            });
          return updatedGoal;
        });
        return updatedScreentimeGoal;
      });
    } else if (id === 2) {
      setEatingGoal((prevEatingGoal) => {
        const updatedEatingGoal = prevEatingGoal.map((goal) => {
          const updatedGoal = { ...goal, behaviorValue: +newBehaviorValue };
          axios
            .post(`${DATABASE_URL}/goals`, {
              user: user._id,
              name: user.name,
              goalType: "eating",
              goalValue: +newGoalValue,
              behaviorValue: newBehaviorValue,
              goalStatus: eatingData.length
                ? newBehaviorValue >= eatingData[0].goalValue
                  ? "yes"
                  : "no"
                : newBehaviorValue >= eatingGoal[0].goalValue
                ? "yes"
                : "no",
              reflection: newReflection,
              dateToday: new Date(),
              recommendedValue: 5,
            })
            .then((response) => {
              console.log(response.data);
            })
            .catch((error) => {
              console.error(error);
            });
          axios
            .post(`${DATABASE_URL}/behaviors`, {
              user: user._id,
              name: user.name,
              goalType: "eating",
              date: date,
              dateToday: new Date(),
              goalValue: +newGoalValue,
              behaviorValue: newBehaviorValue,
              goalStatus: eatingData.length
                ? newBehaviorValue >= eatingData[0].goalValue
                  ? "yes"
                  : "no"
                : newBehaviorValue >= eatingGoal[0].goalValue
                ? "yes"
                : "no",
              divInfo1: eatingGoal[0].divInfo1,
              divInfo2: eatingGoal[0].divInfo2,
              reflection: newReflection,
              recommendedValue: 5,
              feedback: eatingGoal[0].feedback,
            })
            .then((response) => {
              console.log(response.data);
            })
            .catch((error) => {
              console.error(error);
            });
          return updatedGoal;
        });
        return updatedEatingGoal;
      });
    } else if (id === 3) {
      setSleepGoal((prevSleepGoal) => {
        const updatedSleepGoal = prevSleepGoal.map((goal) => {
          const updatedGoal = { ...goal, behaviorValue: +newBehaviorValue };
          axios
            .post(`${DATABASE_URL}/goals`, {
              user: user._id,
              name: user.name,
              goalType: "sleep",
              goalValue: +newGoalValue,
              behaviorValue: newBehaviorValue,
              goalStatus: sleepData.length
                ? newBehaviorValue >= sleepData[0].goalValue
                  ? "yes"
                  : "no"
                : newBehaviorValue >= sleepGoal[0].goalValue
                ? "yes"
                : "no",
              reflection: newReflection,
              dateToday: new Date(),
              recommendedValue: 9,
            })
            .then((response) => {
              console.log(response.data);
            })
            .catch((error) => {
              console.error(error);
            });
          axios
            .post(`${DATABASE_URL}/behaviors`, {
              user: user._id,
              name: user.name,
              goalType: "sleep",
              date: date,
              dateToday: new Date(),
              goalValue: +newGoalValue,
              behaviorValue: newBehaviorValue,
              goalStatus: sleepData.length
                ? newBehaviorValue >= sleepData[0].goalValue
                  ? "yes"
                  : "no"
                : newBehaviorValue >= sleepGoal[0].goalValue
                ? "yes"
                : "no",
              divInfo1: sleepGoal[0].divInfo1,
              divInfo2: sleepGoal[0].divInfo2,
              reflection: newReflection,
              recommendedValue: 9,
              feedback: sleepGoal[0].feedback,
            })
            .then((response) => {
              console.log(response.data);
            })
            .catch((error) => {
              console.error(error);
            });
          return updatedGoal;
        });
        return updatedSleepGoal;
      });
    }
  }

  const activityDate = new Date(
    activityData.length && activityData[0].dateToday
  );
  const screentimeDate = new Date(
    screentimeData.length && screentimeData[0].dateToday
  );
  const eatingDate = new Date(eatingData.length && eatingData[0].dateToday);
  const sleepDate = new Date(sleepData.length && sleepData[0].dateToday);

  const dates = [activityDate, screentimeDate, eatingDate, sleepDate];

  // Filter out invalid dates (undefined or falsy) and find the most recent date
  const validDates = dates.filter((date) => date);
  const mostRecentDate = new Date(Math.max(...validDates)),
    mostRecentDay = mostRecentDate.toLocaleDateString(),
    mostRecentTime = mostRecentDate.toLocaleTimeString();

  return (
    <Wrapper>
      <h1 style={{ color: "#2E6AA1", marginTop: "1%" }}>My Journal</h1>
      <strong style={{ display: "flex", justifyContent: "center" }}>
        Last Logged{" "}
        {mostRecentDay && mostRecentTime ? (
          <>
            {mostRecentDay} {mostRecentTime}
          </>
        ) : (
          <div className="timeload-dots">...</div>
        )}
      </strong>
      <JournalWrapper>
        <div
          style={{
            backgroundPosition: "center center",
            backgroundSize: "cover" /* Adjust as needed */,
            backgroundRepeat: "no-repeat",
            borderRadius: 20,
            width: "82%",
            height: "105vh",
            position: "relative",
            display: "flex",
            alignItems: "center",
          }}
        >
          <div
            style={{
              width: "100%",
              height: "100%",
              margin: "0 auto",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              position: "absolute",
            }}
          >
            <div className="leftPageWrapper">
              <div style={styles.goalScreen}>
                <GoalContainer style={styles.goalRow}>
                  <th>Health Behaviors</th>
                  <th>Set My Goal</th>
                  <th>Track My Behavior</th>
                </GoalContainer>

                <GoalContainer style={styles.goalRow}>
                  <td style={styles.titleGroup}>
                    <img
                      style={styles.icon}
                      src={require("../../components/images/journal/activity_goals.png")}
                      alt="Activity goals icon on activity goals page"
                    />
                    <h2 style={styles.goalLabel}>Physical Activity</h2>
                    <Tooltip
                      title={
                        <div>
                          Exercise, do chores, play sports, and go out and do
                          other physical activities.
                          <br />{" "}
                          <strong>Recommended Level: 60 minutes/day</strong>
                          <br />
                          <strong>Last Logged Time:</strong>{" "}
                          {activityData.length &&
                            new Date(
                              activityData[0].dateToday
                            ).toLocaleDateString()}{" "}
                          {activityData.length &&
                            new Date(
                              activityData[0].dateToday
                            ).toLocaleTimeString()}
                        </div>
                      }
                    >
                      <HelpOutlineIcon
                        style={{
                          fontSize: "16px",
                          cursor: "pointer",
                        }}
                      />
                    </Tooltip>
                  </td>
                  <td style={{ width: "50%" }}>
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
                      />
                    </Tooltip>
                  </td>
                  <td style={{ width: "50%" }}>
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
                  </td>
                  {loggedActivityToday && editingBehaviorId !== 0 && (
                    <Tooltip title="Edit Existing Daily Behavior">
                      <EditIcon
                        className="save edit-icon"
                        onClick={() => {
                          if (editingBehaviorId !== 0) {
                            setEditingBehaviorId(0);
                          }
                        }}
                      />
                    </Tooltip>
                  )}
                </GoalContainer>

                <GoalContainer>
                  <BehaviorInfoText>
                    <strong
                      style={{
                        width: "30%",
                      }}
                    >
                      &nbsp;Recommended: 60 minutes/day
                    </strong>
                    <div
                      style={{
                        width: "70%",
                      }}
                    >
                      <strong>Goal:</strong> Get a good amount of physical
                      activity every day to improve fitness and physical/mental
                      health.
                    </div>
                  </BehaviorInfoText>
                </GoalContainer>

                <GoalContainer style={styles.goalRow}>
                  <td style={styles.titleGroup}>
                    <img
                      style={styles.icon}
                      src={require("../../components/images/journal/tablet_icon.png")}
                      alt="Tablet for screentime goals"
                    />
                    <h2 style={styles.goalLabel}>Screen Time</h2>

                    <Tooltip
                      title={
                        <div>
                          Limit time using phones, laptops, and other screens
                          every day. The only goal where a lower behavior value
                          is better!
                          <br />{" "}
                          <strong>
                            Recommended Level: &lt; 2 hours (120 minutes)/day
                          </strong>
                          <br />
                          <strong>Last Logged Time:</strong>{" "}
                          {screentimeData.length &&
                            new Date(
                              screentimeData[0].dateToday
                            ).toLocaleDateString()}{" "}
                          {screentimeData.length &&
                            new Date(
                              screentimeData[0].dateToday
                            ).toLocaleTimeString()}
                        </div>
                      }
                    >
                      <HelpOutlineIcon
                        style={{
                          fontSize: "16px",
                          cursor: "pointer",
                        }}
                      />
                    </Tooltip>
                  </td>
                  <td style={{ width: "50%" }}>
                    <Tooltip
                      title={
                        loggedScreentimeToday && editingBehaviorId !== 1
                          ? "You've already logged this goal today! You can change it by clicking the edit button to the right."
                          : ""
                      }
                    >
                      <DurationPicker
                        loggedGoalToday={loggedScreentimeToday}
                        editingBehaviorId={editingBehaviorId}
                        goalData={screentimeData}
                        goal={screentimeGoal}
                        setGoalData={setScreentimeGoal}
                        editingId={1}
                      />
                    </Tooltip>
                  </td>

                  <td style={{ width: "50%" }}>
                    <Tooltip
                      title={
                        loggedScreentimeToday && editingBehaviorId !== 1
                          ? "You've already logged this behavior today! You can change it by clicking the edit button to the right."
                          : ""
                      }
                    >
                      <DurationPicker
                        loggedGoalToday={loggedScreentimeToday}
                        editingBehaviorId={editingBehaviorId}
                        goalData={screentimeData}
                        goal={screentimeGoal}
                        setGoalData={setScreentimeGoal}
                        editingId={1}
                        type={"behavior"}
                      />
                    </Tooltip>
                  </td>
                  {loggedScreentimeToday && editingBehaviorId !== 1 && (
                    <Tooltip title="Edit Existing Daily Behavior">
                      <EditIcon
                        className="save edit-icon"
                        onClick={() => {
                          if (editingBehaviorId !== 1) {
                            setEditingBehaviorId(1);
                          }
                        }}
                      />
                    </Tooltip>
                  )}
                </GoalContainer>

                <GoalContainer>
                  <BehaviorInfoText>
                    <strong
                      style={{
                        width: "30%",
                      }}
                    >
                      &nbsp;Recommended: 120 minutes/day
                    </strong>
                    <div
                      style={{
                        width: "70%",
                      }}
                    >
                      <strong>Goal:</strong> Limit screentime to at most 2 hours
                      a day to improve focus and productive time.
                    </div>
                  </BehaviorInfoText>
                </GoalContainer>

                <GoalContainer style={styles.goalRow}>
                  <td style={styles.titleGroup}>
                    <img
                      style={styles.icon}
                      src={require("../../components/images/journal/apple.png")}
                      alt="Apple for servings goal"
                    />
                    <h2 style={styles.goalLabel}>Eating Fruits & Vegetables</h2>
                    <Tooltip
                      title={
                        <div>
                          Eat more servings of fruits and vegetables for a
                          healthier diet.
                          <br />{" "}
                          <strong>Recommended Level: 5 servings/day</strong>
                          <br />
                          <strong>Last Logged Time:</strong>{" "}
                          {eatingData.length &&
                            new Date(
                              eatingData[0].dateToday
                            ).toLocaleDateString()}{" "}
                          {eatingData.length &&
                            new Date(
                              eatingData[0].dateToday
                            ).toLocaleTimeString()}
                        </div>
                      }
                    >
                      <HelpOutlineIcon
                        style={{
                          fontSize: "16px",
                          cursor: "pointer",
                        }}
                      />
                    </Tooltip>
                  </td>

                  <td>
                    <Tooltip
                      title={
                        loggedEatingToday && editingBehaviorId !== 2
                          ? "You've already logged this goal today! You can change it by clicking the edit button to the right."
                          : ""
                      }
                    >
                      <TextField
                        className={
                          loggedEatingToday && editingBehaviorId !== 2
                            ? "disabled-behavior"
                            : "behavior"
                        }
                        disabled={
                          loggedEatingToday && editingBehaviorId !== 2
                            ? true
                            : false
                        }
                        style={styles.inputBox}
                        label="servings/day"
                        type="number"
                        value={eatingGoal.length ? eatingGoal[0].goalValue : ""}
                        onChange={(e) => {
                          if (e.target.value < 0) {
                            e.target.value = 0;
                          } else if (e.target.value > 50) {
                            e.target.value = 50;
                          }
                          setEatingGoal((prevEatingGoal) => {
                            const updatedEatingGoal = prevEatingGoal.map(
                              (goal) => {
                                const newEatingGoalValue = {
                                  ...goal,
                                  goalValue: e.target.value,
                                };
                                return newEatingGoalValue;
                              }
                            );
                            return updatedEatingGoal;
                          });
                        }}
                      />
                    </Tooltip>
                  </td>
                  <td>
                    <Tooltip
                      title={
                        loggedEatingToday && editingBehaviorId !== 2
                          ? "You've already logged this behavior today! You can change it by clicking the edit button to the right."
                          : ""
                      }
                    >
                      <TextField
                        disabled={
                          loggedEatingToday && editingBehaviorId !== 2
                            ? true
                            : false
                        }
                        className={
                          loggedEatingToday && editingBehaviorId !== 2
                            ? "disabled-behavior"
                            : "behavior"
                        }
                        style={styles.inputBox}
                        label="servings/day"
                        type="number"
                        value={
                          eatingGoal.length ? eatingGoal[0].behaviorValue : ""
                        }
                        onChange={(e) => {
                          if (e.target.value < 0) {
                            e.target.value = 0;
                          } else if (e.target.value > 50) {
                            e.target.value = 50;
                          }
                          setEatingGoal((prevEatingGoal) => {
                            const updatedEatingGoal = prevEatingGoal.map(
                              (goal) => {
                                const newEatingGoalValue = {
                                  ...goal,
                                  behaviorValue: Number(e.target.value),
                                };
                                return newEatingGoalValue;
                              }
                            );
                            return updatedEatingGoal;
                          });
                        }}
                      />
                    </Tooltip>
                  </td>
                  {loggedEatingToday && editingBehaviorId !== 2 && (
                    <Tooltip title="Edit Existing Daily Behavior">
                      <EditIcon
                        className="save edit-icon"
                        onClick={() => {
                          if (editingBehaviorId !== 2) {
                            setEditingBehaviorId(2);
                          }
                        }}
                      />
                    </Tooltip>
                  )}
                </GoalContainer>

                <GoalContainer>
                  <BehaviorInfoText>
                    <strong
                      style={{
                        width: "30%",
                      }}
                    >
                      &nbsp;Recommended: 5 servings/day
                    </strong>
                    <div
                      style={{
                        width: "70%",
                      }}
                    >
                      <strong>Goal:</strong> Eat servings of healthy fruits and
                      vegetables for a balanced diet and a healthy lifestyle.
                    </div>
                  </BehaviorInfoText>
                </GoalContainer>

                <GoalContainer style={styles.goalRow}>
                  <td style={styles.titleGroup}>
                    <img
                      style={styles.icon}
                      src={require("../../components/images/journal/pillow_icon.png")}
                      alt="Pillow icon for sleep"
                    />
                    <h2 style={styles.goalLabel}>Sleep</h2>
                    <Tooltip
                      title={
                        <div>
                          Get a good night's rest to be productive and healthy.
                          <br />{" "}
                          <strong>Recommended Level: 9-11 hours/night</strong>
                          <br />
                          <strong>Last Logged Time:</strong>{" "}
                          {sleepData.length &&
                            new Date(
                              sleepData[0].dateToday
                            ).toLocaleDateString()}{" "}
                          {sleepData.length &&
                            new Date(
                              sleepData[0].dateToday
                            ).toLocaleTimeString()}
                        </div>
                      }
                    >
                      <HelpOutlineIcon
                        style={{
                          fontSize: "16px",
                          cursor: "pointer",
                        }}
                      />
                    </Tooltip>
                  </td>

                  <td style={{ width: "50%" }}>
                    <Tooltip
                      title={
                        loggedSleepToday && editingBehaviorId !== 3
                          ? "You've already logged this goal today! You can change it by clicking the edit button to the right."
                          : ""
                      }
                    >
                      <DurationPicker
                        loggedGoalToday={loggedSleepToday}
                        editingBehaviorId={editingBehaviorId}
                        goalData={sleepData}
                        goal={sleepGoal}
                        setGoalData={setSleepGoal}
                        editingId={3}
                      />
                    </Tooltip>
                  </td>

                  <td style={{ width: "50%" }}>
                    <Tooltip
                      title={
                        loggedSleepToday && editingBehaviorId !== 3
                          ? "You've already logged this behavior today! You can change it by clicking the edit button to the right."
                          : ""
                      }
                    >
                      <DurationPicker
                        loggedGoalToday={loggedSleepToday}
                        editingBehaviorId={editingBehaviorId}
                        goalData={sleepData}
                        goal={sleepGoal}
                        setGoalData={setSleepGoal}
                        editingId={3}
                        type={"behavior"}
                      />
                    </Tooltip>
                  </td>
                  {loggedSleepToday && editingBehaviorId !== 3 && (
                    <Tooltip title="Edit Existing Daily Behavior">
                      <EditIcon
                        className="save edit-icon"
                        onClick={() => {
                          if (editingBehaviorId !== 3) {
                            setEditingBehaviorId(3);
                          }
                        }}
                      />
                    </Tooltip>
                  )}
                </GoalContainer>
                <GoalContainer>
                  <BehaviorInfoText>
                    <strong
                      style={{
                        width: "30%",
                      }}
                    >
                      &nbsp;Recommended: 9 hours/day
                    </strong>
                    <div
                      style={{
                        width: "70%",
                      }}
                    >
                      <strong>Goal:</strong> Get sufficient sleep every night to
                      improve daily productivity and prevent any sleep-related
                      health issues.
                    </div>
                  </BehaviorInfoText>
                </GoalContainer>
              </div>

              <img
                className="new_left_page"
                src={require("../../components/images/journal/new_left_page.png")}
                alt="First left-side page"
              />
              {/* <img
                className="leftpage1"
                src={require("../../components/images/journal/left_page.png")}
                alt="First left-side page"
              />
              <img
                className="leftpage2"
                src={require("../../components/images/journal/left_page2.png")}
                alt="Second left-side page"
              />
              <img
                className="leftpage3"
                src={require("../../components/images/journal/left_page3.png")}
                alt="Third left-side page"
              /> */}
            </div>
            <div className="rightPageWrapper">
              <img
                className="bookmark"
                src={require("../../components/images/journal/journal_binding.png")}
                alt="Journal spine icon"
              />
              <div style={styles.rightGoalScreen}>
                <GoalContainer style={styles.goalRow}>
                  <th style={styles.goalHeader}>Your Feedback</th>
                  <th style={styles.goalHeader}>Reflect</th>
                </GoalContainer>

                <GoalContainer style={styles.goalRow}>
                  <td style={{ width: "50%" }}>
                    {activityResponseLoading ? (
                      <CircularProgress />
                    ) : !activityGoal[0].feedback ? (
                      <div>Please save for feedback!</div>
                    ) : activityData.length ? (
                      <ExpandableText
                        text={activityGoal[0].feedback}
                        maxLines={4}
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
                  <ReflectionContainer style={styles.goalRow}>
                    <TextField
                      type="text"
                      placeholder="Type my thoughts"
                      style={{ width: "80%" }}
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
                    <Tooltip
                      title={generateSaveTooltipMessage(
                        activityGoal,
                        activityData,
                        loggedActivityToday,
                        "Activity"
                      )}
                    >
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
                            0,
                            activityGoal[0].goalValue,
                            activityGoal[0].behaviorValue,
                            activityGoal[0].reflection
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
                    </Tooltip>
                  </ReflectionContainer>
                </GoalContainer>

                <GoalContainer>
                  <BehaviorInfoText>
                    <div style={{ width: "100%" }}>
                      <strong>How to Achieve:</strong> Exercise (run, play
                      sports, lift weights) at a local gym, park, or at home, do
                      chores, or just perform light movements.
                    </div>
                  </BehaviorInfoText>
                </GoalContainer>

                <GoalContainer style={styles.goalRow}>
                  <td style={{ width: "50%" }}>
                    {screentimeResponseLoading ? (
                      <CircularProgress />
                    ) : !screentimeGoal[0].feedback ? (
                      <div>Please save for feedback!</div>
                    ) : screentimeData.length ? (
                      <ExpandableText
                        text={screentimeGoal[0].feedback}
                        maxLines={4}
                      />
                    ) : (
                      <Tooltip title="Set a Screentime goal today to see feedback!">
                        <LockIcon
                          style={{ margin: "auto", width: "30%" }}
                          className="lock-icon"
                        />
                      </Tooltip>
                    )}
                  </td>
                  <ReflectionContainer style={styles.goalRow}>
                    <TextField
                      type="text"
                      placeholder="Type my thoughts"
                      style={{ width: "80%" }}
                      value={screentimeGoal[0].reflection}
                      onChange={(e) => {
                        setScreentimeGoal((prevScreentimeGoal) => {
                          const updatedScreentimeGoal = prevScreentimeGoal.map(
                            (goal) => {
                              const newScreentimeReflection = {
                                ...goal,
                                reflection: e.target.value,
                              };
                              return newScreentimeReflection;
                            }
                          );
                          return updatedScreentimeGoal;
                        });
                      }}
                    />
                    <Tooltip
                      title={generateSaveTooltipMessage(
                        screentimeGoal,
                        screentimeData,
                        loggedScreentimeToday,
                        "Screentime"
                      )}
                    >
                      <Button
                        className="save edit-icon"
                        style={{
                          backgroundColor: getSaveButtonColor(
                            loggedScreentimeToday,
                            screentimeData,
                            screentimeGoal
                          ),
                          color: "white",
                          border: "1px solid black",
                        }}
                        onClick={() => {
                          updateBehaviorValue(
                            1,
                            screentimeGoal[0].goalValue,
                            screentimeGoal[0].behaviorValue,
                            screentimeGoal[0].reflection
                          );
                          setLoggedScreentimeToday(true);
                          setEditingBehaviorId(-1);
                          createChatbotRequest(
                            screentimeGoal,
                            setScreentimeGoal,
                            user,
                            date,
                            setScreentimeResponseLoading
                          );
                        }}
                      >
                        SAVE
                      </Button>
                    </Tooltip>
                  </ReflectionContainer>
                </GoalContainer>

                <GoalContainer>
                  <BehaviorInfoText>
                    <div style={{ width: "100%" }}>
                      <strong>How to Achieve:</strong> Assign time slots to use
                      computers/phones for schoolwork, video games, or other
                      activities. Relax and have fun outside or with
                      friends/family in other hours!{" "}
                    </div>
                  </BehaviorInfoText>
                </GoalContainer>

                <GoalContainer style={styles.goalRow}>
                  <td style={{ width: "50%" }}>
                    {eatingResponseLoading ? (
                      <CircularProgress />
                    ) : !eatingGoal[0].feedback ? (
                      <div>Please save for feedback!</div>
                    ) : eatingData.length ? (
                      <ExpandableText
                        text={eatingGoal[0].feedback}
                        maxLines={4}
                      />
                    ) : (
                      <Tooltip title="Set an Eating goal today to see feedback!">
                        <LockIcon
                          style={{ margin: "auto", width: "30%" }}
                          className="lock-icon"
                        />
                      </Tooltip>
                    )}
                  </td>
                  <ReflectionContainer style={styles.goalRow}>
                    <TextField
                      type="text"
                      placeholder="Type my thoughts"
                      style={{ width: "80%" }}
                      value={eatingGoal.length && eatingGoal[0].reflection}
                      onChange={(e) => {
                        setEatingGoal((prevEatingGoal) => {
                          const updatedEatingGoal = prevEatingGoal.map(
                            (goal) => {
                              const newEatingReflection = {
                                ...goal,
                                reflection: e.target.value,
                              };
                              return newEatingReflection;
                            }
                          );
                          return updatedEatingGoal;
                        });
                      }}
                    />
                    <Tooltip
                      title={generateSaveTooltipMessage(
                        eatingGoal,
                        eatingData,
                        loggedEatingToday,
                        "Eating"
                      )}
                    >
                      <Button
                        className="save edit-icon"
                        style={{
                          backgroundColor: getSaveButtonColor(
                            loggedEatingToday,
                            eatingData,
                            eatingGoal
                          ),
                          color: "white",
                          border: "1px solid black",
                        }}
                        onClick={() => {
                          updateBehaviorValue(
                            2,
                            eatingGoal[0].goalValue,
                            eatingGoal[0].behaviorValue,
                            eatingGoal[0].reflection
                          );
                          setLoggedEatingToday(true);
                          setEditingBehaviorId(-1);
                          createChatbotRequest(
                            eatingGoal,
                            setEatingGoal,
                            user,
                            date,
                            setEatingResponseLoading
                          );
                        }}
                      >
                        SAVE
                      </Button>
                    </Tooltip>
                  </ReflectionContainer>
                </GoalContainer>

                <GoalContainer>
                  <BehaviorInfoText>
                    <div style={{ width: "100%" }}>
                      <strong>How to Achieve:</strong> Incorporate
                      fruits/veggies into snacktimes. Eating easy to eat fruits
                      (bananas, grapes, apples, etc.) or vegetables
                      (carrots/celery sticks, broccoli, etc.) helps!
                    </div>
                  </BehaviorInfoText>
                </GoalContainer>

                <GoalContainer style={styles.goalRow}>
                  <td style={{ width: "50%" }}>
                    {sleepResponseLoading ? (
                      <CircularProgress />
                    ) : !sleepGoal[0].feedback ? (
                      <div>Please save for feedback!</div>
                    ) : sleepData.length ? (
                      <ExpandableText
                        text={sleepGoal[0].feedback}
                        maxLines={4}
                      />
                    ) : (
                      <Tooltip title="Set a Sleep goal today to see feedback!">
                        <LockIcon
                          style={{
                            width: "30%",
                            display: "flex",
                            margin: "0 auto",
                          }}
                          className="lock-icon"
                        />
                      </Tooltip>
                    )}
                  </td>
                  <ReflectionContainer style={styles.goalRow}>
                    <TextField
                      type="text"
                      placeholder="Type my thoughts"
                      style={{ width: "80%" }}
                      value={sleepGoal.length && sleepGoal[0].reflection}
                      onChange={(e) => {
                        setSleepGoal((prevSleepGoal) => {
                          const updatedSleepGoal = prevSleepGoal.map((goal) => {
                            const newSleepGoal = {
                              ...goal,
                              reflection: e.target.value,
                            };
                            return newSleepGoal;
                          });
                          return updatedSleepGoal;
                        });
                      }}
                    />
                    <Tooltip
                      title={generateSaveTooltipMessage(
                        sleepGoal,
                        sleepData,
                        loggedSleepToday,
                        "Sleep"
                      )}
                    >
                      <Button
                        className="save edit-icon"
                        style={{
                          backgroundColor: getSaveButtonColor(
                            loggedSleepToday,
                            sleepData,
                            sleepGoal
                          ),
                          color: "white",
                          border: "1px solid black",
                        }}
                        onClick={() => {
                          updateBehaviorValue(
                            3,
                            sleepGoal[0].goalValue,
                            sleepGoal[0].behaviorValue,
                            sleepGoal[0].reflection
                          );
                          setLoggedSleepToday(true);
                          setEditingBehaviorId(-1);
                          createChatbotRequest(
                            sleepGoal,
                            setSleepGoal,
                            user,
                            date,
                            setSleepResponseLoading
                          );
                        }}
                      >
                        SAVE
                      </Button>
                    </Tooltip>
                  </ReflectionContainer>
                </GoalContainer>

                <GoalContainer>
                  <BehaviorInfoText>
                    <div style={{ width: "100%" }}>
                      <strong>How to Achieve:</strong> Put devices away before
                      sleeping, and focus on making a routine time to go to bed
                      and wake up every morning!
                    </div>
                  </BehaviorInfoText>
                </GoalContainer>
              </div>
              <img
                className="new_right_page"
                src={require("../../components/images/journal/new_right_page.png")}
                alt="First right-side page"
              />
              {/* <img
                className="rightpage1"
                src={require("../../components/images/journal/left_page.png")}
                alt="First right-side page"
              />
              <img
                className="rightpage2"
                src={require("../../components/images/journal/left_page2.png")}
                alt="Second right-side page"
              />
              <img
                className="rightpage3"
                src={require("../../components/images/journal/left_page3.png")}
                alt="Third right-side page"
              /> */}
            </div>
          </div>
        </div>
      </JournalWrapper>
    </Wrapper>
  );
};

export default withAuth(JournalScreen);

let styles = {
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
  goalRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  goalLabel: {
    width: "auto",
    margin: "5%",
    fontSize: 22,
  },
  inputBox: {
    width: "70%",
    marginLeft: "auto",
    marginRight: "auto",
    size: "10px",
  },
  icon: {
    width: "30px",
  },
  titleGroup: {
    display: "flex",
    width: "30%",
    alignItems: "center",
    justifyContent: "flex-end",
  },
  feedback: {
    color: "#000080",
    padding: 5,
    overflowY: "scroll",
    maxHeight: 20,
  },
};
