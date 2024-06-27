import React, { useState, useEffect } from "react";
import "css/journal.css";
import withAuth from "components/auth/withAuth";
import DurationPicker from "components/journal/durationPicker";
import axios from "axios";
import {
  TextField,
  Tooltip,
  Button,
  CircularProgress,
  FormControl,
  MenuItem,
  InputLabel,
  Select,
} from "@mui/material";
import styled from "styled-components";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import EditIcon from "@mui/icons-material/Edit";
import LockIcon from "@mui/icons-material/Lock";
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
  width: 90%;
  margin: auto;
  font-family: Montserrat;

  .information-text {
    font-size: 14px;
  }

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
  margin: 0 auto;

  .lock-icon {
    &:hover {
      color: #800000;
    }
  }

  @media (max-width: 1190px) {
    width: 90%;
    font-size: 14px;
    flex-direction: column; /* Switch to a vertical layout */
  }

  @media (max-width: 768px) {
    width: 100%;
    font-size: 14px;
    flex-direction: column; /* Switch to a vertical layout */
  }

  @media (max-width: 480px) {
    width: 100%;
    font-size: 12px;
    flex-direction: column; /* Switch to a vertical layout */
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
  width: 55%;
  margin-left: -5%;

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

const SelectedActivity = styled.div`
  margin-top: 20px;
  font-size: 18px;
  font-weight: bold;
  text-align: center;
`;

const JournalScreen = () => {
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

  const ismobile = useMediaQuery({ query: "(max-width: 800px)" });
  const istablet = useMediaQuery({ query: "(max-width: 1200px)" });

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

  const activities = [
    {
      category: "STRENUOUS EXERCISE – HEART BEATS RAPIDLY",
      items: [
        "running",
        "jogging",
        "hockey",
        "football",
        "soccer",
        "squash",
        "basketball",
        "judo",
        "roller skating",
        "vigorous swimming",
        "vigorous long distance bicycling",
      ],
    },
    {
      category: "MODERATE EXERCISE – NOT EXHAUSTING",
      items: [
        "fast walking",
        "baseball",
        "tennis",
        "easy bicycling",
        "volleyball",
        "badminton",
        "easy swimming",
        "dancing",
      ],
    },
    {
      category: "MILD EXERCISE – MINIMAL EFFORT",
      items: [
        "yoga",
        "archery",
        "fishing from riverbank",
        "bowling",
        "horseshoes",
        "golf",
        "easy walking",
      ],
    },
  ];

  const screentimeActivities = [
    {
      category: "Gaming and Video Chatting",
      items: [
        "looking at photos",
        "video chatting",
        "laptops",
        "video games ",
        "tablets",
        "phones",
        "other",
      ],
    },
    {
      category: "Academic screen time",
      items: ["online learning", "online homework/research", "other"],
    },
  ];

  const fruits = ["Apple", "Banana", "Orange", "Grapes", "Berries"];
  const vegetables = ["Carrots", "Broccoli", "Spinach", "Peppers", "Tomatoes"];

  const [selectedActivities, setSelectedActivities] = useState([]);
  const [selectedScreentimeActivities, setSelectedScreentimeActivities] =
    useState([]);
  const [totalTime, setTotalTime] = useState({ hours: 0, minutes: 0 });
  const [totalScreentime, setTotalScreentime] = useState({ hours: 0, minutes: 0 });

  const [activityCategory, setActivityCategory] = useState("");
  const [screentimeCategory, setScreentimeCategory] = useState("");
  const [selectedActivity, setSelectedActivity] = useState("");
  const [selectedScreentimeActivity, setSelectedScreentimeActivity] =
    useState("");

  const [selectedFruit, setSelectedFruit] = useState("");
  const [selectedVegetable, setSelectedVegetable] = useState("");
  const [fruitServings, setFruitServings] = useState(0);
  const [vegetableServings, setVegetableServings] = useState(0);
  const [selectedFruitsAndVegetables, setSelectedFruitsAndVegetables] = useState([]);

  const handleActivityChange = (event) => {
    const value = event.target.value;
    if (activities.some((group) => group.category === value)) {
      setActivityCategory(value);
      setSelectedActivity("");
    } else {
      setSelectedActivity(value);
    }
  };

  const handleScreentimeChange = (event) => {
    const value = event.target.value;
    if (screentimeActivities.some((group) => group.category === value)) {
      setScreentimeCategory(value);
      setSelectedScreentimeActivity("");
    } else {
      setSelectedScreentimeActivity(value);
    }
  };

  const handleFruitChange = (event) => {
    setSelectedFruit(event.target.value);
  };

  const handleVegetableChange = (event) => {
    setSelectedVegetable(event.target.value);
  };

  const handleFruitServingsChange = (event) => {
    setFruitServings(event.target.value);
  };

  const handleVegetableServingsChange = (event) => {
    setVegetableServings(event.target.value);
  };

  const handleAddActivity = () => {
    if (selectedActivity && selectedActivities.length < 3) {
      setSelectedActivities([
        ...selectedActivities,
        { activity: selectedActivity, time: totalTime },
      ]);
      setActivityCategory("");
      setSelectedActivity("");
      setTotalTime({ hours: 0, minutes: 0 });
    }
  };

  const handleAddScreentimeActivity = () => {
    if (selectedScreentimeActivity && selectedScreentimeActivities.length < 3) {
      setSelectedScreentimeActivities([
        ...selectedScreentimeActivities,
        { activity: selectedScreentimeActivity, time: totalScreentime },
      ]);
      setScreentimeCategory("");
      setSelectedScreentimeActivity("");
      setTotalScreentime({ hours: 0, minutes: 0 });
    }
  };

  const handleAddFruitOrVegetable = () => {
    if (
      (selectedFruit || selectedVegetable) &&
      selectedFruitsAndVegetables.length < 3
    ) {
      const item = selectedFruit
        ? { type: "fruit", name: selectedFruit, servings: fruitServings }
        : { type: "vegetable", name: selectedVegetable, servings: vegetableServings };
      setSelectedFruitsAndVegetables([...selectedFruitsAndVegetables, item]);
      setSelectedFruit("");
      setSelectedVegetable("");
      setFruitServings(0);
      setVegetableServings(0);
    }
  };

  const handleTotalTimeChange = (event) => {
    const { name, value } = event.target;
    setTotalTime((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleTotalScreentimeChange = (event) => {
    const { name, value } = event.target;
    setTotalScreentime((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleBedTimeChange = (event) => {
    const { name, value } = event.target;
    setSleepGoal((prevSleepGoal) => {
      const updatedSleepGoal = prevSleepGoal.map((goal) => {
        const newSleepGoal = {
          ...goal,
          [name]: value,
        };
        return newSleepGoal;
      });
      return updatedSleepGoal;
    });
  };

  const calculateSleepHours = (bedTime, wakeUpTime) => {
    const [bedHour, bedMinute] = bedTime.split(':').map(Number);
    const [wakeHour, wakeMinute] = wakeUpTime.split(':').map(Number);

    const bedDate = new Date();
    bedDate.setHours(bedHour, bedMinute);

    const wakeDate = new Date();
    wakeDate.setHours(wakeHour, wakeMinute);

    // Handle cases where wake-up time is after midnight
    if (wakeDate < bedDate) {
      wakeDate.setDate(wakeDate.getDate() + 1);
    }

    const sleepDuration = (wakeDate - bedDate) / (1000 * 60 * 60); // Convert ms to hours
    return sleepDuration;
  };

  const getSelectedActivitiesText = () => {
    return selectedActivities
      .map((activity) => `${activity.activity} (${activity.time.hours}h ${activity.time.minutes}m)`)
      .join(", ");
  };

  const getSelectedScreentimeActivitiesText = () => {
    return selectedScreentimeActivities
      .map((activity) => `${activity.activity} (${activity.time.hours}h ${activity.time.minutes}m)`)
      .join(", ");
  };

  const getSelectedFruitsAndVegetablesText = () => {
    return selectedFruitsAndVegetables
      .map((item) => `${item.name} (${item.servings} servings)`)
      .join(", ");
  };

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

      <SelectedActivity>
        Selected Activities: {getSelectedActivitiesText()}
      </SelectedActivity>
      <SelectedActivity>
        Selected Screentime Activities: {getSelectedScreentimeActivitiesText()}
      </SelectedActivity>
      <SelectedActivity>
        Selected Fruits and Vegetables: {getSelectedFruitsAndVegetablesText()}
      </SelectedActivity>

      <JournalWrapper>
        <div
          style={{
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
              position: "absolute",
            }}
          >
            <div
              className="leftPageWrapper"
              style={{ width: ismobile ? "50%" : "auto" }}
            >
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
                    <FormControl fullWidth style={{ maxWidth: "300px" }}>
                      <InputLabel id="activity-label">Select Phyiscal Activity</InputLabel>
                      <Select
                        labelId="activity-label"
                        id="activity"
                        value={activityCategory || selectedActivity}
                        onChange={handleActivityChange}
                      >
                        {!activityCategory &&
                          activities.map((group) => (
                            <MenuItem key={group.category} value={group.category}>
                              {group.category}
                            </MenuItem>
                          ))}
                        {activityCategory &&
                          activities
                            .find((group) => group.category === activityCategory)
                            .items.map((activity) => (
                              <MenuItem key={activity} value={activity}>
                                {activity}
                              </MenuItem>
                            ))}
                      </Select>
                    </FormControl>
                    {selectedActivity && (
                      <>
                        <h3 style={{ fontSize: "14px" }}>Total Time</h3>
                        <TextField
                          label="Hours"
                          type="number"
                          name="hours"
                          value={totalTime.hours}
                          onChange={handleTotalTimeChange}
                          inputProps={{ min: 0 }}
                          style={{
                            marginRight: "10px",
                            width: "80px",
                            fontSize: "12px",
                          }}
                        />
                        <TextField
                          label="Minutes"
                          type="number"
                          name="minutes"
                          value={totalTime.minutes}
                          onChange={handleTotalTimeChange}
                          inputProps={{ min: 0, max: 59 }}
                          style={{ width: "80px", fontSize: "12px" }}
                        />
                        <Button
                          onClick={handleAddActivity}
                          style={{ marginTop: "10px" }}
                        >
                          Add Activity
                        </Button>
                      </>
                    )}
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
                      className="information-text"
                    >
                      &nbsp;Recommended: 60 minutes/day
                    </strong>
                    <div
                      style={{
                        width: "70%",
                      }}
                      className="information-text"
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
                    <FormControl fullWidth style={{ maxWidth: "300px" }}>
                      <InputLabel id="screentime-label"> Select Type </InputLabel>
                      <Select
                        labelId="screentime-label"
                        id="screentime"
                        value={screentimeCategory || selectedScreentimeActivity}
                        onChange={handleScreentimeChange}
                      >
                        {!screentimeCategory &&
                          screentimeActivities.map((group) => (
                            <MenuItem key={group.category} value={group.category}>
                              {group.category}
                            </MenuItem>
                          ))}
                        {screentimeCategory &&
                          screentimeActivities
                            .find((group) => group.category === screentimeCategory)
                            .items.map((activity) => (
                              <MenuItem key={activity} value={activity}>
                                {activity}
                              </MenuItem>
                            ))}
                      </Select>
                    </FormControl>
                    {selectedScreentimeActivity && (
                      <>
                        <h3 style={{ fontSize: "14px" }}>Total Time</h3>
                        <TextField
                          label="Hours"
                          type="number"
                          name="hours"
                          value={totalScreentime.hours}
                          onChange={handleTotalScreentimeChange}
                          inputProps={{ min: 0 }}
                          style={{
                            marginRight: "10px",
                            width: "80px",
                            fontSize: "12px",
                          }}
                        />
                        <TextField
                          label="Minutes"
                          type="number"
                          name="minutes"
                          value={totalScreentime.minutes}
                          onChange={handleTotalScreentimeChange}
                          inputProps={{ min: 0, max: 59 }}
                          style={{ width: "80px", fontSize: "12px" }}
                        />
                        <Button
                          onClick={handleAddScreentimeActivity}
                          style={{ marginTop: "20px" }}
                        >
                          Add Activity
                        </Button>
                      </>
                    )}
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
                      className="information-text"
                    >
                      &nbsp;Recommended: 120 minutes/day
                    </strong>
                    <div
                      style={{
                        width: "70%",
                      }}
                      className="information-text"
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
                  <td style={{ width: "50%" }}>
                    <FormControl fullWidth style={{ maxWidth: "300px" }}>
                      <InputLabel id="food-category-label">Select Fruit/Veg</InputLabel>
                      <Select
                        labelId="food-category-label"
                        id="food-category"
                        value={selectedFruit || selectedVegetable}
                        onChange={(event) => {
                          const value = event.target.value;
                          if (fruits.includes(value)) {
                            setSelectedFruit(value);
                            setSelectedVegetable("");
                          } else {
                            setSelectedVegetable(value);
                            setSelectedFruit("");
                          }
                        }}
                      >
                        <MenuItem value="" disabled>
                          Select Fruit or Vegetable
                        </MenuItem>
                        {fruits.map((fruit) => (
                          <MenuItem key={fruit} value={fruit}>
                            {fruit}
                          </MenuItem>
                        ))}
                        {vegetables.map((vegetable) => (
                          <MenuItem key={vegetable} value={vegetable}>
                            {vegetable}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    {(selectedFruit || selectedVegetable) && (
                      <>
                        <TextField
                          label="Servings"
                          type="number"
                          value={
                            selectedFruit ? fruitServings : vegetableServings
                          }
                          onChange={
                            selectedFruit
                              ? handleFruitServingsChange
                              : handleVegetableServingsChange
                          }
                          inputProps={{ min: 0 }}
                          style={{ width: "80px", marginTop: "20px" }}
                        />
                        <Button
                          onClick={handleAddFruitOrVegetable}
                          style={{ marginTop: "10px" }}
                        >
                          Add Fruit/Vegetable
                        </Button>
                      </>
                    )}
                  </td>
                  <td style={{ width: "50%" }}>
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
                        label="Total servings/day"
                        type="number"
                        value={selectedFruitsAndVegetables.reduce(
                          (total, item) => total + parseInt(item.servings),
                          0
                        )}
                        onChange={() => {}}
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
                      className="information-text"
                    >
                      &nbsp;Recommended: 5 servings/day
                    </strong>
                    <div
                      style={{
                        width: "70%",
                      }}
                      className="information-text"
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
                    <TextField
                      label="Went to Bed At"
                      type="time"
                      name="bedTime"
                      value={sleepGoal[0].bedTime || ""}
                      onChange={handleBedTimeChange}
                      style={{ width: "140px", fontSize: "16px" }}
                    />
                  </td>

                  <td style={{ width: "50%" }}>
                    <TextField
                      label="Woke Up At"
                      type="time"
                      name="wakeUpTime"
                      value={sleepGoal[0].wakeUpTime || ""}
                      onChange={handleBedTimeChange}
                      style={{ width: "140px", fontSize: "16px" }}
                    />
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
                      className="information-text"
                    >
                      &nbsp;Recommended: 9 hours/day
                    </strong>
                    <div
                      style={{
                        width: "70%",
                      }}
                      className="information-text"
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
            </div>
            <div className="rightPageWrapper">
              <img
                className="bookmark"
                src={require("../../components/images/journal/journal_binding.png")}
                alt="Journal spine icon"
              />
              <div style={styles.rightGoalScreen}>
                <GoalContainer style={styles.goalRow}>
                  <th style={styles.goalHeader}>Reflect</th>
                  <th style={styles.goalHeader}>AI-Generated Feedback</th>
                </GoalContainer>

                <GoalContainer style={styles.goalRow}>
                  <ReflectionContainer style={styles.goalRow}>
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
                    </Tooltip>
                  </ReflectionContainer>
                  <td style={{ width: "50%", maxHeight: 101 }}>
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
                </GoalContainer>

                <GoalContainer>
                  <BehaviorInfoText>
                    <div style={{ width: "100%" }} className="information-text">
                      <strong>How to Achieve:</strong> Exercise (run, play
                      sports, lift weights) at a local gym, park, or at home, do
                      chores, or just perform light movements.
                    </div>
                  </BehaviorInfoText>
                </GoalContainer>

                <GoalContainer style={styles.goalRow}>
                  <ReflectionContainer style={styles.goalRow}>
                    <TextField
                      type="text"
                      placeholder="Type my thoughts"
                      multiline
                      rows={screentimeGoal[0].reflection.length > 25 ? 2 : 1}
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
                            user,
                            screentimeGoal[0].goalValue,
                            screentimeGoal[0].behaviorValue,
                            screentimeGoal[0].reflection,
                            setScreentimeGoal,
                            screentimeGoal,
                            screentimeData,
                            "screentime",
                            date,
                            120
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
                  <td style={{ width: "50%", maxHeight: 101 }}>
                    {screentimeResponseLoading ? (
                      <CircularProgress />
                    ) : !screentimeGoal[0].feedback ? (
                      <div>Please save for feedback!</div>
                    ) : screentimeData.length ? (
                      <ExpandableText
                        text={screentimeGoal[0].feedback}
                        maxLines={MAX_FEEDBACK_LINES}
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
                </GoalContainer>

                <GoalContainer>
                  <BehaviorInfoText>
                    <div style={{ width: "100%" }} className="information-text">
                      <strong>How to Achieve:</strong> Put devices away, try
                      screen-time control apps, and make plans to go outside and
                      do activities with friends or family!
                    </div>
                  </BehaviorInfoText>
                </GoalContainer>

                <GoalContainer style={styles.goalRow}>
                  <ReflectionContainer style={styles.goalRow}>
                    <TextField
                      type="text"
                      placeholder="Type my thoughts"
                      multiline
                      rows={eatingGoal[0].reflection.length > 25 ? 2 : 1}
                      style={{ width: "80%" }}
                      value={eatingGoal[0].reflection}
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
                            user,
                            eatingGoal[0].goalValue,
                            eatingGoal[0].behaviorValue,
                            eatingGoal[0].reflection,
                            setEatingGoal,
                            eatingGoal,
                            eatingData,
                            "eating",
                            date,
                            5
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
                  <td style={{ width: "50%", maxHeight: 101 }}>
                    {eatingResponseLoading ? (
                      <CircularProgress />
                    ) : !eatingGoal[0].feedback ? (
                      <div>Please save for feedback!</div>
                    ) : eatingData.length ? (
                      <ExpandableText
                        text={eatingGoal[0].feedback}
                        maxLines={MAX_FEEDBACK_LINES}
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
                </GoalContainer>

                <GoalContainer>
                  <BehaviorInfoText>
                    <div style={{ width: "100%" }} className="information-text">
                      <strong>How to Achieve:</strong> Substitute healthy food
                      options (fruit, vegetables) instead of unhealthy foods.
                      Also, try to cook meals using healthy ingredients, and
                      note if eating certain foods (e.g. apples, broccoli, etc.)
                      helps!
                    </div>
                  </BehaviorInfoText>
                </GoalContainer>

                <GoalContainer style={styles.goalRow}>
                  <ReflectionContainer style={styles.goalRow}>
                    <TextField
                      type="text"
                      placeholder="Type my thoughts"
                      multiline
                      rows={sleepGoal[0].reflection.length > 25 ? 2 : 1}
                      style={{ width: "80%" }}
                      value={sleepGoal[0].reflection}
                      onChange={(e) => {
                        setSleepGoal((prevSleepGoal) => {
                          const updatedSleepGoal = prevSleepGoal.map((goal) => {
                            const newSleepReflection = {
                              ...goal,
                              reflection: e.target.value,
                            };
                            return newSleepReflection;
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
                            user,
                            sleepGoal[0].goalValue,
                            sleepGoal[0].behaviorValue,
                            sleepGoal[0].reflection,
                            setSleepGoal,
                            sleepGoal,
                            sleepData,
                            "sleep",
                            date,
                            9
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
                  <td style={{ width: "50%", maxHeight: 101 }}>
                    {sleepResponseLoading ? (
                      <CircularProgress />
                    ) : !sleepGoal[0].feedback ? (
                      <div>Please save for feedback!</div>
                    ) : sleepData.length ? (
                      <ExpandableText
                        text={sleepGoal[0].feedback}
                        maxLines={MAX_FEEDBACK_LINES}
                      />
                    ) : (
                      <Tooltip title="Set a Sleep goal today to see feedback!">
                        <LockIcon
                          style={{ margin: "auto", width: "30%" }}
                          className="lock-icon"
                        />
                      </Tooltip>
                    )}
                  </td>
                </GoalContainer>

                <GoalContainer>
                  <BehaviorInfoText>
                    <div style={{ width: "100%" }} className="information-text">
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
    fontSize: 18,
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
