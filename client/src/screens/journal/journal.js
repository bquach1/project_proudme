import React, { useState } from 'react';
import '../../css/journal.css';
import withAuth from '../../components/auth/withAuth';

import { CSVLink } from 'react-csv';
import Calendar from "../../components/calendar.js";
import { Modal, LinearProgress, CircularProgress, Input, Button, TextField } from '@mui/material';

import { IoIosArrowUp, IoIosArrowDown } from 'react-icons/io';

const JournalScreen = () => {

  const [goalOpen, setGoalOpen] = useState(false);
  const [reflectOpen, setReflectOpen] = useState(false);
  const [selectedGoalReflectionIndex, setSelectedGoalReflectionIndex] = useState(-1);

  const [rightScreenMode, setRightScreenMode] = useState('');
  const [reflectionPage, setReflectionPage] = useState('Default');
  const [editPage, setEditPage] = useState('General');
  const [formCompletion, setFormCompletion] = useState(0);

  var dateToday = new Date(),
    month = dateToday.getMonth(),
    day = dateToday.getDate(),
    year = dateToday.getFullYear(),
    date = (month + 1) + '/' + day + '/' + year;

  var defaultEndDate = new Date();
  defaultEndDate.setDate(defaultEndDate.getDate() + 14);

  if (defaultEndDate.getMonth !== dateToday.getMonth) {
    var defaultEndDay = (defaultEndDate.getMonth() + 2) + '/' + defaultEndDate.getDate() + '/' + year;
  }
  else {
    defaultEndDay = (defaultEndDate.getMonth() + 1) + '/' + defaultEndDate.getDate() + '/' + year;
  }

  const [goalArray, setGoalArray] = useState([
    {
      id: 0,
      goalType: "activity",
      goalValue: 0,
      divInfo1: "Get at least 60 minutes of physical activity per day",
      divInfo2: "Do exercises like running or playing sports for at least an hour a day.",
      reflection: "",
      startDate: date,
      endDate: defaultEndDay,
      startDateUnformatted: dateToday,
      endDateUnformatted: defaultEndDate
    },
    {
      id: 1,
      goalType: "screentime",
      goalValue: 0,
      divInfo1: "Get at least 60 minutes of physical activity per day",
      divInfo2: "Do exercises like running or playing sports for at least an hour a day.",
      reflection: "",
      startDate: date,
      endDate: defaultEndDay,
      startDateUnformatted: dateToday,
      endDateUnformatted: defaultEndDate
    },
    {
      id: 2,
      goalType: "eating",
      goalValue: 0,
      divInfo1: "Eat 5 or more servings of fruits and/or vegetables",
      divInfo2: "Reach target increments for servings of healthy foods.",
      reflection: "",
      startDate: date,
      endDate: defaultEndDay,
      startDateUnformatted: dateToday,
      endDateUnformatted: defaultEndDate
    },
    {
      id: 3,
      goalType: "activity",
      goalValue: 0,
      divInfo1: "Get at least 60 minutes of physical activity per day",
      divInfo2: "Do exercises like running or playing sports for at least an hour a day.",
      reflection: "",
      startDate: date,
      endDate: defaultEndDay,
      startDateUnformatted: dateToday,
      endDateUnformatted: defaultEndDate
    }
  ]);
  const [goalCount, setGoalCount] = useState(0);
  const [behaviorCount, setBehaviorCount] = useState(0);
  const [inputGoalValue, setInputGoalValue] = useState(false);

  const [behaviorValues, setBehaviorValues] = useState([
    {
      behaviorId: 0,
      behaviorValue: 0,
      loggedDate: date
    },
    {
      behaviorId: 1,
      behaviorValue: 0,
      loggedDate: date
    },
    {
      behaviorId: 2,
      behaviorValue: 0,
      loggedDate: date
    },
    {
      behaviorId: 3,
      behaviorValue: 0,
      loggedDate: date
    },
  ]);

  const [behaviorData, setBehaviorData] = useState([]);
  const [dataList, setDataList] = useState([]);

  var renderedDate = new Date(),
    renderedMonth = renderedDate.getMonth(),
    renderedDay = renderedDate.getDate(),
    renderedYear = renderedDate.getFullYear(),
    renderedDateToday = (renderedMonth + 1) + '/' + renderedDay + '/' + renderedYear;

  const handleEnter = (event) => {
    if (event.key === "Enter") {
      setInputGoalValue(false);
    }
  }

  const handleBlur = (event) => {
    setInputGoalValue(false);
  }

  const handleOpenGoalModal = () => {
    setGoalOpen(true);
  };

  const handleCloseGoalModal = () => {
    setGoalOpen(false);
  };

  const handleReflectionClick = (index) => {
    setSelectedGoalReflectionIndex(index);
    setReflectOpen(true);
  };

  const handleCloseReflectModal = () => {
    setSelectedGoalReflectionIndex(-1);
    setReflectOpen(false);
    setReflectionPage('');
  };

  const handleGoalCountChange = () => {
    setGoalCount(goalCount + 1);
  }

  const handleBehaviorCountChange = () => {
    setBehaviorCount(behaviorCount + 1);
  }

  const GoalCSV = () => {
    const headers = [
      { label: "Goal Data ID", key: "goalDataId" },
      { label: "Goal Details", key: "goalDetails" },
      { label: "Goal Quantity", key: "goalQuantity" },
      { label: "Goal Reflection", key: "goalReflection" },
      { label: "Type of Goal", key: "goalType" },
      { label: "Start Date", key: "startDate" },
      { label: "End Date", key: "endDate" }
    ];

    return (
      <div>
        <CSVLink data={dataList} headers={headers} filename='goaldata.csv'>Download Goal Data</CSVLink>
      </div>
    )
  }

  const BehaviorTrackingCSV = () => {
    const behaviorHeaders = [
      { label: "Behavior ID", key: "behaviorId" },
      { label: "Goal Data ID", key: "behaviorDataId" },
      { label: "Date", key: "loggedDate" },
      { label: "Behavior Quantity", key: "behaviorValue" },
    ];

    return (
      <div>
        <CSVLink data={behaviorData} headers={behaviorHeaders}
          filename='behaviordata.csv'>Download Behavior Tracking Data</CSVLink>
      </div>
    )
  }

  function addGoal(type) {
    var dateToday = new Date(),
      month = dateToday.getMonth(),
      day = dateToday.getDate(),
      year = dateToday.getFullYear(),
      date = (month + 1) + '/' + day + '/' + year;

    var defaultEndDate = new Date();
    defaultEndDate.setDate(defaultEndDate.getDate() + 14);

    if (defaultEndDate.getMonth !== dateToday.getMonth) {
      var defaultEndDay = (defaultEndDate.getMonth() + 2) + '/' + defaultEndDate.getDate() + '/' + year;
    }
    else {
      defaultEndDay = (defaultEndDate.getMonth() + 1) + '/' + defaultEndDate.getDate() + '/' + year;
    }

    const newGoal = {
      id: goalCount,
      goalType: type,
      goalValue: 0,
      divInfo1: "Eat 5 or more servings of fruits and/or vegetables",
      divInfo2: "Reach target increments for servings of healthy foods.",
      reflection: "",
      startDate: date,
      endDate: defaultEndDay,
      startDateUnformatted: dateToday,
      endDateUnformatted: defaultEndDate
    }

    const newBehavior = {
      behaviorId: behaviorCount,
      goalId: goalCount,
      behaviorValue: "",
      loggedDate: date
    }

    switch (type) {
      case "Eating":
        newGoal.goalValue = 5;
        newGoal.divInfo1 = "Eat 5 or more servings of fruits and/or vegetables";
        newGoal.divInfo2 = "Reach target increments for servings of healthy foods.";
        break;
      case "Activity":
        newGoal.goalValue = 60;
        newGoal.divInfo1 = "Get at least 60 minutes of physical activity per day";
        newGoal.divInfo2 = "Do exercises like running or playing sports for at least an hour a day.";
        break;
      case "Screentime":
        newGoal.goalValue = 2;
        newGoal.divInfo1 = "Limit screentime to 2 hours a day";
        newGoal.divInfo2 = "Use devices like phones, laptops, and TV's less.";
        break;
      case "Sleep":
        newGoal.goalValue = 9;
        newGoal.divInfo1 = "Sleep at least 9 hours a night";
        newGoal.divInfo2 = "Get anywhere from 9-11 hours of sleep a night to feel the best.";
        break;
      default:
    }

    setGoalArray([...goalArray, newGoal]);
    setBehaviorValues([...behaviorValues, newBehavior]);
    handleGoalCountChange();
    handleBehaviorCountChange();
    setRightScreenMode("Goal Selected Mode");

    const newData = [...dataList, {
      "goalDataId": newGoal.id,
      "goalDetails": newGoal.divInfo1, "goalQuantity": newGoal.goalValue,
      "goalReflection": newGoal.reflection, "goalType": "Eating", "startDate": newGoal.startDate,
      "endDate": newGoal.endDate
    }];

    const newBehaviorData = [...behaviorData, {
      "behaviorId": newBehavior.behaviorId,
      "behaviorDataId": newBehavior.goalId,
      "behaviorValue": newBehavior.behaviorValue,
      "loggedDate": newBehavior.loggedDate
    }]

    setDataList(newData);
    setBehaviorData(newBehaviorData);
  }

  function updateGoalValue(id, newQuantity) {
    setGoalArray(prevGoals =>
      prevGoals.map(goal => {
        if (goal.id === id) {
          return { ...goal, goalValue: +newQuantity };
        }
        return goal;
      })
    );
    setDataList(prevGoals =>
      prevGoals.map(goal => {
        if (goal.goalDataId === id) {
          return { ...goal, "goalQuantity": +newQuantity };
        }
        return goal;
      })
    );
  }

  function updateGoal(id, newDescription) {
    setGoalArray(prevGoals =>
      prevGoals.map(goal => {
        if (goal.id === id) {
          return { ...goal, divInfo1: newDescription };
        }
        return goal;
      })
    );
    setDataList(prevGoals =>
      prevGoals.map(goal => {
        if (goal.goalDataId === id) {
          return { ...goal, "goal": newDescription };
        }
        return goal;
      })
    );
  }

  function updateGoalReflection(id, newReflection) {
    setGoalArray(prevGoals =>
      prevGoals.map(goal => {
        if (goal.id === id) {
          return { ...goal, reflection: newReflection };
        }
        return goal;
      })
    );
    setDataList(prevGoals =>
      prevGoals.map(goal => {
        if (goal.goalDataId === id) {
          return { ...goal, "goalReflection": newReflection };
        }
        return goal;
      })
    );
  }

  function updateBehaviorValue(id, newBehaviorValue) {

    var loggingDate = new Date(),
      month = loggingDate.getMonth(),
      day = loggingDate.getDate(),
      year = loggingDate.getFullYear(),
      date = (month + 1) + '/' + day + '/' + year;

      setBehaviorValues(prevBehaviors =>
        prevBehaviors.map(behavior => {
          if (behavior.behaviorId === id) {
            return { ...behavior, behaviorValue: +newBehaviorValue };
          }
          console.log(behaviorValues);
          return behavior;
        })
      );

      // behaviorValues.map(updatedBehavior => {
      //   if (updatedBehavior.loggedDate === date) {
      //     if (updatedBehavior.goalId === id) {
      //       var overridenBehavior = { ...updatedBehavior, behaviorValue: +newBehaviorValue };
      //       setBehaviorValues(behaviorValues.map((behavior) => behavior.loggedDate === date
      //         && behavior.goalId === id ? overridenBehavior : behavior));
      //     }
      //     return updatedBehavior;
      //   }
      //   else {
      //     handleBehaviorCountChange();
      //     const newBehavior = {
      //       behaviorId: behaviorCount,
      //       goalId: updatedBehavior.goalId,
      //       behaviorValue: +newBehaviorValue,
      //       loggedDate: date
      //     }
      //     if (updatedBehavior.goalId === id) {
      //       setBehaviorValues([...behaviorValues, newBehavior]);
      //     }
      //   }

    // behaviorValues.map(updatedBehavior => {
    //   if (updatedBehavior.loggedDate === date) {
    //     if (updatedBehavior.goalId === id) {
    //       var overridenBehavior = { ...updatedBehavior, "behaviorValue": +newBehaviorValue };
    //       setBehaviorData(behaviorData.map((behavior) => behavior.loggedDate === date
    //         && behavior.goalId === id ? overridenBehavior : behavior));
    //     }
    //     return updatedBehavior;
    //   }
    //   else {
    //     handleBehaviorCountChange();
    //     const newBehavior = {
    //       "behaviorId": behaviorCount,
    //       "behaviorDataId": updatedBehavior.goalId,
    //       "behaviorValue": +newBehaviorValue,
    //       "loggedDate": date
    //     }
    //     if (updatedBehavior.goalId === id) {
    //       console.log(behaviorValues);
    //       console.log(newBehavior.loggedDate);
    //       setBehaviorData([...behaviorData, newBehavior]);
    //     }
    //   }
    //   return updatedBehavior;
    // });
  };

  function updateGoalDates(id, newStartDate, newEndDate) {
    setGoalArray(prevGoals =>
      prevGoals.map(goal => {
        if (goal.id === id) {
          return {
            ...goal,
            startDateUnformatted: newStartDate,
            endDateUnformatted: newEndDate
          }
        }
        return goal;
      }))
    setDataList(prevGoals =>
      prevGoals.map(goal => {
        if (goal.goalDataId === id) {
          return { ...goal, "startDate": newStartDate, "endDate": newEndDate };
        }
        return goal;
      })
    );
  }

  return (
    <div className="journal">
      <h1 className="title">My Journal</h1>
      <div className="journalWrapper">
        <img className="journalCover" src={require('../../components/images/journal/journal_cover.png')}
          alt="Journal cover screen wrapper" />
        <img onClick={() => setRightScreenMode("")} className="achievements-tab" src={require('../../components/images/journal/achievements_tab.png')}
          alt="Achievements bookmark tab" />
        <div className="leftPageWrapper">
          {rightScreenMode === "Goal Selected Mode" ?
            <div style={styles.goalScreen}>

              <div style={styles.goalRow}>
                <h2 style={styles.goalHeader}>Health Behaviors</h2>
                <h2 style={styles.goalHeader}>Set My Goal</h2>
                <h2 style={styles.goalHeader}>Track My Behavior</h2>
              </div>

              <div style={styles.goalRow}>
                <div style={styles.leftBox}>
                  <div style={styles.titleGroup}>
                    <img style={styles.activityIcon} src={require('../../components/images/journal/activity_goals.png')} alt="Activity goals icon on activity goals page" />
                    <h2 style={styles.goalLabel}>Do</h2>
                  </div>
                  {/* <p>Exercise, do chores, play sports, and other physical activities.</p> */}
                </div>
                {inputGoalValue === false ?
                  <TextField style={styles.inputBox} placeholder="Target amount"
                    type="number"
                    onBlur={handleBlur}
                    onKeyDown={handleEnter}
                    onChange={(e) => {
                      updateGoalValue(0, e.target.value);
                    }} />
                  :
                  <h2>{goalArray[0].goalValue}</h2>
                }
                <TextField style={styles.inputBox} placeholder="Daily progress"
                  type="number"
                  onChange={(e) => {
                    updateBehaviorValue(0, e.target.value);
                  }} />
              </div>

              <div style={styles.goalRow}>
                <div style={styles.titleGroup}>
                  <img style={styles.screentimeIcon} src={require('../../components/images/journal/tablet_icon.png')} alt="Tablet for screentime goals" />
                  <h2 style={styles.goalLabel}>View</h2>
                </div>
                {inputGoalValue === false ?
                  <TextField style={styles.inputBox} placeholder="Target amount"
                    type="number"
                    onChange={(e) => {
                      updateGoalValue(1, e.target.value);
                    }} />
                  :
                  <h2>{goalArray[1].goalValue}</h2>
                }

                <TextField style={styles.inputBox} placeholder="Daily progress"
                  type="number"
                  onChange={(e) => {
                    updateBehaviorValue(1, e.target.value);
                  }} />
              </div>

              <div style={styles.goalRow}>
                <div style={styles.titleGroup}>
                  <img style={styles.eatingIcon} src={require('../../components/images/journal/apple.png')} alt="Apple for servings goal" />
                  <h2 style={styles.goalLabel}>Chew</h2>
                </div>

                {inputGoalValue === false ?
                  <TextField style={styles.inputBox} placeholder="Target amount"
                    type="number"
                    onChange={(e) => {
                      updateGoalValue(2, e.target.value);
                    }} />
                  :
                  <h2>{goalArray[2].goalValue}</h2>
                }

                <TextField style={styles.inputBox} placeholder="Daily progress"
                  type="number"
                  onChange={(e) => {
                    updateBehaviorValue(2, e.target.value);
                  }} />
              </div>

              <div style={styles.goalRow}>

                <div style={styles.titleGroup}>
                  <img style={styles.sleepIcon} src={require('../../components/images/journal/pillow_icon.png')} alt="Crossed out candy icon for avoid sugary food" />
                  <h2 style={styles.goalLabel}>Sleep</h2>
                </div>

                {inputGoalValue === false ?
                  <TextField style={styles.inputBox} placeholder="Target amount"
                    type="number"
                    onChange={(e) => {
                      updateGoalValue(3, e.target.value);
                    }} />
                  :
                  <h2>{goalArray[3].goalValue}</h2>
                }

                <TextField style={styles.inputBox} placeholder="Daily progress"
                  type="number"
                  onChange={(e) => {
                    updateBehaviorValue(3, e.target.value);
                  }} />
              </div>
            </div>
            : rightScreenMode === "Progress Mode" ?
              <div className="goal-box">
                <h1>Progress Checking Mode</h1>
                {goalCount === 0 ?
                  <h4>You're not currently working on any goals. Add some from the goal page!</h4>
                  : goalCount === 1 ?
                    <h4>You're currently working on 1 goal.</h4>
                    :
                    <h4>You're currently working on {goalCount} goals.</h4>
                }
              </div>
              :
              <div className="goal-box">
                <h1 className="journal-title">My</h1>
                <div className="recommendation-container">
                  <div className="text-container">
                    <div className="eating-goal-image">
                      <img src={require('../../components/images/journal/apple.png')} alt="Apple for servings goal" />
                    </div>

                    <div className="selection-container">
                      <h3 className="eating-goal-header">Eat 5 servings of fruits/vegetables</h3>
                      <p>Eat fruits and vegetables for a more balanced diet.</p>
                    </div>
                  </div>

                  <div className="button-container">
                    <Button style={styles.addGoalButton}
                      onClick={() => { addGoal('Eating') }}
                    >
                      Set My Goal
                    </Button>
                  </div>
                </div>

                <div className="recommendation-container">
                  <div className="text-container">
                    <div className="eating-goal-image">
                      <img className="activity" src={require('../../components/images/journal/activity_goals.png')} alt="Activity goals icon on activity goals page" />
                    </div>

                    <div className="selection-container">
                      <h3 className="eating-goal-header">Get an hour of physical activity a day</h3>
                      <p>Exercise to keep your body fit and healthy.</p>
                    </div>
                  </div>

                  <div className="button-container">
                    <Button style={styles.addGoalButton}
                      onClick={() => { addGoal('Activity') }}
                    >
                      Set My Goal
                    </Button>
                  </div>
                </div>

                <div className="recommendation-container">
                  <div className="text-container">
                    <div className="eating-goal-image">
                      <img src={require('../../components/images/journal/tablet_icon.png')} alt="Apple for servings goal" />
                    </div>

                    <div className="selection-container">
                      <h3 className="eating-goal-header">Limit screen time to 2 hours a day</h3>
                      <p>Keep screen time low and go outside to help your mind and eyes.</p>
                    </div>
                  </div>

                  <div className="button-container">
                    <Button style={styles.addGoalButton}
                      onClick={() => { addGoal('Screentime') }}
                    >
                      Set My Goal
                    </Button>
                  </div>
                </div>

                <div className="recommendation-container">
                  <div className="text-container">
                    <div className="eating-goal-image">
                      <img src={require('../../components/images/journal/pillow_icon.png')} alt="Crossed out candy icon for avoid sugary food" />
                    </div>

                    <div className="selection-container">
                      <h3 className="eating-goal-header">Get 9 hours of sleep a day</h3>
                      <p>Get good amounts of sleep to improve focus and lower health risks.</p>
                    </div>
                  </div>

                  <div className="button-container">
                    <Button style={styles.addGoalButton}
                      onClick={() => { addGoal('Sleep') }}
                    >
                      Set My Goal
                    </Button>
                  </div>
                </div>
              </div>
          }

          <img className="leftpage1" src={require('../../components/images/journal/right_page.png')}
            alt="First left-side page" />
          <img className="leftpage2" src={require('../../components/images/journal/right_page2.png')}
            alt="Second left-side page" />
          <img className="leftpage3" src={require('../../components/images/journal/right_page.png')}
            alt="Third left-side page" />
        </div>
        <img className="middle-line" src={require('../../components/images/journal/middle_line.png')} alt="Middle journal line" />
        <div className="rightPageWrapper">
          <img className="bookmark" src={require('../../components/images/journal/bookmark.png')} alt="Yellow bookmark icon" />
          <div style={styles.goalScreen}>

            <div style={styles.goalRow}>
              <h2 style={styles.goalHeader}>Your Feedback</h2>
              <h2 style={styles.goalHeader}>Reflect</h2>
            </div>
            <div style={styles.goalRow}>
              {behaviorValues[0].behaviorValue > goalArray[0].goalValue ?
                <h4 style={styles.feedback}>Great! I exceeded my goal!</h4>
                : behaviorValues[0].behaviorValue === goalArray[0].goalValue ?
                  <h4 style={styles.feedback}>Hooray! I reached my goal!</h4>
                  : behaviorValues[0].behaviorValue < goalArray[0].goalValue / 2 ?
                    <h4 style={styles.feedback}>I need to work harder to reach my goal!</h4>
                    : behaviorValues[0].behaviorValue < goalArray[0].goalValue ?
                      <h4 style={styles.feedback}>I'm not too far away from my goal!</h4>
                      :
                      <h4 style={styles.feedback}>I need to set a goal.</h4>}
              <TextField type="text" placeholder="Type my thoughts" />
            </div>

            <div style={styles.goalRow}>
              {behaviorValues[1].behaviorValue > goalArray[1].goalValue ?
                <h4 style={styles.feedback}>Great! I exceeded my goal!</h4>
                : behaviorValues[1].behaviorValue === goalArray[1].goalValue ?
                  <h4 style={styles.feedback}>Hooray! I reached my goal!</h4>
                  : behaviorValues[1].behaviorValue < goalArray[1].goalValue / 2 ?
                    <h4 style={styles.feedback}>I need to work harder to reach my goal!</h4>
                    : behaviorValues[1].behaviorValue < goalArray[1].goalValue ?
                      <h4 style={styles.feedback}>I'm not too far away from my goal!</h4>
                      :
                      <h4 style={styles.feedback}>I need to set a goal.</h4>}
              <TextField type="text" placeholder="Type my thoughts" />
            </div>

            <div style={styles.goalRow}>
              {behaviorValues[2].behaviorValue > goalArray[2].goalValue ?
                <h4 style={styles.feedback}>Great! I exceeded my goal!</h4>
                : behaviorValues[2].behaviorValue === goalArray[2].goalValue ?
                  <h4 style={styles.feedback}>Hooray! I reached my goal!</h4>
                  : behaviorValues[2].behaviorValue < goalArray[2].goalValue / 2 ?
                    <h4 style={styles.feedback}>I need to work harder to reach my goal!</h4>
                    : behaviorValues[2].behaviorValue < goalArray[2].goalValue ?
                      <h4 style={styles.feedback}>I'm not too far away from my goal!</h4>
                      :
                      <h4 style={styles.feedback}>I need to set a goal.</h4>}
              <TextField type="text" placeholder="Type my thoughts" />
            </div>

            <div style={styles.goalRow}>
              {behaviorValues[3].behaviorValue > goalArray[3].goalValue ?
                <h4 style={styles.feedback}>Great! I exceeded my goal!</h4>
                : behaviorValues[3].behaviorValue === goalArray[3].goalValue ?
                  <h4 style={styles.feedback}>Hooray! I reached my goal!</h4>
                  : behaviorValues[3].behaviorValue < goalArray[3].goalValue / 2 ?
                    <h4 style={styles.feedback}>I need to work harder to reach my goal!</h4>
                    : behaviorValues[3].behaviorValue < goalArray[3].goalValue ?
                      <h4 style={styles.feedback}>I'm not too far away from my goal!</h4>
                      :
                      <h4 style={styles.feedback}>I need to set a goal.</h4>}
              <TextField type="text" placeholder="Type my thoughts" />
            </div>
          </div>
          {/* <GoalCSV /> */}
          {/* <BehaviorTrackingCSV /> */}
          <img className="rightpage1" src={require('../../components/images/journal/left_page.png')}
            alt="First right-side page" />
          <img className="rightpage2" src={require('../../components/images/journal/left_page2.png')}
            alt="Second right-side page" />
          <img className="rightpage3" src={require('../../components/images/journal/left_page3.png')}
            alt="Third right-side page" />
        </div>
      </div>
    </div>
  );
};

export default withAuth(JournalScreen);

let styles = {
  addGoalButton: {
    backgroundColor: '#78C648', textTransform: 'none', fontWeight: 'bold', fontSize: '14px',
    borderRadius: '25px', color: 'white', width: '175px', marginTop: '5%',
    marginLeft: 'auto', marginRight: 'auto'
  },
  learnMoreButton: {
    backgroundColor: '#9B8EEB', textTransform: 'none', fontWeight: 'bold', fontSize: '14px',
    borderRadius: '25px', color: 'white', width: '150px', marginTop: '5%'
  },
  cancelButton: {
    backgroundColor: '#D9D9D9', width: '45%', textTransform: 'none', fontWeight: 'bold',
    fontSize: '18px', borderRadius: '20px'
  },
  behaviorInput: {
    width: '50%',
    height: '50%'
  },
  goalValueInput: {
    display: 'flex',
    width: '20%'
  },
  goalScreen: {
    position: 'absolute',
    zIndex: '900',
    display: 'flex',
    flexDirection: 'column',
    margin: 'auto',
    width: '90%',
    height: '90%',
    justifyContent: 'space-between'
  },
  goalRow: {
    display: 'flex',
    justifyContent: 'space-between',
    width: '100%'
  },
  goalLabel: {
    width: '30%'
  },
  inputBox: {
    width: '30%',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  goalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    width: '30%',
    marginLeft: 'auto'
  },
  activityIcon: {
    width: '30px'
  },
  screentimeIcon: {
    width: '30px'
  },
  eatingIcon: {
    width: '30px'
  },
  sleepIcon: {
    width: '30px'
  },
  titleGroup: {
    display: 'flex',
    margin: 'auto',
    flexDirection: 'row',
    width: '15%',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  feedback: {
    width: '40%',
    color: 'blue',
    marginLeft: 'auto'
  },
  leftBox: {
    display: 'flex',
    flexDirection: 'column'
  }
}
