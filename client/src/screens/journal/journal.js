import React, { useState, useEffect } from "react";
import "../../css/journal.css";
import withAuth from "../../components/auth/withAuth";
import axios from "axios";

import { TextField, Tooltip, CircularProgress } from "@mui/material";
import styled from "styled-components";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import EditIcon from "@mui/icons-material/Edit";
import CheckIcon from "@mui/icons-material/Check";
import LockIcon from "@mui/icons-material/Lock";

import { BehaviorTrackingCSV, GoalCSV } from "./csv";

const Wrapper = styled.div`
  margin-top: 1%;
  padding-bottom: 5%;
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
  justify-content: space-between;
  width: 50%;

  .edit-icon {
    margin-left: 2%;

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

const SubmitCheckIcon = styled(CheckIcon)`
  margin-left: -15px;

  &:hover {
    cursor: pointer;
    color: green;
  }
`;

const JournalScreen = () => {
  const [user, setUser] = useState([]);
  const [goalData, setGoalData] = useState([]);
  const [allGoalData, setAllGoalData] = useState([]);
  const [allBehaviorData, setAllBehaviorData] = useState([]);

  const [goalValueExists, setGoalValueExists] = useState([]);

  const [loggedActivityToday, setLoggedActivityToday] = useState(false);
  const [loggedScreentimeToday, setLoggedScreentimeToday] = useState(false);
  const [loggedEatingToday, setLoggedEatingToday] = useState(false);
  const [loggedSleepToday, setLoggedSleepToday] = useState(false);

  const [editingBehaviorId, setEditingBehaviorId] = useState(-1);
  const [editingReflectionId, setEditingReflectionId] = useState(-1);

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
    },
  ]);

  // Stores goal data pulled from MongoDB.
  const [activityData, setActivityData] = useState({});
  const [screentimeData, setScreentimeData] = useState({});
  const [eatingData, setEatingData] = useState({});
  const [sleepData, setSleepData] = useState({});

  const renderFeedback = (goalData) => {
    return (goalData !== screentimeData &&
      goalData[0].behaviorValue > goalData[0].goalValue) ||
      (goalData === screentimeData &&
        goalData[0].behaviorValue < goalData[0].goalValue)
      ? "Great! I exceeded my goal!"
      : goalData[0].behaviorValue === goalData[0].goalValue
      ? "Hooray! I reached my goal!"
      : (goalData !== screentimeData &&
          goalData[0].behaviorValue < goalData[0].goalValue / 2) ||
        (goalData === screentimeData &&
          goalData[0].behaviorValue > goalData[0].goalValue * 2)
      ? "I need to work harder to reach my goal!"
      : (goalData !== screentimeData &&
          goalData[0].behaviorValue < goalData[0].goalValue) ||
        (goalData === screentimeData &&
          goalData[0].behaviorValue > goalData[0].goalValue)
      ? "I'm not too far away from my goal!"
      : "...";
  };

  useEffect(() => {
    const fetchDailyBehavior = async (goalType) => {
      try {
        const response = await axios.get(
          "http://localhost:3001/dailyBehavior",
          {
            params: {
              user: user,
              goalType: goalType,
              date: date,
            },
          }
        );
        if (response.data.length) {
          console.log('logged today')
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
    const fetchGoals = async () => {
      try {
        const response = await axios.get("http://localhost:3001/goals", {
          params: {
            user: user,
          },
        });
        setGoalData(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    const fetchAllGoals = async () => {
      try {
        const response = await axios.get("http://localhost:3001/allGoals", {});
        setAllGoalData(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchGoals();
    fetchAllGoals();
  }, [user, activityGoal, screentimeGoal, eatingGoal, sleepGoal]);

  useEffect(() => {
    const fetchEatingGoals = async () => {
      try {
        const response = await axios.get("http://localhost:3001/goalType", {
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
        const response = await axios.get("http://localhost:3001/goalType", {
          params: {
            user: user,
            goalType: "eating",
          },
        });
        if (response.data.length === 0) {
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
        const response = await axios.get("http://localhost:3001/goalType", {
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
        const response = await axios.get("http://localhost:3001/goalType", {
          params: {
            user: user,
            goalType: "activity",
          },
        });
        if (response.data.length === 0) {
          setActivityGoal(activityGoal);
        } else {
          setActivityGoal(response.data);
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchActivityGoals();
  }, [user]);

  useEffect(() => {
    const fetchSleepGoals = async () => {
      try {
        const response = await axios.get("http://localhost:3001/goalType", {
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
        const response = await axios.get("http://localhost:3001/goalType", {
          params: {
            user: user,
            goalType: "sleep",
          },
        });
        if (response.data.length === 0) {
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
        const response = await axios.get("http://localhost:3001/goalType", {
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
        const response = await axios.get("http://localhost:3001/goalType", {
          params: {
            user: user,
            goalType: "screentime",
          },
        });
        if (response.data.length === 0) {
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

  useEffect(() => {
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

    fetchAllBehaviors();
  }, [user]);

  var dateToday = new Date(),
    month = dateToday.getMonth(),
    day = dateToday.getDate(),
    year = dateToday.getFullYear(),
    date = month + 1 + "/" + day + "/" + year;

  const [inputGoalValue, setInputGoalValue] = useState(false);

  const handleEnter = (event) => {
    if (event.key === "Enter") {
      setInputGoalValue(false);
    }
  };

  const handleBlur = (event) => {
    setInputGoalValue(false);
  };

  function updateGoalValue(id, newQuantity) {
    if (id === 0) {
      setActivityGoal((prevActivityGoal) => {
        const updatedActivityGoal = prevActivityGoal.map((goal) => {
          const updatedGoal = { ...goal, goalValue: +newQuantity };
          axios
            .post("http://localhost:3001/goals", {
              user: user._id,
              goalType: goal.goalType,
              goalValue: newQuantity,
              behaviorValue: goal.behaviorValue,
              divInfo1: goal.divInfo1,
              divInfo2: goal.divInfo2,
              date: date,
              goalStatus: goal.behaviorValue >= newQuantity ? "yes" : "no",
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
          const updatedGoal = { ...goal, goalValue: +newQuantity };
          axios
            .post("http://localhost:3001/goals", {
              user: user._id,
              goalType: goal.goalType,
              goalValue: newQuantity,
              behaviorValue: goal.behaviorValue,
              divInfo1: goal.divInfo1,
              divInfo2: goal.divInfo2,
              date: date,
              goalStatus: goal.behaviorValue >= newQuantity ? "yes" : "no",
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
          const updatedGoal = { ...goal, goalValue: +newQuantity };
          axios
            .post("http://localhost:3001/goals", {
              user: user._id,
              goalType: goal.goalType,
              goalValue: newQuantity,
              behaviorValue: goal.behaviorValue,
              divInfo1: goal.divInfo1,
              divInfo2: goal.divInfo2,
              date: date,
              goalStatus: goal.behaviorValue >= newQuantity ? "yes" : "no",
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
          const updatedGoal = { ...goal, goalValue: +newQuantity };
          axios
            .post("http://localhost:3001/goals", {
              user: user._id,
              goalType: goal.goalType,
              goalValue: newQuantity,
              behaviorValue: goal.behaviorValue,
              divInfo1: goal.divInfo1,
              divInfo2: goal.divInfo2,
              date: date,
              goalStatus: goal.behaviorValue >= newQuantity ? "yes" : "no",
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

  function updateBehaviorValue(id, newBehaviorValue) {
    if (id === 0) {
      setActivityGoal((prevActivityGoal) => {
        const updatedActivityGoal = prevActivityGoal.map((goal) => {
          const updatedGoal = { ...goal, behaviorValue: +newBehaviorValue };
          axios
            .post("http://localhost:3001/goals", {
              user: user._id,
              goalType: "activity",
              goalValue: activityData[0].goalValue,
              behaviorValue: newBehaviorValue,
              goalStatus:
                newBehaviorValue >= activityData[0].goalValue ? "yes" : "no",
            })
            .then((response) => {
              console.log(response.data);
            })
            .catch((error) => {
              console.error(error);
            });
          axios
            .post("http://localhost:3001/behaviors", {
              user: user._id,
              name: user.name,
              goalType: "activity",
              date: date,
              goalValue: activityData[0].goalValue,
              behaviorValue: newBehaviorValue,
              goalStatus:
                newBehaviorValue >= activityData[0].goalValue ? "yes" : "no",
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
            .post("http://localhost:3001/goals", {
              user: user._id,
              goalType: "screentime",
              goalValue: screentimeData[0].goalValue,
              behaviorValue: newBehaviorValue,
              goalStatus:
                newBehaviorValue >= screentimeData[0].goalValue ? "yes" : "no",
            })
            .then((response) => {
              console.log(response.data);
            })
            .catch((error) => {
              console.error(error);
            });
          axios
            .post("http://localhost:3001/behaviors", {
              user: user._id,
              name: user.name,
              goalType: "screentime",
              date: date,
              goalValue: screentimeData[0].goalValue,
              behaviorValue: newBehaviorValue,
              goalStatus:
                newBehaviorValue >= screentimeData[0].goalValue ? "yes" : "no",
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
            .post("http://localhost:3001/goals", {
              user: user._id,
              goalType: "eating",
              goalValue: eatingData[0].goalValue,
              behaviorValue: newBehaviorValue,
              goalStatus:
                newBehaviorValue >= eatingData[0].goalValue ? "yes" : "no",
            })
            .then((response) => {
              console.log(response.data);
            })
            .catch((error) => {
              console.error(error);
            });
          axios
            .post("http://localhost:3001/behaviors", {
              user: user._id,
              name: user.name,
              goalType: "eating",
              date: date,
              goalValue: eatingData[0].goalValue,
              behaviorValue: newBehaviorValue,
              goalStatus:
                newBehaviorValue >= eatingData[0].goalValue ? "yes" : "no",
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
            .post("http://localhost:3001/goals", {
              user: user._id,
              goalType: "sleep",
              goalValue: sleepData[0].goalValue,
              behaviorValue: newBehaviorValue,
              goalStatus:
                newBehaviorValue >= sleepData[0].goalValue ? "yes" : "no",
            })
            .then((response) => {
              console.log(response.data);
            })
            .catch((error) => {
              console.error(error);
            });
          axios
            .post("http://localhost:3001/behaviors", {
              user: user._id,
              name: user.name,
              goalType: "sleep",
              date: date,
              goalValue: sleepData[0].goalValue,
              behaviorValue: newBehaviorValue,
              goalStatus:
                newBehaviorValue >= sleepData[0].goalValue ? "yes" : "no",
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

  function updateGoalReflection(id, newReflection) {
    if (id === 0) {
      setActivityGoal((prevActivityGoal) => {
        const updatedActivityGoal = prevActivityGoal.map((goal) => {
          const updatedGoal = { ...goal, reflection: newReflection };
          axios
            .post("http://localhost:3001/goals", {
              user: user._id,
              goalType: "activity",
              reflection: newReflection,
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
          const updatedGoal = { ...goal, reflection: newReflection };
          axios
            .post("http://localhost:3001/goals", {
              user: user._id,
              goalType: "screentime",
              reflection: newReflection,
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
          const updatedGoal = { ...goal, reflection: newReflection };
          axios
            .post("http://localhost:3001/goals", {
              user: user._id,
              goalType: "eating",
              reflection: newReflection,
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
          const updatedGoal = { ...goal, reflection: newReflection };
          axios
            .post("http://localhost:3001/goals", {
              user: user._id,
              goalType: "sleep",
              reflection: newReflection,
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

  return (
    <Wrapper>
      <h1 style={{ color: "#2E6AA1" }}>My Journal</h1>
      <JournalWrapper>
        <GoalCSV allGoalData={allGoalData} />
        <BehaviorTrackingCSV allBehaviorData={allBehaviorData} />
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
                <h2 style={styles.goalLabel}>Do</h2>
                <Tooltip title="Exercise, do chores, play sports, and go out and do other physical activities.">
                  <HelpOutlineIcon style={{ fontSize: "16px" }} />
                </Tooltip>
              </div>
              {inputGoalValue === true ? (
                <>
                  <TextField
                    style={styles.inputBox}
                    label="minutes/day"
                    id="input"
                    type="number"
                    onBlur={handleBlur}
                    onKeyDown={handleEnter}
                    value={activityGoal.length ? activityGoal[0].goalValue : ""}
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
                  <Tooltip title="Change Goal Value">
                    <SubmitCheckIcon
                      onClick={() =>
                        updateGoalValue(0, activityGoal[0].goalValue)
                      }
                    />
                  </Tooltip>
                </>
              ) : (
                <h2 onClick={setInputGoalValue(true)}>
                  {activityData.length ? activityData.goalValue : ""}
                </h2>
              )}

              {activityData.length ? (
                <>
                  <TextField
                    disabled={
                      loggedActivityToday && editingBehaviorId !== 0
                        ? true
                        : false
                    }
                    style={styles.inputBox}
                    label="minutes/day"
                    type="number"
                    value={
                      activityGoal.length ? activityGoal[0].behaviorValue : ""
                    }
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
                  {loggedActivityToday ? (
                    <Tooltip title="You've already logged an activity behavior for today, but you can change it if you'd like!">
                      <EditIcon
                        className="save edit-icon"
                        onClick={() => {
                          if (editingBehaviorId !== 0) {
                            setEditingBehaviorId(0);
                          } else {
                            updateBehaviorValue(
                              0,
                              activityGoal[0].behaviorValue
                            );
                            setEditingBehaviorId(-1);
                            setLoggedActivityToday(true);
                          }
                        }}
                      />
                    </Tooltip>
                  ) : (
                    <>
                      <Tooltip title="Log Daily Behavior Value">
                        <SubmitCheckIcon
                          onClick={() => {
                            updateBehaviorValue(
                              0,
                              activityGoal[0].behaviorValue
                            );
                            setLoggedActivityToday(true);
                          }}
                        />
                      </Tooltip>
                    </>
                  )}
                </>
              ) : (
                <Tooltip title="Set a goal value to log behaviors!">
                  <LockIcon style={{ width: "30%", }} className="lock-icon" />
                </Tooltip>
              )}
            </GoalContainer>

            <GoalContainer style={styles.goalRow}>
              <div style={styles.titleGroup}>
                <img
                  style={styles.screentimeIcon}
                  src={require("../../components/images/journal/tablet_icon.png")}
                  alt="Tablet for screentime goals"
                />
                <h2 style={styles.goalLabel}>View</h2>
                <Tooltip title="Limit time using phones, laptops, and other screens every day. The only goal where a lower behavior value is better!">
                  <HelpOutlineIcon style={{ fontSize: "16px" }} />
                </Tooltip>
              </div>
              {inputGoalValue === true ? (
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
                  <Tooltip title="Change Goal Value">
                    <SubmitCheckIcon
                      onClick={() =>
                        updateGoalValue(1, screentimeGoal[0].goalValue)
                      }
                    />
                  </Tooltip>
                </>
              ) : (
                <h2>
                  {screentimeData.length ? screentimeData[0].goalValue : ""}
                </h2>
              )}

              {screentimeData.length ? (
                <>
                  <TextField
                    disabled={
                      loggedScreentimeToday && editingBehaviorId !== 1
                        ? true
                        : false
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
                  {loggedScreentimeToday ? (
                    <Tooltip title="You've already logged an activity behavior for today, but you can change it if you'd like!">
                      <EditIcon
                        className="save edit-icon"
                        onClick={() => {
                          if (editingBehaviorId !== 1) {
                            setEditingBehaviorId(1);
                          } else {
                            updateBehaviorValue(
                              1,
                              screentimeGoal[0].behaviorValue
                            );
                            setEditingBehaviorId(-1);
                            setLoggedScreentimeToday(true);
                          }
                        }}
                      />
                    </Tooltip>
                  ) : (
                    <>
                      <Tooltip title="Log Daily Behavior Value">
                        <SubmitCheckIcon
                          onClick={() => {
                            updateBehaviorValue(
                              1,
                              screentimeGoal[0].behaviorValue
                            );
                            setLoggedScreentimeToday(true);
                          }}
                        />
                      </Tooltip>
                    </>
                  )}
                </>
              ) : (
                <Tooltip title="Set a goal value to log behaviors!">
                  <LockIcon style={{ width: "30%", }} className="lock-icon" />
                </Tooltip>
              )}
            </GoalContainer>

            <GoalContainer style={styles.goalRow}>
              <div style={styles.titleGroup}>
                <img
                  style={styles.eatingIcon}
                  src={require("../../components/images/journal/apple.png")}
                  alt="Apple for servings goal"
                />
                <h2 style={styles.goalLabel}>Chew</h2>
                <Tooltip title="Eat recommended daily servings of fruits and vegetables for a healthier diet.">
                  <HelpOutlineIcon style={{ fontSize: "16px" }} />
                </Tooltip>
              </div>

              {inputGoalValue === true ? (
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
                  <Tooltip title="Change Goal Value">
                    <SubmitCheckIcon
                      onClick={() =>
                        updateGoalValue(2, eatingGoal[0].goalValue)
                      }
                    />
                  </Tooltip>
                </>
              ) : (
                <h2>{eatingData.length ? eatingData[0].goalValue : ""}</h2>
              )}

              {eatingData.length ? (
                <>
                  <TextField
                    disabled={
                      loggedEatingToday && editingBehaviorId !== 2
                        ? true
                        : false
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
                  {loggedEatingToday ? (
                    <Tooltip title="You've already logged an eating behavior for today, but you can change it if you'd like!">
                      <EditIcon
                        className="save edit-icon"
                        onClick={() => {
                          if (editingBehaviorId !== 2) {
                            setEditingBehaviorId(2);
                          } else {
                            updateBehaviorValue(2, eatingGoal[0].behaviorValue);
                            setEditingBehaviorId(-1);
                            setLoggedEatingToday(true);
                          }
                        }}
                      />
                    </Tooltip>
                  ) : (
                    <>
                      <Tooltip title="Log Daily Behavior Value">
                        <SubmitCheckIcon
                          onClick={() => {
                            updateBehaviorValue(2, eatingGoal[0].behaviorValue);
                            setLoggedEatingToday(true);
                          }}
                        />
                      </Tooltip>
                    </>
                  )}
                </>
              ) : (
                <Tooltip title="Set a goal value to log behaviors!">
                  <LockIcon style={{ width: "30%", }} className="lock-icon" />
                </Tooltip>
              )}
            </GoalContainer>

            <GoalContainer style={styles.goalRow}>
              <div style={styles.titleGroup}>
                <img
                  style={styles.sleepIcon}
                  src={require("../../components/images/journal/pillow_icon.png")}
                  alt="Pillow icon for sleep"
                />
                <h2 style={styles.goalLabel}>Sleep</h2>
                <Tooltip title="Get a good night's rest to be productive and healthy.">
                  <HelpOutlineIcon style={{ fontSize: "16px" }} />
                </Tooltip>
              </div>

              {inputGoalValue === true ? (
                <>
                  <TextField
                    style={styles.inputBox}
                    label="hours/day"
                    type="number"
                    value={sleepGoal.length ? sleepGoal[0].goalValue : ""}
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
                  <Tooltip title="Change Goal Value">
                    <SubmitCheckIcon
                      onClick={() => updateGoalValue(3, sleepGoal[0].goalValue)}
                    />
                  </Tooltip>
                </>
              ) : (
                <h2>{sleepData.length ? sleepData[0].goalValue : ""}</h2>
              )}

              {sleepData.length ? (
                <>
                  <TextField
                    disabled={
                      loggedSleepToday && editingBehaviorId !== 3 ? true : false
                    }
                    style={styles.inputBox}
                    label="hours/day"
                    type="number"
                    value={sleepGoal.length ? sleepGoal[0].behaviorValue : ""}
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
                  {loggedSleepToday ? (
                    <Tooltip title="You've already logged an activity behavior for today, but you can change it if you'd like!">
                      <EditIcon
                        className="save edit-icon"
                        onClick={() => {
                          if (editingBehaviorId !== 3) {
                            setEditingBehaviorId(3);
                          } else {
                            updateBehaviorValue(3, sleepGoal[0].behaviorValue);
                            setEditingBehaviorId(-1);
                          }
                        }}
                      />
                    </Tooltip>
                  ) : (
                    <>
                      <Tooltip title="Log Daily Behavior Value">
                        <SubmitCheckIcon
                          onClick={() => {
                            updateBehaviorValue(3, sleepGoal[0].behaviorValue);
                            setLoggedSleepToday(true);
                          }}
                        />
                      </Tooltip>
                    </>
                  )}
                </>
              ) : (
                <Tooltip title="Set a goal value to log behaviors!">
                  <LockIcon style={{ width: "30%" }} className="lock-icon" />
                </Tooltip>
              )}
            </GoalContainer>
          </div>

          <img
            className="leftpage1"
            src={require("../../components/images/journal/right_page.png")}
            alt="First left-side page"
          />
          <img
            className="leftpage2"
            src={require("../../components/images/journal/right_page2.png")}
            alt="Second left-side page"
          />
          <img
            className="leftpage3"
            src={require("../../components/images/journal/right_page.png")}
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
              {activityData.length ? (
                <h4 style={styles.feedback}>{renderFeedback(activityData)}</h4>
              ) : (
                <Tooltip title="Set a goal value to see feedback!">
                  <LockIcon style={{ margin: "auto", width: "30%" }} className="lock-icon" />
                </Tooltip>
              )}
              <ReflectionContainer>
                {editingReflectionId === 0 ? (
                  <>
                    <TextField
                      type="text"
                      placeholder="Type my thoughts"
                      style={{ width: "100%" }}
                      value={activityGoal[0].reflection}
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
                    <Tooltip title="Save Reflection">
                      <EditIcon
                        className="save edit-icon"
                        onClick={() => {
                          setEditingReflectionId(-1);
                          updateGoalReflection(0, activityGoal[0].reflection);
                        }}
                      />
                    </Tooltip>
                  </>
                ) : (
                  <>
                    <span
                      style={{
                        width: "100%",
                        height: "60px",
                        textOverflow: "ellipsis",
                        overflowY: "scroll",
                      }}
                    >
                      {activityData.length ? activityData[0].reflection : ""}
                    </span>
                    <Tooltip title="Edit Reflection">
                      <EditIcon
                        className="edit-icon"
                        onClick={() => {
                          setEditingReflectionId(0);
                        }}
                      />
                    </Tooltip>
                  </>
                )}
              </ReflectionContainer>
            </div>

            <div style={styles.goalRow}>
              {screentimeData.length ? (
                <h4 style={styles.feedback}>
                  {renderFeedback(screentimeData)}
                </h4>
              ) : (
                <Tooltip title="Set a goal value to see feedback!">
                  <LockIcon style={{ margin: "auto", width: "30%" }} className="lock-icon" />
                </Tooltip>
              )}
              <ReflectionContainer>
                {editingReflectionId === 1 ? (
                  <>
                    <TextField
                      type="text"
                      placeholder="Type my thoughts"
                      style={{ width: "100%" }}
                      value={
                        screentimeGoal.length
                          ? screentimeGoal[0].reflection
                          : ""
                      }
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
                    <Tooltip title="Save Reflection">
                      <EditIcon
                        className="save edit-icon"
                        onClick={() => {
                          setEditingReflectionId(-1);
                          updateGoalReflection(1, screentimeGoal[0].reflection);
                        }}
                      />
                    </Tooltip>
                  </>
                ) : (
                  <>
                    <span
                      style={{
                        width: "100%",
                        height: "60px",
                        textOverflow: "ellipsis",
                        overflowY: "scroll",
                      }}
                    >
                      {screentimeData.length
                        ? screentimeData[0].reflection
                        : ""}
                    </span>
                    <Tooltip title="Edit Reflection">
                      <EditIcon
                        className="edit-icon"
                        onClick={() => {
                          setEditingReflectionId(1);
                        }}
                      />
                    </Tooltip>
                  </>
                )}
              </ReflectionContainer>
            </div>

            <div style={styles.goalRow}>
              {eatingData.length ? (
                <h4 style={styles.feedback}>{renderFeedback(eatingData)}</h4>
              ) : (
                <Tooltip title="Set a goal value to see feedback!">
                  <LockIcon style={{ margin: "auto", width: "30%" }} className="lock-icon" />
                </Tooltip>
              )}
              <ReflectionContainer>
                {editingReflectionId === 2 ? (
                  <>
                    <TextField
                      type="text"
                      placeholder="Type my thoughts"
                      style={{ width: "100%" }}
                      value={eatingGoal.length ? eatingGoal[0].reflection : ""}
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
                    <Tooltip title="Save Reflection">
                      <EditIcon
                        className="save edit-icon"
                        onClick={() => {
                          setEditingReflectionId(-1);
                          updateGoalReflection(2, eatingGoal[0].reflection);
                        }}
                      />
                    </Tooltip>
                  </>
                ) : (
                  <>
                    <span
                      style={{
                        width: "100%",
                        height: "60px",
                        textOverflow: "ellipsis",
                        overflowY: "scroll",
                      }}
                    >
                      {eatingData.length ? eatingData[0].reflection : ""}
                    </span>
                    <Tooltip title="Edit Reflection">
                      <EditIcon
                        className="edit-icon"
                        onClick={() => {
                          setEditingReflectionId(2);
                        }}
                      />
                    </Tooltip>
                  </>
                )}
              </ReflectionContainer>
            </div>

            <div style={styles.goalRow}>
              {sleepData.length ? (
                <h4 style={styles.feedback}>{renderFeedback(sleepData)}</h4>
              ) : (
                <Tooltip title="Set a goal value to see feedback!">
                  <LockIcon style={{ margin: "auto", width: "30%" }} className="lock-icon" />
                </Tooltip>
              )}
              <ReflectionContainer>
                {editingReflectionId === 3 ? (
                  <>
                    <TextField
                      type="text"
                      placeholder="Type my thoughts"
                      style={{ width: "100%" }}
                      value={sleepGoal.length ? sleepGoal[0].reflection : ""}
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
                    <Tooltip title="Save Reflection">
                      <EditIcon
                        className="save edit-icon"
                        onClick={() => {
                          setEditingReflectionId(-1);
                          updateGoalReflection(3, sleepGoal[0].reflection);
                        }}
                      />
                    </Tooltip>
                  </>
                ) : (
                  <>
                    <span
                      style={{
                        width: "100%",
                        height: "60px",
                        textOverflow: "ellipsis",
                        overflowY: "scroll",
                      }}
                    >
                      {sleepData.length ? sleepData[0].reflection : ""}
                    </span>
                    <Tooltip title="Edit Reflection">
                      <EditIcon
                        className="edit-icon"
                        onClick={() => {
                          setEditingReflectionId(3);
                        }}
                      />
                    </Tooltip>
                  </>
                )}
              </ReflectionContainer>
            </div>
          </div>
          <img
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
          />
        </div>
      </JournalWrapper>
    </Wrapper>
  );
};

export default withAuth(JournalScreen);

let styles = {
  addGoalButton: {
    backgroundColor: "#78C648",
    textTransform: "none",
    fontWeight: "bold",
    fontSize: "14px",
    borderRadius: "25px",
    color: "white",
    width: "175px",
    marginTop: "5%",
    marginLeft: "auto",
    marginRight: "auto",
  },
  learnMoreButton: {
    backgroundColor: "#9B8EEB",
    textTransform: "none",
    fontWeight: "bold",
    fontSize: "14px",
    borderRadius: "25px",
    color: "white",
    width: "150px",
    marginTop: "5%",
  },
  cancelButton: {
    backgroundColor: "#D9D9D9",
    width: "45%",
    textTransform: "none",
    fontWeight: "bold",
    fontSize: "18px",
    borderRadius: "20px",
  },
  behaviorInput: {
    width: "50%",
    height: "50%",
  },
  goalValueInput: {
    display: "flex",
    width: "20%",
  },
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
    justifyContent: "space-between",
    alignItems: "center",
    width: "auto",
  },
  goalLabel: {
    width: "30%",
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
  },
  activityIcon: {
    width: "30px",
  },
  screentimeIcon: {
    width: "30px",
  },
  eatingIcon: {
    width: "30px",
  },
  sleepIcon: {
    width: "30px",
  },
  titleGroup: {
    display: "flex",
    margin: "auto",
    flexDirection: "row",
    width: "30%",
    justifyContent: "space-between",
    alignItems: "center",
  },
  feedback: {
    width: "35%",
    color: "blue",
    marginLeft: "auto",
  },
};
