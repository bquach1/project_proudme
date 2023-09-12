import React, { useState, useEffect } from "react";
import "../../css/journal.css";
import withAuth from "../../components/auth/withAuth";
import axios from "axios";

import { TextField, Tooltip, Button } from "@mui/material";
import styled from "styled-components";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import LockIcon from "@mui/icons-material/Lock";

import { SAVE_ICON_COLORS } from "./constants";
import { DATABASE_URL } from "../../constants";

const Wrapper = styled.div`
  margin-top: 1%;
  padding-bottom: 5%;

  .disabled-behavior:hover {
    border-radius: 5px;
    background-color: #90ee90;
  }
`;

const JournalWrapper = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  margin: auto;
  justify-content: center;
  position: relative;
  margin-top: 1%;

  .lock-icon {
    &:hover {
      color: #800000;
    }
  }
`;

const GoalContainer = styled.div`
  margin-left: 10px;

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

const ReflectionContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
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

  // Stores goal data pulled from MongoDB.
  const [activityData, setActivityData] = useState({});
  const [screentimeData, setScreentimeData] = useState({});
  const [eatingData, setEatingData] = useState({});
  const [sleepData, setSleepData] = useState({});

  useEffect(() => {
    console.log(screentimeGoal);
  });

  const renderFeedback = (goalData) => {
    if (goalData === screentimeGoal) {
      if (
        goalData[0].behaviorValue <= goalData[0].goalValue / 2 &&
        goalData[0].behaviorValue <= goalData[0].recommendedValue / 2
      )
        return "Bravo! I EXCEEDED my goal AND the recommended level of behavior! I am doing great!";
      else if (
        goalData[0].behaviorValue <= goalData[0].goalValue &&
        goalData[0].behaviorValue <= goalData[0].recommendedValue
      )
        return "Hooray! I reached my goal AND the recommended level of behavior! Keep it up!";
      else if (
        goalData[0].behaviorValue <= goalData[0].goalValue &&
        goalData[0].behaviorValue > goalData[0].recommendedValue
      )
        return "Great, I reached my goal! Next I will need to work harder to reach the recommended level of behavior!";
      else if (
        goalData[0].behaviorValue > goalData[0].goalValue &&
        goalData[0].behaviorValue <= goalData[0].recommendedValue
      )
        return "Great, I reached the recommended behavior level! Next I will need to work harder to reach my own goal!";
      else if (
        goalData[0].behaviorValue > goalData[0].goalValue * 2 &&
        goalData[0].behaviorValue > goalData[0].recommendedValue * 2
      )
        return "I need to work harder to reach my goal! I can do it!";
      else if (
        goalData[0].behaviorValue > goalData[0].goalValue &&
        goalData[0].behaviorValue > goalData[0].recommendedValue
      )
        return "I'm not too far away from my goal AND the recommended level of behavior! Come on! My goal is within reach!";
      else return "...";
    } else {
      if (
        goalData[0].behaviorValue >= goalData[0].goalValue * 2 &&
        goalData[0].behaviorValue >= goalData[0].recommendedValue * 2
      )
        return "Bravo! I EXCEEDED my goal AND the recommended level of behavior! I am doing great!";
      else if (
        goalData[0].behaviorValue >= goalData[0].goalValue &&
        goalData[0].behaviorValue >= goalData[0].recommendedValue
      )
        return "Hooray! I reached my goal AND the recommended level of behavior! Keep it up!";
      else if (
        goalData[0].behaviorValue >= goalData[0].goalValue &&
        goalData[0].behaviorValue < goalData[0].recommendedValue
      )
        return "Great, I reached my goal! Next I will need to work harder to reach the recommended level of behavior!";
      else if (
        goalData[0].behaviorValue < goalData[0].goalValue &&
        goalData[0].behaviorValue >= goalData[0].recommendedValue
      )
        return "Great, I reached the recommended behavior level! Next I will need to work harder to reach my own goal!";
      else if (
        goalData[0].behaviorValue < goalData[0].goalValue / 2 &&
        goalData[0].behaviorValue < goalData[0].recommendedValue / 2
      )
        return "I need to work harder to reach my goal! I can do it!";
      else if (
        goalData[0].behaviorValue < goalData[0].goalValue &&
        goalData[0].behaviorValue < goalData[0].recommendedValue
      )
        return "I'm not too far away from my goal AND the recommended level of behavior! Come on! My goal is within reach!";
      else return "...";
    }
  };

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
          console.log("logged today");
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
        const response = await axios.get(`${DATABASE_URL}/goalType`, {
          params: {
            user: user,
            goalType: "eating",
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
  }, [user]);

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
        const response = await axios.get(`${DATABASE_URL}/goalType`, {
          params: {
            user: user,
            goalType: "activity",
          },
        });
        if (response.data.length === 0 || !loggedActivityToday) {
          setActivityGoal(activityGoal);
        } else {
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
        const response = await axios.get(`${DATABASE_URL}/goalType`, {
          params: {
            user: user,
            goalType: "sleep",
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
  }, [user]);

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
        const response = await axios.get(`${DATABASE_URL}/goalType`, {
          params: {
            user: user,
            goalType: "screentime",
          },
        });
        if (response.data.length === 0 || !loggedScreentimeToday) {
          setScreentimeGoal(screentimeGoal);
        } else {
          setScreentimeGoal(response.data);
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchScreentimeGoals();
  }, [user]);

  var dateToday = new Date(),
    month = dateToday.getMonth(),
    day = dateToday.getDate(),
    year = dateToday.getFullYear(),
    date = month + 1 + "/" + day + "/" + year;

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
              goalValue: newGoalValue,
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
              goalValue: activityData.length
                ? activityData[0].goalValue
                : activityGoal[0].goalValue,
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
              goalValue: newGoalValue,
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
              goalValue: screentimeData.length
                ? screentimeData[0].goalValue
                : screentimeGoal[0].goalValue,
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
              goalValue: newGoalValue,
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
              goalValue: eatingData.length
                ? eatingData[0].goalValue
                : eatingGoal[0].goalValue,
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
              goalValue: newGoalValue,
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
              goalValue: sleepData.length
                ? sleepData[0].goalValue
                : sleepGoal[0].goalValue,
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

  let lastLoggedDate =
    activityData.length &&
    new Date(activityData[0].dateToday).toLocaleDateString();
  let lastLoggedTime =
    activityData.length &&
    new Date(activityData[0].dateToday).toLocaleTimeString();

  return (
    <Wrapper>
      <h1 style={{ color: "#2E6AA1" }}>
        My Journal (Last Logged {lastLoggedDate} {lastLoggedTime})
      </h1>
      <JournalWrapper>
        <img
          className="journalCover"
          src={require("../../components/images/journal/journal_cover.png")}
          alt="Journal cover screen wrapper"
        />
        <div className="leftPageWrapper">
          <div style={styles.goalScreen}>
            <div style={styles.goalRow}>
              <h2 style={styles.goalHeader}>Health Behaviors</h2>
              <h2 style={styles.goalHeader}>Set My Goal</h2>
              <h2 style={styles.goalHeader}>Track My Behavior</h2>
            </div>

            <GoalContainer style={styles.goalRow}>
              <div style={styles.titleGroup}>
                <img
                  style={styles.activityIcon}
                  src={require("../../components/images/journal/activity_goals.png")}
                  alt="Activity goals icon on activity goals page"
                />
                <h2 style={styles.goalLabel}>Physical Activity</h2>
                <Tooltip
                  title={
                    <div>
                      Exercise, do chores, play sports, and go out and do other
                      physical activities.
                      <br /> <strong>Recommended Level: 60 minutes/day</strong>
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
                      marginLeft: -5,
                    }}
                  />
                </Tooltip>
              </div>
              <>
                <TextField
                  style={styles.inputBox}
                  label="minutes/day"
                  id="input"
                  type="number"
                  value={activityGoal.length && activityGoal[0].goalValue}
                  onChange={(e) => {
                    setActivityGoal((prevActivityGoal) => {
                      const updatedActivityGoal = prevActivityGoal.map(
                        (goal) => {
                          const newActivityGoalValue = {
                            ...goal,
                            goalValue: e.target.value,
                          };
                          return newActivityGoalValue;
                        }
                      );
                      return updatedActivityGoal;
                    });
                  }}
                />
              </>

              <>
                <Tooltip
                  title={
                    loggedActivityToday && editingBehaviorId !== 0
                      ? "You've already logged this behavior today! You can change it by clicking the edit button to the right."
                      : ""
                  }
                >
                  <TextField
                    className={
                      loggedActivityToday && editingBehaviorId !== 0
                        ? "disabled-behavior"
                        : "behavior"
                    }
                    disabled={
                      loggedActivityToday && editingBehaviorId !== 0
                        ? true
                        : false
                    }
                    style={styles.inputBox}
                    label="minutes/day"
                    type="number"
                    value={activityGoal.length && activityGoal[0].behaviorValue}
                    onChange={(e) => {
                      setActivityGoal((prevActivityGoal) => {
                        const updatedActivityGoal = prevActivityGoal.map(
                          (goal) => {
                            const newActivityGoalValue = {
                              ...goal,
                              behaviorValue: Number(e.target.value),
                            };
                            return newActivityGoalValue;
                          }
                        );
                        return updatedActivityGoal;
                      });
                    }}
                  />
                </Tooltip>
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
              </>
            </GoalContainer>

            <GoalContainer style={styles.goalRow}>
              <div style={styles.titleGroup}>
                <img
                  style={styles.screentimeIcon}
                  src={require("../../components/images/journal/tablet_icon.png")}
                  alt="Tablet for screentime goals"
                />
                <h2 style={styles.goalLabel}>Screentime</h2>

                <Tooltip
                  title={
                    <div>
                      Limit time using phones, laptops, and other screens every
                      day. The only goal where a lower behavior value is better!
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
                      marginLeft: -5,
                    }}
                  />
                </Tooltip>
              </div>
              <>
                <TextField
                  style={styles.inputBox}
                  label="minutes/day"
                  type="number"
                  value={
                    screentimeGoal.length ? screentimeGoal[0].goalValue : ""
                  }
                  onChange={(e) => {
                    setScreentimeGoal((prevScreentimeGoal) => {
                      const updatedScreentimeGoal = prevScreentimeGoal.map(
                        (goal) => {
                          const newScreentimeGoalValue = {
                            ...goal,
                            goalValue: e.target.value,
                          };
                          return newScreentimeGoalValue;
                        }
                      );
                      return updatedScreentimeGoal;
                    });
                  }}
                />
              </>

              <>
                <Tooltip
                  title={
                    loggedScreentimeToday && editingBehaviorId !== 1
                      ? "You've already logged this behavior today! You can change it by clicking the edit button to the right."
                      : ""
                  }
                >
                  <TextField
                    disabled={
                      loggedScreentimeToday && editingBehaviorId !== 1
                        ? true
                        : false
                    }
                    className={
                      loggedScreentimeToday && editingBehaviorId !== 1
                        ? "disabled-behavior"
                        : "behavior"
                    }
                    style={styles.inputBox}
                    label="minutes/day"
                    type="number"
                    value={
                      screentimeGoal.length
                        ? screentimeGoal[0].behaviorValue
                        : ""
                    }
                    onChange={(e) => {
                      setScreentimeGoal((prevScreentimeGoal) => {
                        const updatedScreentimeGoal = prevScreentimeGoal.map(
                          (goal) => {
                            const newScreentimeGoalValue = {
                              ...goal,
                              behaviorValue: Number(e.target.value),
                            };
                            return newScreentimeGoalValue;
                          }
                        );
                        return updatedScreentimeGoal;
                      });
                    }}
                  />
                </Tooltip>
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
              </>
            </GoalContainer>

            <GoalContainer style={styles.goalRow}>
              <div style={styles.titleGroup}>
                <img
                  style={styles.eatingIcon}
                  src={require("../../components/images/journal/apple.png")}
                  alt="Apple for servings goal"
                />
                <h2 style={styles.goalLabel}>Eating Fruits and Vegetables</h2>
                <Tooltip
                  title={
                    <div>
                      Eat more servings of fruits and vegetables for a healthier
                      diet.
                      <br /> <strong>Recommended Level: 5 servings/day</strong>
                      <br />
                      <strong>Last Logged Time:</strong>{" "}
                      {eatingData.length &&
                        new Date(
                          eatingData[0].dateToday
                        ).toLocaleDateString()}{" "}
                      {eatingData.length &&
                        new Date(eatingData[0].dateToday).toLocaleTimeString()}
                    </div>
                  }
                >
                  <HelpOutlineIcon
                    style={{
                      fontSize: "16px",
                      cursor: "pointer",
                      marginLeft: -5,
                    }}
                  />
                </Tooltip>
              </div>

              <>
                <TextField
                  style={styles.inputBox}
                  label="servings/day"
                  type="number"
                  value={eatingGoal.length ? eatingGoal[0].goalValue : ""}
                  onChange={(e) => {
                    setEatingGoal((prevEatingGoal) => {
                      const updatedEatingGoal = prevEatingGoal.map((goal) => {
                        const newEatingGoalValue = {
                          ...goal,
                          goalValue: e.target.value,
                        };
                        return newEatingGoalValue;
                      });
                      return updatedEatingGoal;
                    });
                  }}
                />
              </>
              <>
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
                    value={eatingGoal.length ? eatingGoal[0].behaviorValue : ""}
                    onChange={(e) => {
                      setEatingGoal((prevEatingGoal) => {
                        const updatedEatingGoal = prevEatingGoal.map((goal) => {
                          const newEatingGoalValue = {
                            ...goal,
                            behaviorValue: Number(e.target.value),
                          };
                          return newEatingGoalValue;
                        });
                        return updatedEatingGoal;
                      });
                    }}
                  />
                </Tooltip>
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
              </>
            </GoalContainer>

            <GoalContainer style={styles.goalRow}>
              <div style={styles.titleGroup}>
                <img
                  style={styles.sleepIcon}
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
                        new Date(sleepData[0].dateToday).toLocaleTimeString()}
                    </div>
                  }
                >
                  <HelpOutlineIcon
                    style={{
                      fontSize: "16px",
                      cursor: "pointer",
                      marginLeft: -5,
                    }}
                  />
                </Tooltip>
              </div>

              <>
                <TextField
                  style={styles.inputBox}
                  label="hours/day"
                  type="number"
                  value={sleepGoal.length && sleepGoal[0].goalValue}
                  onChange={(e) => {
                    setSleepGoal((prevSleepGoal) => {
                      const updatedSleepGoal = prevSleepGoal.map((goal) => {
                        const newSleepGoalValue = {
                          ...goal,
                          goalValue: e.target.value,
                        };
                        return newSleepGoalValue;
                      });
                      return updatedSleepGoal;
                    });
                  }}
                />
              </>

              <>
                <Tooltip
                  title={
                    loggedSleepToday && editingBehaviorId !== 3
                      ? "You've already logged this behavior today! You can change it by clicking the edit button to the right."
                      : ""
                  }
                >
                  <TextField
                    disabled={
                      loggedSleepToday && editingBehaviorId !== 3 ? true : false
                    }
                    className={
                      loggedSleepToday && editingBehaviorId !== 3
                        ? "disabled-behavior"
                        : "behavior"
                    }
                    style={styles.inputBox}
                    label="hours/day"
                    type="number"
                    value={sleepGoal.length && sleepGoal[0].behaviorValue}
                    onChange={(e) => {
                      setSleepGoal((prevSleepGoal) => {
                        const updatedSleepGoal = prevSleepGoal.map((goal) => {
                          const newSleepGoalValue = {
                            ...goal,
                            behaviorValue: Number(e.target.value),
                          };
                          return newSleepGoalValue;
                        });
                        return updatedSleepGoal;
                      });
                    }}
                  />
                </Tooltip>
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
              </>
            </GoalContainer>
          </div>

          <img
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
          />
        </div>
        <img
          className="middle-line"
          src={require("../../components/images/journal/middle_line.png")}
          alt="Middle journal line"
        />
        <div className="rightPageWrapper">
          <img
            className="bookmark"
            src={require("../../components/images/journal/bookmark.png")}
            alt="Yellow bookmark icon"
          />
          <div style={styles.goalScreen}>
            <div style={styles.goalRow}>
              <h2 style={styles.goalHeader}>Your Feedback</h2>
              <h2 style={styles.goalHeader}>Reflect</h2>
            </div>
            <div style={styles.goalRow}>
              {activityData.length &&
              activityGoal[0].goalValue !== 0 &&
              activityGoal[0].behaviorValue !== 0 ? (
                <h4 style={styles.feedback}>{renderFeedback(activityGoal)}</h4>
              ) : (
                <Tooltip title="Set an Activity goal today to see feedback!">
                  <LockIcon
                    style={{ margin: "auto", width: "30%" }}
                    className="lock-icon"
                  />
                </Tooltip>
              )}
              <ReflectionContainer>
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
                  title={
                    !activityData.length || !loggedActivityToday
                      ? "Record your first Activity goal for today!"
                      : activityData[0].goalValue -
                          activityData[0].goalValue ===
                          0 &&
                        activityData[0].behaviorValue -
                          activityGoal[0].behaviorValue ===
                          0 &&
                        activityData[0].reflection ===
                          activityGoal[0].reflection
                      ? "Today's Activity goal is up to date!"
                      : activityData[0].goalValue -
                          activityGoal[0].goalValue !==
                          0 ||
                        activityData[0].behaviorValue -
                          activityGoal[0].behaviorValue !==
                          0 ||
                        activityData[0].reflection !==
                          activityGoal[0].reflection
                      ? "Save changes to today's Activity goal"
                      : "No Activity Data found"
                  }
                >
                  <Button
                    className="save edit-icon"
                    style={{
                      color: "white",
                      border: "1px solid black",
                      backgroundColor:
                        loggedActivityToday &&
                        activityData.length &&
                        (activityData[0].goalValue -
                          activityGoal[0].goalValue !==
                          0 ||
                          activityData[0].behaviorValue -
                            activityGoal[0].behaviorValue !==
                            0 ||
                          activityData[0].reflection !==
                            activityGoal[0].reflection)
                          ? SAVE_ICON_COLORS.YELLOW
                          : !activityData.length || !loggedActivityToday
                          ? SAVE_ICON_COLORS.RED
                          : activityData[0].goalValue -
                              activityGoal[0].goalValue ===
                              0 &&
                            activityData[0].behaviorValue -
                              activityGoal[0].behaviorValue ===
                              0 &&
                            activityData[0].reflection ===
                              activityGoal[0].reflection
                          ? SAVE_ICON_COLORS.GREEN
                          : "auto",
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
                    }}
                  >
                    SAVE
                  </Button>
                </Tooltip>
              </ReflectionContainer>
            </div>

            <div style={styles.goalRow}>
              {screentimeData.length &&
              screentimeGoal[0].goalValue !== 0 &&
              screentimeGoal[0].behaviorValue !== 0 ? (
                <h4 style={styles.feedback}>
                  {renderFeedback(screentimeGoal)}
                </h4>
              ) : (
                <Tooltip title="Set a Screentime goal today to see feedback!">
                  <LockIcon
                    style={{ margin: "auto", width: "30%" }}
                    className="lock-icon"
                  />
                </Tooltip>
              )}
              <ReflectionContainer>
                <TextField
                  type="text"
                  placeholder="Type my thoughts"
                  style={{ width: "80%", fontSize: 2 }}
                  value={screentimeGoal.length && screentimeGoal[0].reflection}
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
                  title={
                    !screentimeData.length || !loggedScreentimeToday
                      ? "Record your first Screentime goal for today!"
                      : screentimeData[0].goalValue -
                          screentimeData[0].goalValue ===
                          0 &&
                        screentimeData[0].behaviorValue -
                          screentimeGoal[0].behaviorValue ===
                          0 &&
                        screentimeData[0].reflection ===
                          screentimeGoal[0].reflection
                      ? "Today's Screentime goal is up to date!"
                      : screentimeData[0].goalValue -
                          screentimeGoal[0].goalValue !==
                          0 ||
                        screentimeData[0].behaviorValue -
                          screentimeGoal[0].behaviorValue !==
                          0 ||
                        screentimeData[0].reflection !==
                          screentimeGoal[0].reflection
                      ? "Save changes to today's Screentime goal"
                      : "No Screentime Data found"
                  }
                >
                  <Button
                    className="save edit-icon"
                    style={{
                      color: "white",
                      border: "1px solid black",
                      backgroundColor:
                        loggedScreentimeToday &&
                        screentimeData.length &&
                        (screentimeData[0].goalValue -
                          screentimeGoal[0].goalValue !==
                          0 ||
                          screentimeData[0].behaviorValue -
                            screentimeGoal[0].behaviorValue !==
                            0 ||
                          screentimeData[0].reflection !==
                            screentimeGoal[0].reflection)
                          ? SAVE_ICON_COLORS.YELLOW
                          : !screentimeData.length || !loggedScreentimeToday
                          ? SAVE_ICON_COLORS.RED
                          : screentimeData[0].goalValue -
                              screentimeGoal[0].goalValue ===
                              0 &&
                            screentimeData[0].behaviorValue -
                              screentimeGoal[0].behaviorValue ===
                              0 &&
                            screentimeData[0].reflection ===
                              screentimeGoal[0].reflection
                          ? SAVE_ICON_COLORS.GREEN
                          : "auto",
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
                    }}
                  >
                    SAVE
                  </Button>
                </Tooltip>
              </ReflectionContainer>
            </div>

            <div style={styles.goalRow}>
              {eatingData.length &&
              eatingGoal[0].goalValue !== 0 &&
              eatingGoal[0].behaviorValue !== 0 ? (
                <h4 style={styles.feedback}>{renderFeedback(eatingGoal)}</h4>
              ) : (
                <Tooltip title="Set an Eating goal today to see feedback!">
                  <LockIcon
                    style={{ margin: "auto", width: "30%" }}
                    className="lock-icon"
                  />
                </Tooltip>
              )}
              <ReflectionContainer>
                <TextField
                  type="text"
                  placeholder="Type my thoughts"
                  style={{ width: "80%" }}
                  value={eatingGoal.length && eatingGoal[0].reflection}
                  onChange={(e) => {
                    setEatingGoal((prevEatingGoal) => {
                      const updatedEatingGoal = prevEatingGoal.map((goal) => {
                        const newEatingReflection = {
                          ...goal,
                          reflection: e.target.value,
                        };
                        return newEatingReflection;
                      });
                      return updatedEatingGoal;
                    });
                  }}
                />
                <Tooltip
                  title={
                    !eatingData.length || !loggedEatingToday
                      ? "Record your first Eating goal for today!"
                      : eatingData[0].goalValue - eatingGoal[0].goalValue ===
                          0 &&
                        eatingData[0].behaviorValue -
                          eatingGoal[0].behaviorValue ===
                          0 &&
                        eatingData[0].reflection === eatingGoal[0].reflection
                      ? "Today's Eating goal is up to date!"
                      : eatingData[0].goalValue - eatingGoal[0].goalValue !==
                          0 ||
                        eatingData[0].behaviorValue -
                          eatingGoal[0].behaviorValue !==
                          0 ||
                        eatingData[0].reflection !== eatingGoal[0].reflection
                      ? "Save changes to today's Eating goal"
                      : "No Eating Data found"
                  }
                >
                  <Button
                    className="save edit-icon"
                    style={{
                      color: "white",
                      border: "1px solid black",
                      backgroundColor:
                        loggedEatingToday &&
                        eatingData.length &&
                        (eatingData[0].goalValue - eatingGoal[0].goalValue !==
                          0 ||
                          eatingData[0].behaviorValue -
                            eatingGoal[0].behaviorValue !==
                            0 ||
                          eatingData[0].reflection !== eatingGoal[0].reflection)
                          ? SAVE_ICON_COLORS.YELLOW
                          : !eatingData.length || !loggedEatingToday
                          ? SAVE_ICON_COLORS.RED
                          : eatingData[0].goalValue -
                              eatingGoal[0].goalValue ===
                              0 &&
                            eatingData[0].behaviorValue -
                              eatingGoal[0].behaviorValue ===
                              0 &&
                            eatingData[0].reflection ===
                              eatingGoal[0].reflection
                          ? SAVE_ICON_COLORS.GREEN
                          : "auto",
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
                    }}
                  >
                    SAVE
                  </Button>
                </Tooltip>
              </ReflectionContainer>
            </div>

            <div style={styles.goalRow}>
              {sleepData.length &&
              sleepGoal[0].goalValue !== 0 &&
              sleepGoal[0].behaviorValue !== 0 ? (
                <h4 style={styles.feedback}>{renderFeedback(sleepGoal)}</h4>
              ) : (
                <Tooltip title="Set a Sleep goal today to see feedback!">
                  <LockIcon
                    style={{ width: "30%", display: "flex", margin: "0 auto" }}
                    className="lock-icon"
                  />
                </Tooltip>
              )}
              <ReflectionContainer>
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
                  title={
                    !sleepData.length || !loggedSleepToday
                      ? "Record your first Sleep goal for today!"
                      : sleepData[0].goalValue - sleepGoal[0].goalValue === 0 &&
                        sleepData[0].behaviorValue -
                          sleepGoal[0].behaviorValue ===
                          0 &&
                        sleepData[0].reflection === sleepGoal[0].reflection
                      ? "Today's Sleep goal is up to date!"
                      : sleepData[0].goalValue - sleepGoal[0].goalValue !== 0 ||
                        sleepData[0].behaviorValue -
                          sleepGoal[0].behaviorValue !==
                          0 ||
                        sleepData[0].reflection !== sleepGoal[0].reflection
                      ? "Save changes to today's Sleep goal"
                      : "No Sleep Data found"
                  }
                >
                  <Button
                    className="save edit-icon"
                    style={{
                      color: "white",
                      border: "1px solid black",
                      backgroundColor:
                        loggedSleepToday &&
                        sleepData.length &&
                        (sleepData[0].goalValue - sleepGoal[0].goalValue !==
                          0 ||
                          sleepData[0].behaviorValue -
                            sleepGoal[0].behaviorValue !==
                            0 ||
                          sleepData[0].reflection !== sleepGoal[0].reflection)
                          ? SAVE_ICON_COLORS.YELLOW
                          : !sleepData.length || !loggedSleepToday
                          ? SAVE_ICON_COLORS.RED
                          : sleepData[0].goalValue - sleepGoal[0].goalValue ===
                              0 &&
                            sleepData[0].behaviorValue -
                              sleepGoal[0].behaviorValue ===
                              0 &&
                            sleepData[0].reflection === sleepGoal[0].reflection
                          ? SAVE_ICON_COLORS.GREEN
                          : "auto",
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
                    }}
                  >
                    SAVE
                  </Button>
                </Tooltip>
              </ReflectionContainer>
            </div>
          </div>
          <img
            className="rightpage1"
            src={require("../../components/images/journal/right_page.png")}
            alt="First right-side page"
          />
          <img
            className="rightpage2"
            src={require("../../components/images/journal/right_page2.png")}
            alt="Second right-side page"
          />
          <img
            className="rightpage3"
            src={require("../../components/images/journal/right_page3.png")}
            alt="Third right-side page"
          />
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
    width: "90%",
    height: "90%",
    justifyContent: "space-between",
  },
  goalRow: {
    display: "flex",
    marginLeft: "5%",
    justifyContent: "space-between",
    alignItems: "center",
    width: "auto",
  },
  goalLabel: {
    width: "auto",
    margin: "5%",
    fontSize: 22,
  },
  inputBox: {
    width: "20%",
    marginLeft: "auto",
    marginRight: "auto",
    size: "10px",
  },
  goalHeader: {
    display: "flex",
    justifyContent: "space-between",
    width: "30%",
    marginLeft: "auto",
    padding: 5,
  },
  activityIcon: {
    width: "30px",
    marginLeft: 10,
  },
  screentimeIcon: {
    width: "30px",
    marginLeft: 10,
  },
  eatingIcon: {
    width: "30px",
    marginLeft: 10,
  },
  sleepIcon: {
    width: "30px",
    marginLeft: 10,
  },
  titleGroup: {
    display: "flex",
    margin: "auto",
    flexDirection: "row",
    width: "40%",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  feedback: {
    width: "35%",
    color: "blue",
    marginLeft: "auto",
    padding: 5,
  },
};
