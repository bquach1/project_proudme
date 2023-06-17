import React, { useState, useEffect } from "react";
import "../../css/journal.css";
import withAuth from "../../components/auth/withAuth";
import axios from "axios";

import { CSVLink } from "react-csv";
import { TextField, CircularProgress, Tooltip } from "@mui/material";
import styled from "styled-components";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import EditIcon from "@mui/icons-material/Edit";

const Wrapper = styled.div`
  margin-top: 1%;
  padding-bottom: 5%;
`;

const ReflectionContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;

  .edit-icon {
    margin-left: 2%;

    &:hover {
      cursor: pointer;
      transition: 0.5s;
      color: green;
    }
  }
`;

const JournalScreen = () => {
  const [user, setUser] = useState([]);
  const [goalData, setGoalData] = useState([]);
  const [allGoalData, setAllGoalData] = useState([]);
  const [behaviorData, setBehaviorData] = useState([]);
  const [allBehaviorData, setAllBehaviorData] = useState([]);

  const [goalReflection, setGoalReflection] = useState(["", "", "", ""]);
  const [editingReflectionId, setEditingReflectionId] = useState(-1);

  const [activityGoal, setActivityGoal] = useState([
    {
      id: 0,
      goalType: "activity",
      goalValue: "",
      divInfo1: "Get at least 60 minutes of physical activity per day",
      divInfo2:
        "Do exercises like running or playing sports for at least an hour a day.",
      reflection: "",
      date: date,
    },
  ]);
  const [screentimeGoal, setScreentimeGoal] = useState([
    {
      id: 1,
      goalType: "screentime",
      goalValue: "",
      divInfo1: "Limit screentime to 2 hours a day",
      divInfo2:
        "Go outside instead of using tech like laptops, phones, and televisions.",
      reflection: "",
      date: date,
    },
  ]);
  const [eatingGoal, setEatingGoal] = useState([
    {
      id: 2,
      goalType: "eating",
      goalValue: "",
      divInfo1: "Eat 5 or more servings of fruits and/or vegetables",
      divInfo2: "Reach target increments for servings of healthy foods.",
      reflection: "",
      date: date,
    },
  ]);
  const [sleepGoal, setSleepGoal] = useState([
    {
      id: 3,
      goalType: "sleep",
      goalValue: "",
      divInfo1: "Get at least 9 hours of sleep a night",
      divInfo2:
        "Sleep at least 9-11 hours a night to feel the best and most productive.",
      reflection: "",
      date: date,
    },
  ]);

  const [activityData, setActivityData] = useState({});
  const [screentimeData, setScreentimeData] = useState({});
  const [eatingData, setEatingData] = useState({});
  const [sleepData, setSleepData] = useState({});

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
    const fetchBehaviors = async () => {
      try {
        const response = await axios.get("http://localhost:3001/behaviors", {
          params: {
            user: user,
          },
        });
        setBehaviorData(response.data);
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
      } catch (error) {
        console.error(error);
      }
    };

    fetchBehaviors();
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

  const GoalCSV = () => {
    const headers = [
      { label: "_id", key: "_id" },
      { label: "User", key: "user" },
      { label: "Goal Details", key: "divInfo1" },
      { label: "Goal Description", key: "divInfo2" },
      { label: "Goal Quantity", key: "goalValue" },
      { label: "Daily Value", key: "behaviorValue" },
      { label: "Type of Goal", key: "goalType" },
      { label: "Date", key: "date" },
      { label: "Goal Reflection", key: "reflection" },
      { label: "Goal Met?", key: "goalStatus" },
      { label: "__v", key: "__v" },
    ];

    return (
      <div>
        <CSVLink data={allGoalData} headers={headers} filename="goaldata.csv">
          <img
            className="achievements-tab"
            src={require("../../components/images/journal/achievements_tab.png")}
            alt="Achievements bookmark tab"
          />
        </CSVLink>
      </div>
    );
  };

  const BehaviorTrackingCSV = () => {
    const behaviorHeaders = [
      { label: "User", key: "user" },
      { label: "Type of Goal", key: "goalType" },
      { label: "Goal Quantity", key: "goalValue" },
      { label: "Date", key: "date" },
      { label: "Daily Value", key: "behaviorValue" },
      { label: "Goal Met?", key: "goalStatus" },
    ];

    return (
      <div>
        <CSVLink
          data={allBehaviorData}
          headers={behaviorHeaders}
          filename="behaviordata.csv"
        >
          <img
            className="gallery-tab"
            src={require("../../components/images/journal/gallery_tab.png")}
            alt="Achievements bookmark tab"
          />
        </CSVLink>
      </div>
    );
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
              goalType: "activity",
              date: date,
              formattedDate: date,
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
              goalType: "screentime",
              date: date,
              formattedDate: date,
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
              goalType: "eating",
              date: date,
              formattedDate: date,
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
              goalType: "sleep",
              date: date,
              formattedDate: date,
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
    <Wrapper className="journal">
      <h1 style={{ color: "#2E6AA1" }}>My Journal</h1>
      <div className="journalWrapper">
        <GoalCSV />
        <BehaviorTrackingCSV />
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

            <div style={styles.goalRow}>
              <div style={styles.titleGroup}>
                <img
                  style={styles.activityIcon}
                  src={require("../../components/images/journal/activity_goals.png")}
                  alt="Activity goals icon on activity goals page"
                />
                <h2 style={styles.goalLabel}>Do</h2>
                {/* <HelpOutlineIcon fontSize="small"/> */}
              </div>
              {inputGoalValue === true ? (
                <TextField
                  style={styles.inputBox}
                  label="minutes/day"
                  id="input"
                  type="number"
                  onBlur={handleBlur}
                  onKeyDown={handleEnter}
                  value={activityData.length ? activityData[0].goalValue : ""}
                  onChange={(e) => {
                    updateGoalValue(0, +e.target.value);
                  }}
                />
              ) : (
                <h2 onClick={setInputGoalValue(true)}>
                  {activityData.length ? activityData.goalValue : ""}
                </h2>
              )}
              <TextField
                style={styles.inputBox}
                label="minutes/day"
                type="number"
                value={activityData.length ? activityData[0].behaviorValue : ""}
                onChange={(e) => {
                  updateBehaviorValue(0, +e.target.value);
                }}
              />
            </div>

            <div style={styles.goalRow}>
              <div style={styles.titleGroup}>
                <img
                  style={styles.screentimeIcon}
                  src={require("../../components/images/journal/tablet_icon.png")}
                  alt="Tablet for screentime goals"
                />
                <h2 style={styles.goalLabel}>View</h2>
              </div>
              {inputGoalValue === true ? (
                <TextField
                  style={styles.inputBox}
                  label="minutes/day"
                  type="number"
                  value={
                    screentimeData.length ? screentimeData[0].goalValue : ""
                  }
                  onChange={(e) => {
                    updateGoalValue(1, +e.target.value);
                  }}
                />
              ) : (
                <h2>
                  {screentimeData.length ? screentimeData[0].goalValue : ""}
                </h2>
              )}

              <TextField
                style={styles.inputBox}
                label="minutes/day"
                type="number"
                value={
                  screentimeData.length ? screentimeData[0].behaviorValue : ""
                }
                onChange={(e) => {
                  updateBehaviorValue(1, +e.target.value);
                }}
              />
            </div>

            <div style={styles.goalRow}>
              <div style={styles.titleGroup}>
                <img
                  style={styles.eatingIcon}
                  src={require("../../components/images/journal/apple.png")}
                  alt="Apple for servings goal"
                />
                <h2 style={styles.goalLabel}>Chew</h2>
              </div>

              {inputGoalValue === true ? (
                <TextField
                  style={styles.inputBox}
                  label="servings/day"
                  type="number"
                  value={eatingData.length ? eatingData[0].goalValue : ""}
                  onChange={(e) => {
                    updateGoalValue(2, +e.target.value);
                  }}
                />
              ) : (
                <h2>{eatingData.length ? eatingData[0].goalValue : ""}</h2>
              )}

              <TextField
                style={styles.inputBox}
                label="servings/day"
                type="number"
                value={eatingData.length ? eatingData[0].behaviorValue : ""}
                onChange={(e) => {
                  updateBehaviorValue(2, +e.target.value);
                }}
              />
            </div>

            <div style={styles.goalRow}>
              <div style={styles.titleGroup}>
                <img
                  style={styles.sleepIcon}
                  src={require("../../components/images/journal/pillow_icon.png")}
                  alt="Pillow icon for sleep"
                />
                <h2 style={styles.goalLabel}>Sleep</h2>
              </div>

              {inputGoalValue === true ? (
                <TextField
                  style={styles.inputBox}
                  label="hours/day"
                  type="number"
                  value={sleepData.length ? sleepData[0].goalValue : ""}
                  onChange={(e) => {
                    updateGoalValue(3, +e.target.value);
                  }}
                />
              ) : (
                <h2>{sleepData.length ? sleepData[0].goalValue : ""}</h2>
              )}

              <TextField
                style={styles.inputBox}
                label="hours/day"
                type="number"
                value={sleepData.length ? sleepData[0].behaviorValue : ""}
                onChange={(e) => {
                  updateBehaviorValue(3, +e.target.value);
                }}
              />
            </div>
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
                <h4 style={styles.feedback}>
                  {activityData[0].behaviorValue > activityData[0].goalValue
                    ? "Great! I exceeded my goal!"
                    : activityData[0].behaviorValue ===
                      activityData[0].goalValue
                    ? "Hooray! I reached my goal!"
                    : activityData[0].behaviorValue <
                      activityData[0].goalValue / 2
                    ? "I need to work harder to reach my goal!"
                    : activityData[0].behaviorValue < activityData[0].goalValue
                    ? "I'm not too far away from my goal!"
                    : "..."}
                </h4>
              ) : (
                <CircularProgress style={{ margin: "auto" }} />
              )}
              <ReflectionContainer>
                {editingReflectionId === 0 ?                     
                <TextField
                  type="text"
                  placeholder="Type my thoughts"
                  style={{width: "100%"}}
                  value={goalReflection[0]}
                  // value={activityData.length ? activityData[0].reflection : ""}
                  onChange={(e) => {
                    let newArray = [...goalReflection];
                    newArray[0] = e.target.value;
                    setGoalReflection(newArray);
                  }}
                /> 
                : <span style={{width: "auto", margin: "auto"}}>{activityData.length ? activityData[0].reflection : ""}</span>}                    
                <Tooltip title={editingReflectionId === 0 ? "Save Reflection" : "Edit Reflection"} >
                  <EditIcon
                    className="edit-icon"
                    onClick={() => {editingReflectionId === 0 ? setEditingReflectionId(-1) : setEditingReflectionId(0); updateGoalReflection(0, goalReflection)}}
                  />
                </Tooltip>
              </ReflectionContainer>
            </div>

            <div style={styles.goalRow}>
              {screentimeData.length ? (
                <h4 style={styles.feedback}>
                  {screentimeData[0].behaviorValue > screentimeData[0].goalValue
                    ? "Great! I exceeded my goal!"
                    : screentimeData[0].behaviorValue ===
                      screentimeData[0].goalValue
                    ? "Hooray! I reached my goal!"
                    : screentimeData[0].behaviorValue <
                      screentimeData[0].goalValue / 2
                    ? "I need to work harder to reach my goal!"
                    : screentimeData[0].behaviorValue <
                      screentimeData[0].goalValue
                    ? "I'm not too far away from my goal!"
                    : "..."}
                </h4>
              ) : (
                <CircularProgress style={{ margin: "auto" }} />
              )}
              <ReflectionContainer>
                {editingReflectionId === 1 ?
                <TextField
                  type="text"
                  placeholder="Type my thoughts"
                  value={goalReflection[1]}
                  onChange={(e) => updateGoalReflection(1, e.target.value)}
                />
                :
                <span style={{width: "auto", margin: "auto"}}>{screentimeData.length ? screentimeData[0].reflection : ""}</span>
                }
                <Tooltip title="Edit Reflection">
                  <EditIcon
                    className="edit-icon"
                    onClick={() => updateGoalReflection(1, goalReflection)}
                  />
                </Tooltip>
              </ReflectionContainer>
            </div>

            <div style={styles.goalRow}>
              {eatingData.length ? (
                <h4 style={styles.feedback}>
                  {eatingData[0].behaviorValue > eatingData[0].goalValue
                    ? "Great! I exceeded my goal!"
                    : eatingData[0].behaviorValue === eatingData[0].goalValue
                    ? "Hooray! I reached my goal!"
                    : eatingData[0].behaviorValue < eatingData[0].goalValue / 2
                    ? "I need to work harder to reach my goal!"
                    : eatingData[0].behaviorValue < eatingData[0].goalValue
                    ? "I'm not too far away from my goal!"
                    : "..."}
                </h4>
              ) : (
                <CircularProgress style={{ margin: "auto" }} />
              )}
              <ReflectionContainer>
                <TextField
                  type="text"
                  placeholder="Type my thoughts"
                  value={eatingData.length ? eatingData[0].reflection : ""}
                  onChange={(e) => updateGoalReflection(2, e.target.value)}
                />
                <Tooltip title="Edit Reflection">
                  <EditIcon
                    className="edit-icon"
                    onClick={() => updateGoalReflection(2, goalReflection)}
                  />
                </Tooltip>
              </ReflectionContainer>
            </div>

            <div style={styles.goalRow}>
              {sleepData.length ? (
                <h4 style={styles.feedback}>
                  {sleepData[0].behaviorValue > sleepData[0].goalValue
                    ? "Great! I exceeded my goal!"
                    : sleepData[0].behaviorValue === sleepData[0].goalValue
                    ? "Hooray! I reached my goal!"
                    : sleepData[0].behaviorValue < sleepData[0].goalValue / 2
                    ? "I need to work harder to reach my goal!"
                    : sleepData[0].behaviorValue < sleepData[0].goalValue
                    ? "I'm not too far away from my goal!"
                    : "..."}
                </h4>
              ) : (
                <CircularProgress style={{ margin: "auto" }} />
              )}
              <ReflectionContainer>
                <TextField
                  type="text"
                  placeholder="Type my thoughts"
                  value={sleepData.length ? sleepData[0].reflection : ""}
                  onChange={(e) => updateGoalReflection(3, e.target.value)}
                />
                <Tooltip title="Edit Reflection">
                  <EditIcon
                    className="edit-icon"
                    onClick={() => updateGoalReflection(3, goalReflection)}
                  />
                </Tooltip>
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
      </div>
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
    width: "10%",
    justifyContent: "space-between",
    alignItems: "center",
  },
  feedback: {
    width: "35%",
    color: "blue",
    marginLeft: "auto",
  },
};
