import React, { useState, useEffect, useRef } from "react";
import "css/journal.css";
import withAuth from "components/auth/withAuth";
import DurationPicker from "components/journal/durationPicker";
import axios from "axios";

import { TextField, Tooltip, Button, CircularProgress, Dialog, DialogTitle, DialogContent, DialogActions, Checkbox, FormControlLabel, Grid } from "@mui/material";
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

const BehaviorInfoText = styled.div`
  display: flex;
  align-items: center;
  margin-top: 1%;
`;

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
    flex-direction: column;
  }

  @media (max-width: 768px) {
    width: 100%;
    font-size: 14px;
    flex-direction: column;
  }

  @media (max-width: 480px) {
    width: 100%;
    font-size: 12px;
    flex-direction: column;
  }
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

const StyledButton = styled(Button)`
  background-color: #6a1b9a !important;
  color: white !important;
  font-weight: bold !important;
  transition: all 0.3s ease-in-out !important;

  &:hover {
    background-color: #4a148c !important;
    transform: scale(1.05) !important;
  }
`;

const JournalScreen = () => {
  const [customActivity, setCustomActivity] = useState("");
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

  const bedTimeGoalRef = useRef(null);
  const wakeUpTimeGoalRef = useRef(null);
  const bedTimeActualRef = useRef(null);
  const wakeUpTimeActualRef = useRef(null);

  const ismobile = useMediaQuery({ query: "(max-width: 800px)" });
  const istablet = useMediaQuery({ query: "(max-width: 1200px)" });

  const [user, setUser] = useState([]);
  const [goalData, setGoalData] = useState([]);
  const [loggedActivityToday, setLoggedActivityToday] = useState(false);
  const [loggedScreentimeToday, setLoggedScreentimeToday] = useState(false);
  const [loggedEatingToday, setLoggedEatingToday] = useState(false);
  const [loggedSleepToday, setLoggedSleepToday] = useState(false);
  const [editingBehaviorId, setEditingBehaviorId] = useState(-1);

  const [customBedTime, setCustomBedTime] = useState("");
  const [customWakeTime, setCustomWakeTime] = useState("");

  const [popupOpen, setPopupOpen] = useState({
    activity: false,
    screentime: false,
    eating: false,
    sleep: false,
  });

  const [selectedItems, setSelectedItems] = useState({
    activity: [],
    screentime: [],
    eating: [],
    sleep: [],
  });

  const [goalInputs, setGoalInputs] = useState({
    activity: {},
    screentime: {},
    eating: {},
    sleep: {},
  });

  const [behaviorInputs, setBehaviorInputs] = useState({
    activity: {},
    screentime: {},
    eating: {},
    sleep: {},
  });

  const [totalTrackedTime, setTotalTrackedTime] = useState({
    activity: 0,
    screentime: 0,
    eating: 0,
    sleep: 0,
  });

  const [totalExpectedTime, setTotalExpectedTime] = useState({
    activity: 0,
    screentime: 0,
    eating: 0,
    sleep: 0,
  });

  var dateToday = new Date(),
    month = dateToday.getMonth(),
    day = dateToday.getDate(),
    year = dateToday.getFullYear(),
    date = month + 1 + "/" + day + "/" + year;

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

  const [activityData, setActivityData] = useState({});
  const [screentimeData, setScreentimeData] = useState({});
  const [eatingData, setEatingData] = useState({});
  const [sleepData, setSleepData] = useState({});
  useEffect(() => {
    if (user.length && goalData.length) {
      createChatbotRequest(
        activityGoal,
        setActivityGoal,
        user,
        new Date().toLocaleDateString(),
        setActivityResponseLoading,
        selectedItems,
        goalInputs,
        behaviorInputs,
        totalExpectedTime,
        totalTrackedTime
      );

      createChatbotRequest(
        screentimeGoal,
        setScreentimeGoal,
        user,
        new Date().toLocaleDateString(),
        setScreentimeResponseLoading,
        selectedItems,
        goalInputs,
        behaviorInputs,
        totalExpectedTime,
        totalTrackedTime
      );
      console.log("Selected Items (before request): ", selectedItems);
      console.log("Goal Inputs (before request): ", goalInputs);
      console.log("Behavior Inputs (before request): ", behaviorInputs);

      createChatbotRequest(
        eatingGoal,
        setEatingGoal,
        user,
        new Date().toLocaleDateString(),
        setEatingResponseLoading,
        selectedItems,
        goalInputs,
        behaviorInputs,
        totalExpectedTime,
        totalTrackedTime
      );

      createChatbotRequest(
        sleepGoal,
        setSleepGoal,
        user,
        new Date().toLocaleDateString(),
        setSleepResponseLoading,
        selectedItems,
        goalInputs,
        behaviorInputs,
        totalExpectedTime,
        totalTrackedTime
      );
    }
  }, [user, goalData, selectedItems, goalInputs, behaviorInputs, totalExpectedTime, totalTrackedTime]);

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

  const handleOpenPopup = (section) => {
    setPopupOpen((prev) => ({ ...prev, [section]: true }));
  };

  const handleClosePopup = (section) => {
    setPopupOpen((prev) => ({ ...prev, [section]: false }));
  };

  const handleCheckboxChange = (event, section) => {
    const { name, checked } = event.target;

    setSelectedItems((prev) => {
      const updated = {
        ...prev,
        [section]: checked
          ? [...prev[section], name]
          : prev[section].filter((item) => item !== name),
      };

      if (!checked) {
        const goalHours = parseInt(goalInputs[section][name]?.hours || 0);
        const goalMinutes = parseInt(goalInputs[section][name]?.minutes || 0);
        const trackedHours = parseInt(behaviorInputs[section][name]?.hours || 0);
        const trackedMinutes = parseInt(behaviorInputs[section][name]?.minutes || 0);

        const totalGoalTimeToSubtract = goalHours * 60 + goalMinutes;
        const totalTrackedTimeToSubtract = trackedHours * 60 + trackedMinutes;

        setTotalExpectedTime((prev) => ({
          ...prev,
          [section]: Math.max(prev[section] - totalGoalTimeToSubtract, 0),
        }));

        setTotalTrackedTime((prev) => ({
          ...prev,
          [section]: Math.max(prev[section] - totalTrackedTimeToSubtract, 0),
        }));

        setGoalInputs((prev) => ({
          ...prev,
          [section]: {
            ...prev[section],
            [name]: {
              hours: 0,
              minutes: 0,
            },
          },
        }));
        setBehaviorInputs((prev) => ({
          ...prev,
          [section]: {
            ...prev[section],
            [name]: {
              hours: 0,
              minutes: 0,
            },
          },
        }));
      }

      return updated;
    });
  };

  const handleInputChange = (event, name, type, inputType, section) => {
    const { value } = event.target;

    const inputs = inputType === "goal" ? goalInputs[section] : behaviorInputs[section];
    const updatedInputs = {
      ...inputs,
      [name]: {
        ...inputs[name],
        [type]: value,
      },
    };

    if (inputType === "goal") {
      setGoalInputs((prev) => ({
        ...prev,
        [section]: updatedInputs,
      }));
    } else {
      setBehaviorInputs((prev) => ({
        ...prev,
        [section]: updatedInputs,
      }));
    }
    // calculate sleep duration
    if (section === "sleep") {
      calculateSleepDuration(updatedInputs, inputType);
    } else {
      calculateTotal(updatedInputs, inputType, section);
    }
  };
  // Calculate the total time/servings
  const calculateTotal = (inputs, inputType, section) => {
    let total = 0;
    if (section === "eating") {
      total = Object.values(inputs).reduce(
        (acc, curr) => acc + parseInt(curr.servings || 0),
        0
      );
    } else {
      total = Object.values(inputs).reduce(
        (acc, curr) =>
          acc + (parseInt(curr.hours || 0) * 60 + parseInt(curr.minutes || 0)),
        0
      );
    }

    if (inputType === "goal") {
      setTotalExpectedTime((prev) => ({
        ...prev,
        [section]: total,
      }));
    } else {
      setTotalTrackedTime((prev) => ({
        ...prev,
        [section]: total,
      }));
    }
  };

  const calculateSleepDuration = (inputs, inputType) => {
    const bedTime = inputs[inputType === "goal" ? "Expected Sleep" : "Actual Sleep"]?.bedTime || "";
    const wakeUpTime = inputs[inputType === "goal" ? "Expected Sleep" : "Actual Sleep"]?.wakeUpTime || "";

    if (bedTime && wakeUpTime) {
      const totalMinutes = getSleepDurationInMinutes(bedTime, wakeUpTime);

      if (inputType === "goal") {
        setTotalExpectedTime((prev) => ({
          ...prev,
          sleep: totalMinutes,
        }));
      } else {
        setTotalTrackedTime((prev) => ({
          ...prev,
          sleep: totalMinutes,
        }));
      }
    } else {
      console.log("Missing bedTime or wakeUpTime for sleep duration calculation.");
    }
  };
  const getSleepDurationInMinutes = (bedTime, wakeUpTime) => {
    const [bedHour, bedMinute] = bedTime.split(":").map(Number);
    const [wakeHour, wakeMinute] = wakeUpTime.split(":").map(Number);

    let totalMinutes = (wakeHour * 60 + wakeMinute) - (bedHour * 60 + bedMinute);
    if (totalMinutes < 0) {
      totalMinutes += 24 * 60;
    }

    return totalMinutes;
  };
  const [popupClosed, setPopupClosed] = useState(false);
  const [readyToRequest, setReadyToRequest] = useState(false);

  const handleDone = (section) => {
    setPopupOpen((prev) => ({ ...prev, [section]: false }));
  };
  useEffect(() => {
    console.log("Selected Items:", selectedItems);
    console.log("Goal Inputs:", goalInputs);
    console.log("Behavior Inputs:", behaviorInputs);
  }, [selectedItems, goalInputs, behaviorInputs]);

  useEffect(() => {
    if (readyToRequest) {
      console.log("Final Selected Items:", selectedItems);
      console.log("Final Goal Inputs:", goalInputs);
      console.log("Final Behavior Inputs:", behaviorInputs);
      //triggers chatbox
      if (user.length && goalData.length) {
        createChatbotRequest(
          eatingGoal,
          setEatingGoal,
          user,
          new Date().toLocaleDateString(),
          setEatingResponseLoading,
          selectedItems,
          goalInputs,
          behaviorInputs,
          totalExpectedTime,
          totalTrackedTime
        );

        createChatbotRequest(
          sleepGoal,
          setSleepGoal,
          user,
          new Date().toLocaleDateString(),
          setSleepResponseLoading,
          selectedItems,
          goalInputs,
          behaviorInputs,
          totalExpectedTime,
          totalTrackedTime
        );
      }
      setReadyToRequest(false);
    }
  }, [readyToRequest, selectedItems, goalInputs, behaviorInputs, user, goalData, eatingGoal, sleepGoal, totalExpectedTime, totalTrackedTime]);

  const handleSave = (goalType, goal, setGoal, goalData, setResponseLoading) => {
    // Update the behavior value and trigger the AI request
    updateBehaviorValue(
      user,
      goal[0].goalValue,
      goal[0].behaviorValue,
      goal[0].reflection,
      setGoal,
      goal,
      goalData,
      goalType,
      date,
      goal[0].recommendedValue
    );

    // Trigger chatbot AI request with the current goal and tracked inputs
    createChatbotRequest(
      goal,
      setGoal,
      user,
      date,
      setResponseLoading,
      selectedItems,
      goalInputs,
      behaviorInputs,
      totalExpectedTime,
      totalTrackedTime
    );
  };




  const physicalActivities = [
    {
      category: "Strenuous Exercise",
      items: [
        "Running",
        "Jogging",
        "Hockey",
        "Football",
        "Soccer",
        "Squash",
        "Basketball",
        "Judo",
        "Roller Skating",
        "Vigorous Swimming",
        "Vigorous Long-Distance Bicycling",
      ],
    },
    {
      category: "Moderate Exercise",
      items: [
        "Fast Walking",
        "Baseball",
        "Tennis",
        "Easy Bicycling",
        "Volleyball",
        "Badminton",
        "Easy Swimming",
        "Popular and Folk Dancing",
      ],
    },
    {
      category: "Mild Exercise",
      items: [
        "Yoga",
        "Archery",
        "Fishing from Riverbank",
        "Bowling",
        "Horseshoes",
        "Golf",
        "Easy Walking",
      ],
    },
  ];

  const [customActivityInput, setCustomActivityInput] = useState({
    activity: "",
    screentime: "",
    eating: { fruit: "", vegetable: "" },
  });


  const [otherChecked, setOtherChecked] = useState({
    activity: false,
    screentime: false,
    eating: false,
    fruit: false,
    vegetable: false,
  });

  const handleOtherCheckboxChange = (event, section) => {
    const { checked } = event.target;
    setOtherChecked((prev) => ({
      ...prev,
      [section]: checked,
    }));
  };

  const handleCustomActivityChange = (e, section) => {
    const { value } = e.target;
    setCustomActivityInput((prev) => ({
      ...prev,
      [section]: value,
    }));
  };


  const handleAddCustomActivity = (section) => {
    if (section === "eating") {
      if (customActivityInput.eating.fruit) {
        setSelectedItems((prev) => ({
          ...prev,
          [section]: [...prev[section], customActivityInput.eating.fruit],
        }));
      }
      if (customActivityInput.eating.vegetable) {
        setSelectedItems((prev) => ({
          ...prev,
          [section]: [...prev[section], customActivityInput.eating.vegetable],
        }));
      }
      setCustomActivityInput((prev) => ({
        ...prev,
        [section]: { fruit: "", vegetable: "" },
      }));
      setOtherChecked((prev) => ({
        ...prev,
        [section]: false,
      }));
    } else {
      if (customActivityInput[section]) {
        setSelectedItems((prev) => ({
          ...prev,
          [section]: [...prev[section], customActivityInput[section]],
        }));
        setCustomActivityInput((prev) => ({
          ...prev,
          [section]: "",
        }));
        setOtherChecked((prev) => ({
          ...prev,
          [section]: false,
        }));
      }
    }
  };


  const screentimeActivities = [
    {
      category: "Gaming and Video Chatting",
      items: [
        "Playing Games",
        "Looking at Photos",
        "Video Chatting",
        "Other Gaming",
      ],
    },
    {
      category: "Academic Screen Time",
      items: ["Online Learning", "Homework", "Other Academic Work"],
    },
  ];

  const fruitsAndVegetables = [
    {
      category: "Fruits",
      items: ["Apples", "Bananas", "Oranges"],
    },
    {
      category: "Vegetables",
      items: ["Carrots", "Broccoli", "Spinach"],
    },
  ];


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
                </GoalContainer>

                <GoalContainer style={styles.goalRow}>
                  <td style={styles.titleGroup}>
                    <img
                      style={styles.icon}
                      src={require("../../components/images/journal/activity_goals.png")}
                      alt="Activity goals icon on activity goals page"
                    />
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
                      <h2 style={styles.goalLabel}>Physical Activity</h2>
                      <p style={{ fontSize: "16px", color: "#555", fontWeight: "bold" }}>Recommended: 60 minutes/day</p>
                    </div>
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
                      <StyledButton
                        variant="contained"
                        onClick={() => handleOpenPopup("activity")}
                      >
                        Set and Track
                      </StyledButton>
                    </Tooltip>

                    {/* Tracking under the buttons*/}
                    {selectedItems.activity.length > 0 && (
                      <div style={{ marginTop: "10px", color: "#333", fontSize: "14px" }}>
                        <strong>Selected: </strong>
                        {selectedItems.activity.map((item, index) => (
                          <span key={item}>
                            {item}: {goalInputs.activity[item]?.hours || 0}h {goalInputs.activity[item]?.minutes || 0}m /
                            Tracked: {behaviorInputs.activity[item]?.hours || 0}h {behaviorInputs.activity[item]?.minutes || 0}m
                            {index < selectedItems.activity.length - 1 && ", "}
                          </span>
                        ))}
                      </div>
                    )}
                  </td>
                </GoalContainer>



                <GoalContainer style={styles.goalRow}>
                  <td style={styles.titleGroup}>
                    <img
                      style={styles.icon}
                      src={require("../../components/images/journal/tablet_icon.png")}
                      alt="Tablet for screentime goals"
                    />
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
                      <h2 style={styles.goalLabel}>Screen Time</h2>
                      <p style={{ fontSize: "16px", color: "#555", fontWeight: "bold" }}>Recommended: 120 minutes/day</p>
                    </div>
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
                    <Tooltip title={loggedScreentimeToday && editingBehaviorId !== 1 ? "You've already logged this goal today!" : ""}>
                      <StyledButton variant="contained" onClick={() => handleOpenPopup("screentime")}>
                        Set and Track
                      </StyledButton>
                    </Tooltip>
                    {selectedItems.screentime.length > 0 && (
                      <div style={{ marginTop: "10px", color: "#333", fontSize: "14px" }}>
                        <strong>Selected: </strong>
                        {selectedItems.screentime.map((item, index) => (
                          <span key={item}>
                            {item}: {goalInputs.screentime[item]?.hours || 0}h {goalInputs.screentime[item]?.minutes || 0}m /
                            Tracked: {behaviorInputs.screentime[item]?.hours || 0}h {behaviorInputs.screentime[item]?.minutes || 0}m
                            {index < selectedItems.screentime.length - 1 && ", "}
                          </span>
                        ))}
                      </div>
                    )}

                  </td>
                </GoalContainer>

                <GoalContainer style={styles.goalRow}>
                  <td style={styles.titleGroup}>
                    <img
                      style={styles.icon}
                      src={require("../../components/images/journal/apple.png")}
                      alt="Apple for servings goal"
                    />
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
                      <h2 style={styles.goalLabel}>Eating Fruits & Vegetables</h2>
                      <p style={{ fontSize: "16px", color: "#555", fontWeight: "bold" }}>Recommended: 5 servings/day</p>
                    </div>
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
                    <Tooltip title={loggedEatingToday && editingBehaviorId !== 2 ? "You've already logged this goal today!" : ""}>
                      <StyledButton variant="contained" onClick={() => handleOpenPopup("eating")}>
                        Set and Track
                      </StyledButton>
                    </Tooltip>
                    {selectedItems.eating.length > 0 && (
                      <div style={{ marginTop: "10px", color: "#333", fontSize: "14px" }}>
                        <strong>Selected: </strong>
                        {selectedItems.eating.map((item, index) => (
                          <span key={item}>
                            {item}: {goalInputs.eating[item]?.servings || 0} servings /
                            Tracked: {behaviorInputs.eating[item]?.servings || 0} servings
                            {index < selectedItems.eating.length - 1 && ", "}
                          </span>
                        ))}
                      </div>
                    )}

                  </td>
                </GoalContainer>

                <GoalContainer style={styles.goalRow}>
                  <td style={styles.titleGroup}>
                    <img
                      style={styles.icon}
                      src={require("../../components/images/journal/pillow_icon.png")}
                      alt="Pillow icon for sleep"
                    />
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
                      <h2 style={styles.goalLabel}>Sleep</h2>
                      <p style={{ fontSize: "16px", color: "#555", fontWeight: "bold" }}>Recommended: 9 hours/day</p>
                    </div>
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
                    <Tooltip title={loggedSleepToday && editingBehaviorId !== 3 ? "You've already logged this goal today!" : ""}>
                      <StyledButton variant="contained" onClick={() => handleOpenPopup("sleep")}>
                        Set and Track
                      </StyledButton>
                    </Tooltip>
                    {selectedItems.sleep.length > 0 && (
                      <div style={{ marginTop: "10px", color: "#333", fontSize: "14px" }}>
                        <strong>Selected: </strong>
                        {selectedItems.sleep.includes("Track Sleep") && (
                          <>
                            {/* Calculation of expected sleep duration */}
                            Expected Sleep: {(() => {
                              const bedTime = goalInputs.sleep["Expected Sleep"]?.bedTime;
                              const wakeUpTime = goalInputs.sleep["Expected Sleep"]?.wakeUpTime;

                              if (!bedTime || !wakeUpTime) return "0h 0m";

                              const [bedHour, bedMinute] = bedTime.split(":").map(Number);
                              const [wakeHour, wakeMinute] = wakeUpTime.split(":").map(Number);

                              let totalMinutes = (wakeHour * 60 + wakeMinute) - (bedHour * 60 + bedMinute);
                              if (totalMinutes < 0) totalMinutes += 24 * 60;

                              const hours = Math.floor(totalMinutes / 60);
                              const minutes = totalMinutes % 60;

                              return `${hours}h ${minutes}m`;
                            })()} /

                            {/* Calculation of tracked sleep duration */}
                            Tracked Sleep: {(() => {
                              const bedTime = behaviorInputs.sleep["Actual Sleep"]?.bedTime;
                              const wakeUpTime = behaviorInputs.sleep["Actual Sleep"]?.wakeUpTime;

                              if (!bedTime || !wakeUpTime) return "0h 0m";

                              const [bedHour, bedMinute] = bedTime.split(":").map(Number);
                              const [wakeHour, wakeMinute] = wakeUpTime.split(":").map(Number);

                              let totalMinutes = (wakeHour * 60 + wakeMinute) - (bedHour * 60 + bedMinute);
                              if (totalMinutes < 0) totalMinutes += 24 * 60;

                              const hours = Math.floor(totalMinutes / 60);
                              const minutes = totalMinutes % 60;

                              return `${hours}h ${minutes}m`;
                            })()}
                          </>
                        )}
                      </div>
                    )}


                  </td>
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
                      <StyledButton
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
                          handleSave(
                            "activity",
                            activityGoal,
                            setActivityGoal,
                            activityData,
                            setActivityResponseLoading
                          );
                          setLoggedActivityToday(true);
                          setEditingBehaviorId(-1);
                        }}
                      >
                        SAVE
                      </StyledButton>
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
                      <StyledButton
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
                          handleSave(
                            "screentime",
                            screentimeGoal,
                            setScreentimeGoal,
                            screentimeData,
                            setScreentimeResponseLoading
                          );
                          setLoggedScreentimeToday(true);
                          setEditingBehaviorId(-1);
                        }}
                      >
                        SAVE
                      </StyledButton>
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
                      <strong>How to Achieve:</strong> Assign time slots to use
                      computers/phones for schoolwork, video games, or other
                      activities. Relax and have fun outside or with
                      friends/family in other hours!{" "}
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
                      <StyledButton
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
                          handleSave(
                            "eating",
                            eatingGoal,
                            setEatingGoal,
                            eatingData,
                            setEatingResponseLoading
                          );
                          setLoggedEatingToday(true);
                          setEditingBehaviorId(-1);
                        }}
                      >
                        SAVE
                      </StyledButton>
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
                      <strong>How to Achieve:</strong> Incorporate
                      fruits/veggies into snacktimes. Eating easy to eat fruits
                      (bananas, grapes, apples, etc.) or vegetables
                      (carrots/celery sticks, broccoli, etc.) helps!
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
                      <StyledButton
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
                          handleSave(
                            "sleep",
                            sleepGoal,
                            setSleepGoal,
                            sleepData,
                            setSleepResponseLoading
                          );
                          setLoggedSleepToday(true);
                          setEditingBehaviorId(-1);
                        }}
                      >
                        SAVE
                      </StyledButton>

                    </Tooltip>
                  </ReflectionContainer>
                  <td style={{ width: "50", maxHeight: 101 }}>
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
      {/* Physical Activity Dialog */}
      <Dialog
        open={popupOpen.activity}
        onClose={() => handleClosePopup("activity")}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Set Physical Activity Goals and Track Behavior</DialogTitle>
        <DialogContent>
          {/* physical activities */}
          {physicalActivities.map((activity) => (
            <div key={activity.category} style={{ marginBottom: "10px" }}>
              <h3>{activity.category}</h3>
              <Grid container spacing={1} style={{ marginTop: '-5px' }}>
                <Grid item xs={2}></Grid>
                <Grid item xs={4} style={{ textAlign: "center", fontWeight: "bold" }}>
                  What I Will Do
                </Grid>
                <Grid item xs={4} style={{ textAlign: "center", fontWeight: "bold" }}>
                  What I Did
                </Grid>
              </Grid>
              {activity.items.map((item) => (
                <Grid container spacing={1} alignItems="center" key={item}>
                  <Grid item xs={2}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={selectedItems.activity.includes(item)}
                          onChange={(event) => handleCheckboxChange(event, "activity")}
                          name={item}
                        />
                      }
                      label={item}
                    />
                  </Grid>
                  {selectedItems.activity.includes(item) && (
                    <>
                      <Grid item xs={1} style={{ paddingLeft: '80px' }}>
                        <TextField
                          label="Hrs"
                          type="number"
                          name={`${item}-goal-hours`}
                          value={goalInputs.activity[item]?.hours || ""}
                          onChange={(event) => handleInputChange(event, item, "hours", "goal", "activity")}
                          fullWidth
                          size="small"
                          style={{ width: '60px' }}
                          inputProps={{ min: "0" }}
                        />
                      </Grid>
                      <Grid item xs={2} style={{ paddingLeft: '65px', paddingRight: '5px' }}>
                        <TextField
                          label="Mins"
                          type="number"
                          name={`${item}-goal-minutes`}
                          value={goalInputs.activity[item]?.minutes || ""}
                          onChange={(event) => handleInputChange(event, item, "minutes", "goal", "activity")}
                          fullWidth
                          size="small"
                          style={{ width: '60px' }}
                          inputProps={{ min: "0" }}
                        />
                      </Grid>
                      <Grid item xs={1} style={{ paddingLeft: '150px' }}>
                        <TextField
                          label="Hrs"
                          type="number"
                          name={`${item}-behavior-hours`}
                          value={behaviorInputs.activity[item]?.hours || ""}
                          onChange={(event) => handleInputChange(event, item, "hours", "behavior", "activity")}
                          fullWidth
                          size="small"
                          style={{ width: '60px' }}
                          inputProps={{ min: "0" }}
                        />
                      </Grid>
                      <Grid item xs={2} style={{ paddingLeft: '65px' }}>
                        <TextField
                          label="Mins"
                          type="number"
                          name={`${item}-behavior-minutes`}
                          value={behaviorInputs.activity[item]?.minutes || ""}
                          onChange={(event) => handleInputChange(event, item, "minutes", "behavior", "activity")}
                          fullWidth
                          size="small"
                          style={{ width: '60px' }}
                          inputProps={{ min: "0" }}
                        />
                      </Grid>
                    </>
                  )}
                </Grid>
              ))}
            </div>
          ))}
          {/* Other" Activity Section */}
          <FormControlLabel
            control={
              <Checkbox
                checked={otherChecked.activity}
                onChange={(event) => handleOtherCheckboxChange(event, "activity")}
              />
            }
            label="Other"
          />
          {otherChecked.activity && (
            <Grid container spacing={1} alignItems="center">
              <Grid item xs={2}>
                <TextField
                  label="Other Activity"
                  variant="outlined"
                  size="small"
                  fullWidth
                  value={customActivityInput.activity}
                  onChange={(e) => handleCustomActivityChange(e, "activity")}
                  style={{ width: "100%" }}
                />
              </Grid>
              <Grid item xs={1} style={{ paddingLeft: '80px' }}>
                <TextField
                  label="Hrs"
                  type="number"
                  name="other-goal-hours"
                  value={goalInputs.activity[customActivityInput.activity]?.hours || ""}
                  onChange={(event) => handleInputChange(event, customActivityInput.activity, "hours", "goal", "activity")}
                  fullWidth
                  size="small"
                  style={{ width: '60px' }}
                  inputProps={{ min: "0" }}
                />
              </Grid>
              <Grid item xs={2} style={{ paddingLeft: '65px', paddingRight: '5px' }}>
                <TextField
                  label="Mins"
                  type="number"
                  name="other-goal-minutes"
                  value={goalInputs.activity[customActivityInput.activity]?.minutes || ""}
                  onChange={(event) => handleInputChange(event, customActivityInput.activity, "minutes", "goal", "activity")}
                  fullWidth
                  size="small"
                  style={{ width: '60px' }}
                  inputProps={{ min: "0" }}
                />
              </Grid>
              <Grid item xs={1} style={{ paddingLeft: '150px' }}>
                <TextField
                  label="Hrs"
                  type="number"
                  name="other-behavior-hours"
                  value={behaviorInputs.activity[customActivityInput.activity]?.hours || ""}
                  onChange={(event) => handleInputChange(event, customActivityInput.activity, "hours", "behavior", "activity")}
                  fullWidth
                  size="small"
                  style={{ width: '60px' }}
                  inputProps={{ min: "0" }}
                />
              </Grid>
              <Grid item xs={2} style={{ paddingLeft: '65px' }}>
                <TextField
                  label="Mins"
                  type="number"
                  name="other-behavior-minutes"
                  value={behaviorInputs.activity[customActivityInput.activity]?.minutes || ""}
                  onChange={(event) => handleInputChange(event, customActivityInput.activity, "minutes", "behavior", "activity")}
                  fullWidth
                  size="small"
                  style={{ width: '60px' }}
                  inputProps={{ min: "0" }}
                />
              </Grid>
            </Grid>
          )}

          <Button onClick={() => handleAddCustomActivity("activity")}>
            Add Activity
          </Button>

          {/*Total time */}
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: "20px" }}>
            <strong>
              Total Expected Time: {Math.floor(totalExpectedTime.activity / 60)} hours {totalExpectedTime.activity % 60} minutes
            </strong>
            <strong>
              Total Tracked Time: {Math.floor(totalTrackedTime.activity / 60)} hours {totalTrackedTime.activity % 60} minutes
            </strong>
          </div>
        </DialogContent>
        <DialogActions>
          <StyledButton onClick={() => handleDone("activity")} color="primary">
            Done
          </StyledButton>
        </DialogActions>
      </Dialog>
      {/* Screentime Dialog */}
      <Dialog
        open={popupOpen.screentime}
        onClose={() => handleClosePopup("screentime")}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Set Screentime Goals and Track Behavior</DialogTitle>
        <DialogContent>
          {screentimeActivities.map((activity) => (
            <div key={activity.category} style={{ marginBottom: "10px" }}>
              <h3>{activity.category}</h3>
              <Grid container spacing={1} style={{ marginTop: '-5px' }}>
                <Grid item xs={2}></Grid>
                <Grid item xs={4} style={{ textAlign: "center", fontWeight: "bold" }}>
                  What I Will Do
                </Grid>
                <Grid item xs={4} style={{ textAlign: "center", fontWeight: "bold" }}>
                  What I Did
                </Grid>
              </Grid>
              {activity.items.map((item) => (
                <Grid container spacing={1} alignItems="center" key={item}>
                  <Grid item xs={2}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={selectedItems.screentime.includes(item)}
                          onChange={(event) => handleCheckboxChange(event, "screentime")}
                          name={item}
                        />
                      }
                      label={item}
                    />
                  </Grid>
                  {selectedItems.screentime.includes(item) && (
                    <>
                      <Grid item xs={1} style={{ paddingLeft: '80px' }}>
                        <TextField
                          label="Hrs"
                          type="number"
                          name={`${item}-goal-hours`}
                          value={goalInputs.screentime[item]?.hours || ""}
                          onChange={(event) => handleInputChange(event, item, "hours", "goal", "screentime")}
                          fullWidth
                          size="small"
                          style={{ width: '60px' }}
                          inputProps={{ min: "0" }}
                        />
                      </Grid>
                      <Grid item xs={2} style={{ paddingLeft: '65px', paddingRight: '5px' }}>
                        <TextField
                          label="Mins"
                          type="number"
                          name={`${item}-goal-minutes`}
                          value={goalInputs.screentime[item]?.minutes || ""}
                          onChange={(event) => handleInputChange(event, item, "minutes", "goal", "screentime")}
                          fullWidth
                          size="small"
                          style={{ width: '60px' }}
                          inputProps={{ min: "0" }}
                        />
                      </Grid>
                      <Grid item xs={1} style={{ paddingLeft: '150px' }}>
                        <TextField
                          label="Hrs"
                          type="number"
                          name={`${item}-behavior-hours`}
                          value={behaviorInputs.screentime[item]?.hours || ""}
                          onChange={(event) => handleInputChange(event, item, "hours", "behavior", "screentime")}
                          fullWidth
                          size="small"
                          style={{ width: '60px' }}
                          inputProps={{ min: "0" }}
                        />
                      </Grid>
                      <Grid item xs={2} style={{ paddingLeft: '65px' }}>
                        <TextField
                          label="Mins"
                          type="number"
                          name={`${item}-behavior-minutes`}
                          value={behaviorInputs.screentime[item]?.minutes || ""}
                          onChange={(event) => handleInputChange(event, item, "minutes", "behavior", "screentime")}
                          fullWidth
                          size="small"
                          style={{ width: '60px' }}
                          inputProps={{ min: "0" }}
                        />
                      </Grid>
                    </>
                  )}
                </Grid>
              ))}
            </div>
          ))}
          {/* Other Screentime */}
          <FormControlLabel
            control={
              <Checkbox
                checked={otherChecked.screentime}
                onChange={(event) => handleOtherCheckboxChange(event, "screentime")}
              />
            }
            label="Other"
          />
          {otherChecked.screentime && (
            <Grid container spacing={1} alignItems="center">
              <Grid item xs={2}>
                <TextField
                  label="Other Screentime Activity"
                  variant="outlined"
                  size="small"
                  fullWidth
                  value={customActivityInput.screentime}
                  onChange={(e) => handleCustomActivityChange(e, "screentime")}
                  style={{ width: "100%" }}
                />
              </Grid>
              <Grid item xs={1} style={{ paddingLeft: '80px' }}>
                <TextField
                  label="Hrs"
                  type="number"
                  name="other-goal-hours"
                  value={goalInputs.screentime[customActivityInput.screentime]?.hours || ""}
                  onChange={(event) => handleInputChange(event, customActivityInput.screentime, "hours", "goal", "screentime")}
                  fullWidth
                  size="small"
                  style={{ width: '60px' }}
                  inputProps={{ min: "0" }}
                />
              </Grid>
              <Grid item xs={2} style={{ paddingLeft: '65px', paddingRight: '5px' }}>
                <TextField
                  label="Mins"
                  type="number"
                  name="other-goal-minutes"
                  value={goalInputs.screentime[customActivityInput.screentime]?.minutes || ""}
                  onChange={(event) => handleInputChange(event, customActivityInput.screentime, "minutes", "goal", "screentime")}
                  fullWidth
                  size="small"
                  style={{ width: '60px' }}
                  inputProps={{ min: "0" }}
                />
              </Grid>
              <Grid item xs={1} style={{ paddingLeft: '150px' }}>
                <TextField
                  label="Hrs"
                  type="number"
                  name="other-behavior-hours"
                  value={behaviorInputs.screentime[customActivityInput.screentime]?.hours || ""}
                  onChange={(event) => handleInputChange(event, customActivityInput.screentime, "hours", "behavior", "screentime")}
                  fullWidth
                  size="small"
                  style={{ width: '60px' }}
                  inputProps={{ min: "0" }}
                />
              </Grid>
              <Grid item xs={2} style={{ paddingLeft: '65px' }}>
                <TextField
                  label="Minutes"
                  type="number"
                  name="other-behavior-minutes"
                  value={behaviorInputs.screentime[customActivityInput.screentime]?.minutes || ""}
                  onChange={(event) => handleInputChange(event, customActivityInput.screentime, "minutes", "behavior", "screentime")}
                  fullWidth
                  size="small"
                  style={{ width: '60px' }}
                  inputProps={{ min: "0" }}
                />
              </Grid>
            </Grid>
          )}

          <Button onClick={() => handleAddCustomActivity("screentime")}>
            Add Screentime Activity
          </Button>
          {/* Display total time at the bottom of the popup */}
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: "20px" }}>
            <strong>
              Total Expected Screentime: {Math.floor(totalExpectedTime.screentime / 60)} hours {totalExpectedTime.screentime % 60} minutes
            </strong>
            <strong>
              Total Tracked Screentime: {Math.floor(totalTrackedTime.screentime / 60)} hours {totalTrackedTime.screentime % 60} minutes
            </strong>
          </div>
        </DialogContent>
        <DialogActions>
          <StyledButton onClick={() => handleDone("screentime")} color="primary">
            Done
          </StyledButton>
        </DialogActions>
      </Dialog>
      {/* Fruits & Vegetables Dialog */}
      <Dialog
        open={popupOpen.eating}
        onClose={() => handleClosePopup("eating")}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Set Eating Fruits & Vegetables Goals and Track Behavior</DialogTitle>
        <DialogContent>
          {/* Fruits */}
          <div style={{ marginBottom: "10px" }}>
            <h3>Fruits</h3>
            <Grid container spacing={1} style={{ marginTop: '-5px' }}>
              <Grid item xs={2}></Grid>
              <Grid item xs={5} style={{ textAlign: "center", fontWeight: "bold" }}>
                What I Will Eat
              </Grid>
              <Grid item xs={5} style={{ textAlign: "center", fontWeight: "bold" }}>
                What I Ate
              </Grid>
            </Grid>
            {fruitsAndVegetables
              .find((category) => category.category === "Fruits")
              .items.map((item) => (
                <Grid container spacing={1} alignItems="center" key={item}>
                  <Grid item xs={2}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={selectedItems.eating.includes(item)}
                          onChange={(event) => handleCheckboxChange(event, "eating")}
                          name={item}
                        />
                      }
                      label={item}
                    />
                  </Grid>
                  {selectedItems.eating.includes(item) && (
                    <>
                      <Grid item xs={5} style={{ textAlign: 'center' }}>
                        <TextField
                          label="Servings"
                          type="number"
                          name={`${item}-goal-servings`}
                          value={goalInputs.eating[item]?.servings || ""}
                          onChange={(event) => handleInputChange(event, item, "servings", "goal", "eating")}
                          fullWidth
                          size="small"
                          style={{ width: '100px' }}
                        />
                      </Grid>
                      <Grid item xs={5} style={{ textAlign: 'center' }}>
                        <TextField
                          label="Servings"
                          type="number"
                          name={`${item}-behavior-servings`}
                          value={behaviorInputs.eating[item]?.servings || ""}
                          onChange={(event) => handleInputChange(event, item, "servings", "behavior", "eating")}
                          fullWidth
                          size="small"
                          style={{ width: '100px' }}
                        />
                      </Grid>
                    </>
                  )}
                </Grid>
              ))}

            {/* Other Fruit Section */}
            <FormControlLabel
              control={
                <Checkbox
                  checked={otherChecked.fruit}
                  onChange={() => setOtherChecked((prev) => ({ ...prev, fruit: !prev.fruit }))}
                />
              }
              label="Other Fruit"
            />
            {otherChecked.fruit && (
              <Grid container spacing={1} alignItems="center">
                <Grid item xs={2}>
                  <TextField
                    label="Other Fruit"
                    variant="outlined"
                    size="small"
                    fullWidth
                    value={customActivityInput.eating.fruit}
                    onChange={(e) =>
                      setCustomActivityInput((prev) => ({
                        ...prev,
                        eating: { ...prev.eating, fruit: e.target.value },
                      }))
                    }
                    style={{ width: "100%" }}
                  />
                </Grid>
                <Grid item xs={5} style={{ textAlign: 'center' }}>
                  <TextField
                    label="Servings"
                    type="number"
                    name="other-fruit-goal-servings"
                    value={goalInputs.eating[customActivityInput.eating.fruit]?.servings || ""}
                    onChange={(event) => handleInputChange(event, customActivityInput.eating.fruit, "servings", "goal", "eating")}
                    fullWidth
                    size="small"
                    style={{ width: '100px' }}
                  />
                </Grid>
                <Grid item xs={5} style={{ textAlign: 'center' }}>
                  <TextField
                    label="Servings"
                    type="number"
                    name="other-fruit-behavior-servings"
                    value={behaviorInputs.eating[customActivityInput.eating.fruit]?.servings || ""}
                    onChange={(event) => handleInputChange(event, customActivityInput.eating.fruit, "servings", "behavior", "eating")}
                    fullWidth
                    size="small"
                    style={{ width: '100px' }}
                  />
                </Grid>
              </Grid>
            )}
          </div>
          {/*Vegetables */}
          <div style={{ marginBottom: "10px" }}>
            <h3>Vegetables</h3>
            <Grid container spacing={1} style={{ marginTop: '-5px' }}>
              <Grid item xs={2}></Grid>
              <Grid item xs={5} style={{ textAlign: "center", fontWeight: "bold" }}>
                What I Will Eat
              </Grid>
              <Grid item xs={5} style={{ textAlign: "center", fontWeight: "bold" }}>
                What I Ate
              </Grid>
            </Grid>
            {fruitsAndVegetables
              .find((category) => category.category === "Vegetables")
              .items.map((item) => (
                <Grid container spacing={1} alignItems="center" key={item}>
                  <Grid item xs={2}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={selectedItems.eating.includes(item)}
                          onChange={(event) => handleCheckboxChange(event, "eating")}
                          name={item}
                        />
                      }
                      label={item}
                    />
                  </Grid>
                  {selectedItems.eating.includes(item) && (
                    <>
                      <Grid item xs={5} style={{ textAlign: 'center' }}>
                        <TextField
                          label="Servings"
                          type="number"
                          name={`${item}-goal-servings`}
                          value={goalInputs.eating[item]?.servings || ""}
                          onChange={(event) => handleInputChange(event, item, "servings", "goal", "eating")}
                          fullWidth
                          size="small"
                          style={{ width: '100px' }}
                        />
                      </Grid>
                      <Grid item xs={5} style={{ textAlign: 'center' }}>
                        <TextField
                          label="Servings"
                          type="number"
                          name={`${item}-behavior-servings`}
                          value={behaviorInputs.eating[item]?.servings || ""}
                          onChange={(event) => handleInputChange(event, item, "servings", "behavior", "eating")}
                          fullWidth
                          size="small"
                          style={{ width: '100px' }}
                        />
                      </Grid>
                    </>
                  )}
                </Grid>
              ))}
            {/*Other Vegetable Section */}
            <FormControlLabel
              control={
                <Checkbox
                  checked={otherChecked.vegetable}
                  onChange={() => setOtherChecked((prev) => ({ ...prev, vegetable: !prev.vegetable }))}
                />
              }
              label="Other Vegetable"
            />
            {otherChecked.vegetable && (
              <Grid container spacing={1} alignItems="center">
                <Grid item xs={2}>
                  <TextField
                    label="Other Vegetable"
                    variant="outlined"
                    size="small"
                    fullWidth
                    value={customActivityInput.eating.vegetable}
                    onChange={(e) =>
                      setCustomActivityInput((prev) => ({
                        ...prev,
                        eating: { ...prev.eating, vegetable: e.target.value },
                      }))
                    }
                    style={{ width: "100%" }}
                  />
                </Grid>
                <Grid item xs={5} style={{ textAlign: 'center' }}>
                  <TextField
                    label="Servings"
                    type="number"
                    name="other-vegetable-goal-servings"
                    value={goalInputs.eating[customActivityInput.eating.vegetable]?.servings || ""}
                    onChange={(event) => handleInputChange(event, customActivityInput.eating.vegetable, "servings", "goal", "eating")}
                    fullWidth
                    size="small"
                    style={{ width: '100px' }}
                  />
                </Grid>
                <Grid item xs={5} style={{ textAlign: 'center' }}>
                  <TextField
                    label="Servings"
                    type="number"
                    name="other-vegetable-behavior-servings"
                    value={behaviorInputs.eating[customActivityInput.eating.vegetable]?.servings || ""}
                    onChange={(event) => handleInputChange(event, customActivityInput.eating.vegetable, "servings", "behavior", "eating")}
                    fullWidth
                    size="small"
                    style={{ width: '100px' }}
                  />
                </Grid>
              </Grid>
            )}
          </div>
          <Button onClick={() => handleAddCustomActivity("eating")}>Add Eating Activity</Button>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: "20px" }}>
            <strong>
              Total Expected Servings: {totalExpectedTime.eating} servings
            </strong>
            <strong>
              Total Tracked Servings: {totalTrackedTime.eating} servings
            </strong>
          </div>
        </DialogContent>
        <DialogActions>
          <StyledButton onClick={() => handleDone("eating")} color="primary">
            Done
          </StyledButton>
        </DialogActions>
      </Dialog>
      {/* Sleep Dialog */}
      <Dialog
        open={popupOpen.sleep}
        onClose={() => handleClosePopup("sleep")}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Set Sleep Goals and Track Behavior</DialogTitle>
        <DialogContent>
          <div style={{ marginBottom: "10px" }}>
            <Grid container spacing={1} alignItems="center">
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={selectedItems.sleep.includes("Track Sleep")}
                      onChange={(event) => handleCheckboxChange(event, "sleep")}
                      name="Track Sleep"
                    />
                  }
                  label="Track Sleep"
                />
              </Grid>
              {selectedItems.sleep.includes("Track Sleep") && (
                <>
                  {/* Expected (Goal) Section */}
                  <Grid item xs={6}>
                    {/* Wrapping the TextField in a clickable div */}
                    <div onClick={() => bedTimeGoalRef.current.focus()}>
                      <TextField
                        inputRef={bedTimeGoalRef}
                        label="Bed Time"
                        type="time"
                        name="bedTime"
                        value={goalInputs.sleep["Expected Sleep"]?.bedTime || ""}
                        onChange={(event) =>
                          handleInputChange(event, "Expected Sleep", "bedTime", "goal", "sleep")
                        }
                        fullWidth
                        size="small"
                        style={{ marginBottom: '10px' }}
                        InputLabelProps={{ shrink: true }}
                      />
                    </div>
                    <div onClick={() => wakeUpTimeGoalRef.current.focus()}>
                      <TextField
                        inputRef={wakeUpTimeGoalRef}
                        label="Wake Up Time"
                        type="time"
                        name="wakeUpTime"
                        value={goalInputs.sleep["Expected Sleep"]?.wakeUpTime || ""}
                        onChange={(event) =>
                          handleInputChange(event, "Expected Sleep", "wakeUpTime", "goal", "sleep")
                        }
                        fullWidth
                        size="small"
                        InputLabelProps={{ shrink: true }}
                      />
                    </div>
                  </Grid>

                  {/* Actual (Behavior) Section */}
                  <Grid item xs={6}>
                    <div onClick={() => bedTimeActualRef.current.focus()}>
                      <TextField
                        inputRef={bedTimeActualRef}
                        label="Bed Time"
                        type="time"
                        name="bedTime"
                        value={behaviorInputs.sleep["Actual Sleep"]?.bedTime || ""}
                        onChange={(event) =>
                          handleInputChange(event, "Actual Sleep", "bedTime", "behavior", "sleep")
                        }
                        fullWidth
                        size="small"
                        style={{ marginBottom: '10px' }}
                        InputLabelProps={{ shrink: true }}
                      />
                    </div>
                    <div onClick={() => wakeUpTimeActualRef.current.focus()}>
                      <TextField
                        inputRef={wakeUpTimeActualRef}
                        label="Wake Up Time"
                        type="time"
                        name="wakeUpTime"
                        value={behaviorInputs.sleep["Actual Sleep"]?.wakeUpTime || ""}
                        onChange={(event) =>
                          handleInputChange(event, "Actual Sleep", "wakeUpTime", "behavior", "sleep")
                        }
                        fullWidth
                        size="small"
                        InputLabelProps={{ shrink: true }}
                      />
                    </div>
                  </Grid>
                </>
              )}
            </Grid>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", marginTop: "20px" }}>
            <strong>
              Total Expected Sleep: {Math.floor(totalExpectedTime.sleep / 60)} hours{" "}
              {totalExpectedTime.sleep % 60} minutes
            </strong>
            <strong>
              Total Tracked Sleep: {Math.floor(totalTrackedTime.sleep / 60)} hours{" "}
              {totalTrackedTime.sleep % 60} minutes
            </strong>
          </div>
        </DialogContent>
        <DialogActions>
          <StyledButton onClick={() => handleDone("sleep")} color="primary">
            Done
          </StyledButton>
        </DialogActions>
      </Dialog>
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
    marginTop: "-5%"
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
    marginTop: "5%"
  },
  goalRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "15px"
  },
  goalLabel: {
    width: "auto",
    margin: "2% 0 1% 5%",
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
    marginTop: "5%",
  },
  feedback: {
    color: "#000080",
    padding: 5,
    overflowY: "scroll",
    maxHeight: 20,
  },
};