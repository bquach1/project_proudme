import React, { useState, useEffect } from "react";
import "css/journal.css";
import withAuth from "components/auth/withAuth";
import DurationPicker from "components/journal/durationPicker";
import axios from "axios";

import { TextField, Tooltip, Button, CircularProgress, Dialog, DialogTitle, DialogContent, DialogActions, Checkbox, FormControlLabel, Grid } from "@mui/material";
import styled from "styled-components";


import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import EditIcon from "@mui/icons-material/Edit";
import LockIcon from "@mui/icons-material/Lock";
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Grow from '@mui/material/Grow';
import Paper from '@mui/material/Paper';
import Popper from '@mui/material/Popper';
import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';
import Stack from '@mui/material/Stack';

import { Link, Outlet } from 'react-router-dom';

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
  width: 100%; /* Change to 100% for mobile */
  margin: auto;
  font-family: Montserrat;

  .information-text {
    font-size: 14px;
  }

  .disabled-behavior:hover {
    border-radius: 5px;
    background-color: #90ee90;
  }

  @media only screen and (max-width: 600px) {
    width: 100%;
    flex-direction: column;
    overflow: hidden;
    height: 100vh; 
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
    overflow: hidden;
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

  const [currentDateTime, setCurrentDateTime] = useState("");

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



  const [user, setUser] = useState([]);
  const [goalData, setGoalData] = useState([]);
  const [loggedActivityToday, setLoggedActivityToday] = useState(false);
  const [loggedScreentimeToday, setLoggedScreentimeToday] = useState(false);
  const [loggedEatingToday, setLoggedEatingToday] = useState(false);
  const [loggedSleepToday, setLoggedSleepToday] = useState(false);
  const [editingBehaviorId, setEditingBehaviorId] = useState(-1);

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
    sleep: {
      "Expected Sleep": {
        bedtime: "22:00", // Default bedtime
        wakeUpTime: "06:00", // Default wake-up time
      },
    },
  });
  const [behaviorInputs, setBehaviorInputs] = useState({
    activity: {},
    screentime: {},
    eating: {},
    sleep: {
      "Actual Sleep": {
        bedtime: "22:00", // Default bedtime
        wakeUpTime: "06:00", // Default wake-up time
      },
    },
  });

  // Fetch data on component mount
  useEffect(() => {
  
    const fetchData = async () => {
      try {
        // Fetch selected items
        const selectedResponse = await axios.get(`${DATABASE_URL}/getSelectedItems`, {
          params: { userId: user._id }  // Pass user._id here
        });
        if (selectedResponse.data) {
          setSelectedItems(selectedResponse.data);
        }
  
        // Fetch goal inputs
        const goalResponse = await axios.get(`${DATABASE_URL}/getGoalInputs`, {
          params: { userId: user._id }  // Pass user._id here
        });
        if (goalResponse.data) {
          setGoalInputs(goalResponse.data);
        }
  
        // Fetch behavior inputs
        const behaviorResponse = await axios.get(`${DATABASE_URL}/getBehaviorInputs`, {
          params: { userId: user._id }  // Pass user._id here
        });
        if (behaviorResponse.data) {
          setBehaviorInputs(behaviorResponse.data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
  
    fetchData();
  }, [user]);
  
  useEffect(() => {
  
    const fetchChatbotResponses = async () => {
      try {
        const response = await axios.get(`${DATABASE_URL}/getChatbotResponses`, {
          params: { userId: user._id },
        });
        if (response.data) {
          console.log("Fetched chatbot responses:", response.data);
          setGoal((prevGoal) => {
            return prevGoal.map((g) => {
              const chatbotResponse = response.data.find((r) => r.goalType === g.goalType);
              return chatbotResponse ? { ...g, feedback: chatbotResponse.feedback } : g;
            });
          });
        }
      } catch (error) {
        console.error("Error fetching chatbot responses:", error);
      }
    };
  
    fetchChatbotResponses();
  }, [user]);
  

  const [totalTrackedTime, setTotalTrackedTime] = useState({
    activity: 0,
    screentime: 0,
    eating: 0,
    sleep: 480,
  });

  const [totalExpectedTime, setTotalExpectedTime] = useState({
    activity: 0,
    screentime: 0,
    eating: 0,
    sleep: 480,
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
  const ismobile = useMediaQuery({ query: "(max-width: 600px)" });
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
    const updateDateTime = () => {
      const date = new Date();
      const formattedDate = date.toLocaleDateString();
      const formattedTime = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setCurrentDateTime(`${formattedDate} ${formattedTime}`);
    };

    updateDateTime();

    const now = new Date();
    const delay = 60000 - (now.getSeconds() * 1000 + now.getMilliseconds());

    const timeout = setTimeout(() => {
      updateDateTime();
      const interval = setInterval(updateDateTime, 60000);
      return () => clearInterval(interval);
    }, delay);

    return () => clearTimeout(timeout);
  }, []);

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
      // console.log("Selected Items (before request): ", selectedItems);
      // console.log("Goal Inputs (before request): ", goalInputs);
      // console.log("Behavior Inputs (before request): ", behaviorInputs);

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
        })
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
  const [open, setOpen] = React.useState(false);
  const anchorRef = React.useRef(null);

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }

    setOpen(false);
  };

  function handleListKeyDown(event) {
    if (event.key === 'Tab') {
      event.preventDefault();
      setOpen(false);
    } else if (event.key === 'Escape') {
      setOpen(false);
    }
  }

  // return focus to the button when we transitioned from !open -> open
  const prevOpen = React.useRef(open);
  React.useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef.current.focus();
    }

    prevOpen.current = open;
  }, [open]);
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









  // useEffect(() => {
  //   console.log("Selected Items:", selectedItems);
  //   console.log("Goal Inputs:", goalInputs);
  //   console.log("Behavior Inputs:", behaviorInputs);
  // }, [selectedItems, goalInputs, behaviorInputs]);

  useEffect(() => {
    if (readyToRequest) {
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

  // console.log(selectedItems)

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

    saveSelectedItems();
    saveGoalInputs();
    saveBehaviorInputs();
  };

  const [physicalActivities, setphysicalActivities] = useState([
    {
      category: "Strenuous Exercise",
      items: [
        "Running",
        "Football",
        "Soccer",
        "Basketball",
        "Swimming",
        "Biking",
      ],
    },
    {
      category: "Moderate Exercise",
      items: [
        "Baseball",
        "Tennis",
        "Volleyball",
        "Badminton",
        "Dancing",
      ],
    },
    {
      category: "Mild Exercise",
      items: [
        "Yoga",
        "Archery",
        "Fishing",
        "Bowling",
        "Horseshoes",
        "Golf",
        "Walking very",
      ],
    },
  ]);

  const [customActivityInput, setCustomActivityInput] = useState({
    activity: "",
    screentime: "",
    eating: "",
  });

  const [otherChecked, setOtherChecked] = useState({
    activity: false,
    screentime: false,
    eating: false,
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
  };

  const [screentimeActivities, setscreentimeActivities] = useState([
    {
      category: "Gaming and Video Chatting",
      items: [
        "Video Games",
        "Looking at Photos",
        "Video Chatting",
        "Watching Tv",
        "Watching Movies",

      ],
    },
    {
      category: "Academic Screen Time",
      items: ["Online Learning", "Homework", "Other Academic Work"],
    },
  ]);

  const [fruitsAndVegetables, setFruitsAndVegetables] = useState([
    {
      category: "Fruits",
      items: ["Apples", "Bananas", "Oranges", "Strawberries", "Grapes", "Watermelon"],
    },
    {
      category: "Vegetables",
      items: ["Carrots", "Broccoli", "Spinach", "Potatoes", "Tomatoes"],
    }
  ]);

  const [newFruit, setNewFruit] = useState('');
  const [newVegetable, setNewVegetable] = useState('');
  const [newStrenuous, setStrenuous] = useState('');
  const [newModerate, setModerate] = useState('');
  const [newMild, setMild] = useState('');
  const [newGame, setGame] = useState('');
  const [newAcademic, setAcademic] = useState('');


  // Function to handle adding a new item to a category
  const handleAddItemClick = (category) => {
    if (category === 'Fruits' && newFruit.trim()) {
      setFruitsAndVegetables((prevState) =>
        prevState.map((cat) =>
          cat.category === 'Fruits'
            ? { ...cat, items: [...cat.items, newFruit] }
            : cat
        )
      );
      setNewFruit(''); // Reset input
    }
    if (category === 'Vegetables' && newVegetable.trim()) {
      setFruitsAndVegetables((prevState) =>
        prevState.map((cat) =>
          cat.category === 'Vegetables'
            ? { ...cat, items: [...cat.items, newVegetable] }
            : cat
        )
      );
      setNewVegetable(''); // Reset input
    }
    if (category === 'Strenuous Exercise' && newStrenuous.trim()) {
      setphysicalActivities((prevState) =>
        prevState.map((cat) =>
          cat.category === 'Strenuous Exercise'
            ? { ...cat, items: [...cat.items, newStrenuous] }
            : cat
        )
      );
      setStrenuous(''); // Reset input
    }
    if (category === 'Moderate Exercise' && newModerate.trim()) {
      setphysicalActivities((prevState) =>
        prevState.map((cat) =>
          cat.category === 'Moderate Exercise'
            ? { ...cat, items: [...cat.items, newModerate] }
            : cat
        )
      );
      setModerate(''); // Reset input
    }
    if (category === 'Mild Exercise' && newMild.trim()) {
      setphysicalActivities((prevState) =>
        prevState.map((cat) =>
          cat.category === 'Mild Exercise'
            ? { ...cat, items: [...cat.items, newMild] }
            : cat
        )
      );
      setMild(''); // Reset input
    }
    if (category === 'Gaming and Video Chatting' && newGame.trim()) {
      setscreentimeActivities((prevState) =>
        prevState.map((cat) =>
          cat.category === 'Gaming and Video Chatting'
            ? { ...cat, items: [...cat.items, newGame] }
            : cat
        )
      );
      setGame(''); // Reset input
    }
    if (category === 'Academic Screen Time' && newAcademic.trim()) {
      setscreentimeActivities((prevState) =>
        prevState.map((cat) =>
          cat.category === 'Academic Screen Time'
            ? { ...cat, items: [...cat.items, newAcademic] }
            : cat
        )
      );
      setAcademic(''); // Reset input
    }
  };
  const [sleepDuration, setSleepDuration] = useState({ hours: 0, minutes: 0 });

  useEffect(() => {
    const calculateSleepDuration = () => {
      const bedTime = goalInputs.sleep?.["Expected Sleep"]?.bedtime || "22:00";
      const wakeUpTime = goalInputs.sleep?.["Expected Sleep"]?.wakeUpTime || "06:00";

      if (!bedTime || !wakeUpTime) return;

      const [bedHour, bedMinute] = bedTime.split(":").map(Number);
      const [wakeHour, wakeMinute] = wakeUpTime.split(":").map(Number);

      let totalMinutes = (wakeHour * 60 + wakeMinute) - (bedHour * 60 + bedMinute);
      if (totalMinutes < 0) totalMinutes += 24 * 60;

      const hours = Math.floor(totalMinutes / 60);
      const minutes = totalMinutes % 60;

      // Update state
      setSleepDuration({ hours, minutes });
    };

    calculateSleepDuration();
  }, [goalInputs.sleep]); // Recalculate when sleep data changes

const saveSelectedItems = async () => {
  try {
      await axios.post(`${DATABASE_URL}/selectedItems`, {
          userId: user._id, 
          activity: selectedItems.activity,
          screentime: selectedItems.screentime,
          eating: selectedItems.eating,
          sleep: selectedItems.sleep
      });
      console.log('Selected items saved successfully');
  } catch (error) {
      console.error('Error saving selected items:', error);
  }
};
const saveGoalInputs = async () => {
  try {
      await axios.post(`${DATABASE_URL}/saveGoalInputs`, {
          userId: user._id, 
          activity: goalInputs.activity,
          screentime: goalInputs.screentime,
          eating: goalInputs.eating,
          sleep: goalInputs.sleep,
      });
      console.log('Goal inputs saved successfully');
  } catch (error) {
      console.error('Error saving goal inputs:', error);
  }
};
const saveBehaviorInputs = async () => {
  try {
      await axios.post(`${DATABASE_URL}/saveBehaviorInputs`, {
          userId: user._id, // Make sure to replace this with the actual user ID
          activity: behaviorInputs.activity,
          screentime: behaviorInputs.screentime,
          eating: behaviorInputs.eating,
          sleep: behaviorInputs.sleep,
      });
      console.log('Behavior inputs saved successfully');
  } catch (error) {
      console.error('Error saving behavior inputs:', error);
  }
};




const email = user.email;

const handleSubmit = async (event, goalsData, email) => {
  event.preventDefault();
  try {
    const response = await axios.get(`${DATABASE_URL}/user`, {
      params: { email },
    });

    const newEmailData = {
      subject: "Project ProudMe Daily Goal Update",
      to: email,
      text: `Hi ${response.data.firstName},\n\nHere's an update on your goals today:\n\n` +
          `🌟 **Activity Goal**: ${goalsData.activityGoal[0].divInfo1}\n` +
          `- Goal Value: ${goalsData.activityGoal[0].goalValue}\n` +
          `- Recommended Value: ${goalsData.activityGoal[0].recommendedValue}\n` +
          `- Feedback: ${goalsData.activityGoal[0].goalValue > goalsData.activityGoal[0].recommendedValue ? "Great job on meeting your recommended activity goal!" : "let's try to do more excersize tomorrow!"}\n\n` +
          
          `🌟 **Screen Time Goal**: ${goalsData.screentimeGoal[0].divInfo1}\n` +
          `- Goal Value: ${goalsData.screentimeGoal[0].goalValue}\n` +
          `- Recommended Value: ${goalsData.screentimeGoal[0].recommendedValue}\n` +
          `- Feedback: ${goalsData.screentimeGoal[0].goalValue < goalsData.screentimeGoal[0].recommendedValue ? "Great job on limiting you screen time!" : "let's try using the electronics less tomorrow!"}\n\n` +
  
          `🌟 **Eating Goal**: ${goalsData.eatingGoal[0].divInfo1}\n` +
          `- Goal Value: ${goalsData.eatingGoal[0].goalValue}\n` +
          `- Recommended Value: ${goalsData.eatingGoal[0].recommendedValue}\n` +
          `- Feedback: ${goalsData.eatingGoal[0].goalValue > goalsData.eatingGoal[0].recommendedValue ? "Great job on eating a lot of healthy fruits and vegetables!" : "Remember to eat more vegetables"}\n\n` +
  
          `🌟 **Sleep Goal**: ${goalsData.sleepGoal[0].divInfo1}\n` +
          `- Goal Value: ${goalsData.sleepGoal[0].goalValue}\n` +
          `- Recommended Value: ${goalsData.sleepGoal[0].recommendedValue}\n` +
          `- Feedback: ${goalsData.sleepGoal[0].goalValue > goalsData.sleepGoal[0].recommendedValue ? "Great job on meeting your recommended sleep time" : "remember sleep is very important, try to sleep more tmr"}\n\n` +
          
          "You're doing great! Keep up the hard work, and remember each small step counts toward a healthy lifestyle!",
  };
  

    await axios.post(`${DATABASE_URL}/send-email`, newEmailData);
  } catch (error) {
    console.error(error);
  }
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
      {/* phone version */}
      {(ismobile &&
        <Stack direction="row" spacing={2} justifyContent="flex-end">
          <div style={{ opacity: 1 }}>

            <Button
              ref={anchorRef}
              id="composition-button"
              aria-controls={open ? 'composition-menu' : undefined}
              aria-expanded={open ? 'true' : undefined}
              aria-haspopup="true"
              onClick={handleToggle}
              style={{
                marginTop: '10px',
                padding: '12px 24px',
                fontSize: '1.2rem',
              }}
            >
              journal
            </Button>
            <Popper
              open={open}
              anchorEl={anchorRef.current}
              role={undefined}
              placement="bottom-start"
              transition
              disablePortal
              style={{
                marginTop: '10px',
                padding: '12px 24px',
                fontSize: '1.2rem',
                opacity: 1,
                zIndex: "10000"
              }}
            >
              {({ TransitionProps, placement }) => (
                <Grow
                  {...TransitionProps}
                  style={{
                    transformOrigin:
                      placement === 'bottom-start' ? 'left top' : 'left bottom',
                  }}
                >
                  <Paper style={{ opacity: 1 }}>
                    <ClickAwayListener onClickAway={handleClose}>
                      <MenuList
                        autoFocusItem={open}
                        id="composition-menu"
                        aria-labelledby="composition-button"
                        onKeyDown={handleListKeyDown}
                        style={{
                          backgroundColor: 'white',
                          opacity: 1,
                        }}
                      >
                        <MenuItem onClick={handleClose} style={{ zIndex: 1000 }}>
                          <Link to="/journal/activity">
                            Physical Activity
                          </Link>
                        </MenuItem>
                        <MenuItem onClick={handleClose} style={{ zIndex: 1000 }}>
                          <Link to="screen">
                            Screen Time
                          </Link>
                        </MenuItem>
                        <MenuItem onClick={handleClose}>
                          <Link to="eat">
                            Eating
                          </Link>
                        </MenuItem>
                        <MenuItem onClick={handleClose}>
                          <Link to="sleep">
                            sleep
                          </Link>
                        </MenuItem>
                      </MenuList>
                    </ClickAwayListener>
                  </Paper>
                </Grow>
              )}
            </Popper>
          </div>
          <Outlet />
        </Stack>
      )}

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
                          <strong>Selected:</strong>
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
                            {/* Inline calculation of expected sleep duration */}
                            Expected Sleep: {(() => {
                              const bedTime = goalInputs.sleep["Expected Sleep"].bedtime;
                              const wakeUpTime = goalInputs.sleep["Expected Sleep"].wakeUpTime;

                              if (!bedTime || !wakeUpTime) return "0h 0m";

                              const [bedHour, bedMinute] = bedTime.split(":").map(Number);
                              const [wakeHour, wakeMinute] = wakeUpTime.split(":").map(Number);

                              let totalMinutes = (wakeHour * 60 + wakeMinute) - (bedHour * 60 + bedMinute);
                              if (totalMinutes < 0) totalMinutes += 24 * 60;

                              const hours = Math.floor(totalMinutes / 60);
                              const minutes = totalMinutes % 60;

                              return `${hours}h ${minutes}m`;
                            })()} /

                            {/* Inline calculation of tracked sleep duration */}
                            Tracked Sleep: {(() => {
                              const bedTime = behaviorInputs.sleep["Actual Sleep"].bedtime;
                              const wakeUpTime = behaviorInputs.sleep["Actual Sleep"].wakeUpTime;

                              if (!bedTime || !wakeUpTime) return "8h 0m";

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

      {/* Physical Dialog */}
      <Dialog
        open={popupOpen.activity}
        onClose={() => handleClosePopup("activity")}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Set Physical Activity Goals and Track Behavior</DialogTitle>
        <DialogContent>
          <p><strong>{currentDateTime}</strong></p>
          {/* Predefined activities */}
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
                          label="Hours"
                          type="number"
                          name={`${item}-goal-hours`}
                          value={goalInputs.activity[item]?.hours || ""}
                          onChange={(event) => {
                            const newGoal = 60 * event.target.value;
                            handleInputChange(event, item, "hours", "goal", "activity");
                            setActivityGoal((prevActivityGoal) => {
                              const updatedActivityGoal = prevActivityGoal.map((goal) => {
                                return {
                                  ...goal,
                                  goalValue: newGoal,
                                };
                              });
                              return updatedActivityGoal;
                            });
                          }}
                          fullWidth
                          size="small"
                          style={{ width: '60px' }}
                          inputProps={{ min: "0" }}
                        />
                      </Grid>
                      <Grid item xs={2} style={{ paddingLeft: '65px', paddingRight: '5px' }}>
                        <TextField
                          label="Minutes"
                          type="number"
                          name={`${item}-goal-minutes`}
                          value={goalInputs.activity[item]?.minutes || ""}
                          onChange={(event) => {
                            const newGoal = 60 * event.target.value;
                            handleInputChange(event, item, "minutes", "goal", "activity");
                            setActivityGoal((prevActivityGoal) => {
                              const updatedActivityGoal = prevActivityGoal.map((goal) => {
                                return {
                                  ...goal,
                                  goalValue: newGoal,
                                };
                              });
                              return updatedActivityGoal;
                            });
                          }}
                          fullWidth
                          size="small"
                          style={{ width: '60px' }}
                          inputProps={{ min: "0" }}
                        />
                      </Grid>
                      <Grid item xs={1} style={{ paddingLeft: '150px' }}>
                        <TextField
                          label="Hours"
                          type="number"
                          name={`${item}-behavior-hours`}
                          value={behaviorInputs.activity[item]?.hours || ""}
                          onChange={(event) => {
                            const newGoal = 60 * event.target.value;
                            handleInputChange(event, item, "hours", "behaviour", "activity");
                            setActivityGoal((prevActivityGoal) => {
                              const updatedActivityGoal = prevActivityGoal.map((goal) => {
                                return {
                                  ...goal,
                                  behaviorValue: newGoal,
                                };
                              });
                              return updatedActivityGoal;
                            });
                          }}
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
                          name={`${item}-behavior-minutes`}
                          value={behaviorInputs.activity[item]?.minutes || ""}
                          onChange={(event) => {
                            const newGoal = 60 * event.target.value;
                            handleInputChange(event, item, "minutes", "behaviour", "activity");
                            setActivityGoal((prevActivityGoal) => {
                              const updatedActivityGoal = prevActivityGoal.map((goal) => {
                                return {
                                  ...goal,
                                  behaviorValue: newGoal,
                                };
                              });
                              return updatedActivityGoal;
                            });
                          }}
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
              <StyledButton
                onClick={() => handleAddItemClick(activity.category)}
                variant="contained"
                color="primary"
              >
                Add New {activity.category}
              </StyledButton>
              <br />
              {(activity.category == "Strenuous Exercise") ?
                <TextField
                  value={newStrenuous}
                  onChange={(e) => setStrenuous(e.target.value)}
                  variant="outlined"
                  size="small"
                  style={{ marginTop: '10px', marginRight: '10px' }}
                /> : (activity.category == "Moderate Exercise") ?
                  <TextField
                    value={newModerate}
                    onChange={(e) => setModerate(e.target.value)}
                    variant="outlined"
                    size="small"
                    style={{ marginTop: '10px', marginRight: '10px' }}
                  /> :
                  <TextField
                    value={newMild}
                    onChange={(e) => setMild(e.target.value)}
                    variant="outlined"
                    size="small"
                    style={{ marginTop: '10px', marginRight: '10px' }}
                  />
              }
            </div>
          ))}

        </DialogContent>
        <DialogActions>
          <StyledButton onClick={() => handleDone("activity")} color="primary">
            Done
          </StyledButton>
        </DialogActions>
      </Dialog>



      {/* Screen Time Dialog */}
      <Dialog
        open={popupOpen.screentime}
        onClose={() => handleClosePopup("screentime")}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Set Screentime Goals and Track Behavior</DialogTitle>
        <DialogContent>
          <p><strong>{currentDateTime}</strong></p>
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
                          label="Hours"
                          type="number"
                          name={`${item}-goal-hours`}
                          value={goalInputs.screentime[item]?.hours || ""}
                          onChange={(event) => {
                            const newGoal = 60 * event.target.value;
                            handleInputChange(event, item, "hours", "goal", "screentime");
                            setScreentimeGoal((prevScreentimeGoal) => {
                              const updatedScreentimeGoal = prevScreentimeGoal.map((goal) => {
                                return {
                                  ...goal,
                                  goalValue: newGoal,
                                };
                              });
                              return updatedScreentimeGoal;
                            });
                          }}
                          fullWidth
                          size="small"
                          style={{ width: '60px' }}
                          inputProps={{ min: "0" }}
                        />
                      </Grid>
                      <Grid item xs={2} style={{ paddingLeft: '65px', paddingRight: '5px' }}>
                        <TextField
                          label="Minutes"
                          type="number"
                          name={`${item}-goal-minutes`}
                          value={goalInputs.screentime[item]?.minutes || ""}
                          onChange={(event) => {
                            const newGoal = event.target.value;
                            handleInputChange(event, item, "minutes", "goal", "screentime");
                            setScreentimeGoal((prevScreentimeGoal) => {
                              const updatedScreentimeGoal = prevScreentimeGoal.map((goal) => {
                                return {
                                  ...goal,
                                  goalValue: newGoal,
                                };
                              });
                              return updatedScreentimeGoal;
                            });
                          }}
                          fullWidth
                          size="small"
                          style={{ width: '60px' }}
                          inputProps={{ min: "0" }}
                        />
                      </Grid>
                      <Grid item xs={1} style={{ paddingLeft: '150px' }}>
                        <TextField
                          label="Hours"
                          type="number"
                          name={`${item}-behavior-hours`}
                          value={behaviorInputs.screentime[item]?.hours || ""}
                          onChange={(event) => {
                            const newGoal = 60 * event.target.value;
                            handleInputChange(event, item, "hours", "behaviour", "screentime");
                            setScreentimeGoal((prevScreentimeGoal) => {
                              const updatedScreentimeGoal = prevScreentimeGoal.map((goal) => {
                                return {
                                  ...goal,
                                  behaviorValue: newGoal,
                                };
                              });
                              return updatedScreentimeGoal;
                            });
                          }}
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
                          name={`${item}-behavior-minutes`}
                          value={behaviorInputs.screentime[item]?.minutes || ""}
                          onChange={(event) => {
                            const newGoal = event.target.value;
                            handleInputChange(event, item, "minutes", "behaviour", "screentime");
                            setScreentimeGoal((prevScreentimeGoal) => {
                              const updatedScreentimeGoal = prevScreentimeGoal.map((goal) => {
                                return {
                                  ...goal,
                                  behaviorValue: newGoal,
                                };
                              });
                              return updatedScreentimeGoal;
                            });
                          }}
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
              <StyledButton
                onClick={() => handleAddItemClick(activity.category)}
                variant="contained"
                color="primary"
              >
                Add New {activity.category}
              </StyledButton>
              <br />
              {(activity.category == "Gaming and Video Chatting") ?
                <TextField
                  value={newGame}
                  onChange={(e) => setGame(e.target.value)}
                  variant="outlined"
                  size="small"
                  style={{ marginTop: '10px', marginRight: '10px' }}
                /> :
                <TextField
                  value={newAcademic}
                  onChange={(e) => setAcademic(e.target.value)}
                  variant="outlined"
                  size="small"
                  style={{ marginTop: '10px', marginRight: '10px' }}
                />
              }
            </div>
          ))}
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
          <p><strong>{currentDateTime}</strong></p>
          {fruitsAndVegetables.map((category) => (
            <div key={category.category} style={{ marginBottom: "10px" }}>
              <h3>{category.category}</h3>
              <Grid container spacing={1} style={{ marginTop: '-5px' }}>
                <Grid item xs={2}></Grid>
                <Grid item xs={5} style={{ textAlign: "center", fontWeight: "bold" }}>
                  What I Will Eat
                </Grid>
                <Grid item xs={5} style={{ textAlign: "center", fontWeight: "bold" }}>
                  What I Ate
                </Grid>
              </Grid>
              {category.items.map((item) => (
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
                          onChange={(event) => {
                            const newGoal = event.target.value;
                            handleInputChange(event, item, "servings", "goal", "eating");
                            setEatingGoal((prevEatingGoal) => {
                              const updatedEatingGoal = prevEatingGoal.map((goal) => {
                                return {
                                  ...goal,
                                  goalValue: newGoal,
                                };
                              });
                              return updatedEatingGoal;
                            });
                          }}
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
                          onChange={(event) => {
                            const newGoal = event.target.value;
                            handleInputChange(event, item, "servings", "behaviour", "eating");
                            setEatingGoal((prevEatingGoal) => {
                              const updatedEatingGoal = prevEatingGoal.map((goal) => {
                                return {
                                  ...goal,
                                  behaviorValue: newGoal,
                                };
                              });
                              return updatedEatingGoal;
                            });
                          }}
                          fullWidth
                          size="small"
                          style={{ width: '100px' }}
                        />
                      </Grid>
                    </>
                  )}
                </Grid>
              ))}
              <StyledButton
                onClick={() => handleAddItemClick(category.category)}
                variant="contained"
                color="primary"
              >
                Add New {category.category}
              </StyledButton>
              <br />
              {(category.category == "Vegetables") ?
                <TextField
                  value={newVegetable}
                  onChange={(e) => setNewVegetable(e.target.value)}
                  variant="outlined"
                  size="small"
                  style={{ marginTop: '10px', marginRight: '10px' }}
                /> :
                <TextField
                  value={newFruit}
                  onChange={(e) => setNewFruit(e.target.value)}
                  variant="outlined"
                  size="small"
                  style={{ marginTop: '10px', marginRight: '10px' }}
                />
              }
            </div>
          ))}

          {/* Custom "Other" Eating Activity */}


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
          <p><strong>{currentDateTime}</strong></p> {/* Display current date and time */}
          <div style={{ marginBottom: "10px" }}>
            <Grid container spacing={2} alignItems="center">
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
                  {/* Expected and Actual Sleep Times */}
                  <Grid item xs={6}>
                    <div>
                      <strong>Expected Bedtime</strong>
                      <input
                        type="time"
                        name="bedTime"
                        value={goalInputs.sleep["Expected Sleep"].bedtime || "22:00"}
                        onFocus={(event) => event.target.showPicker && event.target.showPicker()}
                        onChange={(event) => {
                          handleInputChange(event, "Expected Sleep", "bedTime", "goal", "sleep");
                          setGoalInputs((prev) => ({
                            ...prev,
                            sleep: {
                              ...prev.sleep,
                              "Expected Sleep": {
                                ...prev.sleep["Expected Sleep"],
                                bedtime: event.target.value,
                              },
                            },
                          }));
                        }}
                        style={{
                          width: '100%',
                          padding: '8px',
                          fontSize: '16px',
                          borderRadius: '4px',
                          border: '1px solid #ccc',
                        }}
                      />
                    </div>
                    <div style={{ marginTop: "10px" }}>
                      <strong>Expected Wake-up Time</strong>
                      <input
                        type="time"
                        name="wakeUpTime"
                        value={goalInputs.sleep["Expected Sleep"].wakeUpTime || "06:00"}
                        onFocus={(event) => event.target.showPicker && event.target.showPicker()}
                        onChange={(event) => {
                          handleInputChange(event, "Expected Sleep", "wakeUpTime", "goal", "sleep");
                          setGoalInputs((prev) => ({
                            ...prev,
                            sleep: {
                              ...prev.sleep,
                              "Expected Sleep": {
                                ...prev.sleep["Expected Sleep"],
                                wakeUpTime: event.target.value,
                              },
                            },
                          }));
                        }}
                        style={{
                          width: '100%',
                          padding: '8px',
                          fontSize: '16px',
                          borderRadius: '4px',
                          border: '1px solid #ccc',
                        }}
                      />
                    </div>
                  </Grid>

                  <Grid item xs={6}>
                    <div>
                      <strong>Actual Bedtime</strong>
                      <input
                        type="time"
                        name="bedTime"
                        value={behaviorInputs.sleep["Actual Sleep"].bedtime || "22:00"}
                        onFocus={(event) => event.target.showPicker && event.target.showPicker()}
                        onChange={(event) => {
                          handleInputChange(event, "Actual Sleep", "bedTime", "behavior", "sleep");
                          setBehaviorInputs((prev) => ({
                            ...prev,
                            sleep: {
                              ...prev.sleep,
                              "Actual Sleep": {
                                ...prev.sleep["Actual Sleep"],
                                bedtime: event.target.value,
                              },
                            },
                          }));
                        }}
                        style={{
                          width: '100%',
                          padding: '8px',
                          fontSize: '16px',
                          borderRadius: '4px',
                          border: '1px solid #ccc',
                        }}
                      />
                    </div>
                    <div style={{ marginTop: "10px" }}>
                      <strong>Actual Wake-up Time</strong>
                      <input
                        type="time"
                        name="wakeUpTime"
                        value={behaviorInputs.sleep["Actual Sleep"].wakeUpTime || "06:00"}
                        onFocus={(event) => event.target.showPicker && event.target.showPicker()}
                        onChange={(event) => {
                          handleInputChange(event, "Actual Sleep", "wakeUpTime", "behavior", "sleep");
                          setBehaviorInputs((prev) => ({
                            ...prev,
                            sleep: {
                              ...prev.sleep,
                              "Actual Sleep": {
                                ...prev.sleep["Actual Sleep"],
                                wakeUpTime: event.target.value,
                              },
                            },
                          }));
                        }}
                        style={{
                          width: '100%',
                          padding: '8px',
                          fontSize: '16px',
                          borderRadius: '4px',
                          border: '1px solid #ccc',
                        }}
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
          <StyledButton
            onClick={() => {
              setSleepGoal((prevSleepGoal) => {
                return prevSleepGoal.map((goal) => {
                  return {
                    ...goal,
                    goalValue: Math.floor(totalExpectedTime.sleep / 60),
                    behaviorValue: Math.floor(totalTrackedTime.sleep / 60),
                  };
                });
              });
              handleDone("sleep");
            }}
            color="primary"
          >
            Done
          </StyledButton>
        </DialogActions>
      </Dialog>
      <StyledButton onClick={(e) => handleSubmit(e, {
          activityGoal,
          screentimeGoal,
          eatingGoal,
          sleepGoal
          }, email)}>
      Send Daily Goal Update Email
    </StyledButton>

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

