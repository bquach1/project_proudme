import React, { useState } from 'react';
import '../../css/journal.css';
import withAuth from '../../components/auth/withAuth';

import Button from '@material-ui/core/Button';
import { CSVLink } from 'react-csv';
import Calendar from "../../components/calendar.js";
import { Modal, LinearProgress, CircularProgress } from '@mui/material';

import { IoIosArrowUp, IoIosArrowDown } from 'react-icons/io';

const JournalScreen = () => {

  const [goalOpen, setGoalOpen] = useState(false);
  const [reflectOpen, setReflectOpen] = useState(false);
  const [selectedGoalReflectionIndex, setSelectedGoalReflectionIndex] = useState(-1);

  const [rightScreenMode, setRightScreenMode] = useState('');
  const [reflectionPage, setReflectionPage] = useState('Default');
  const [editPage, setEditPage] = useState('General');
  const [formCompletion, setFormCompletion] = useState(50);

  const [goalArray, setGoalArray] = useState([]);
  const [goalCount, setGoalCount] = useState(0);
  const [behaviorCount, setBehaviorCount] = useState(0);
  const [inputGoalValue, setInputGoalValue] = useState(false);

  const [behaviorValues, setBehaviorValues] = useState([]);

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
          return { ...goal, goalValue: newQuantity };
        }
        return goal;
      })
    );
    setDataList(prevGoals =>
      prevGoals.map(goal => {
        if (goal.goalDataId === id) {
          return { ...goal, "goalQuantity": newQuantity };
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

    behaviorValues.map(updatedBehavior => {
      if (updatedBehavior.loggedDate === date) {
        if (updatedBehavior.goalId === id) {
          var overridenBehavior = { ...updatedBehavior, behaviorValue: +newBehaviorValue };
          setBehaviorValues(behaviorValues.map((behavior) => behavior.loggedDate === date
            && behavior.goalId === id ? overridenBehavior : behavior));
        }
        return updatedBehavior;
      }
      else {
        handleBehaviorCountChange();
        const newBehavior = {
          behaviorId: behaviorCount,
          goalId: updatedBehavior.goalId,
          behaviorValue: +newBehaviorValue,
          loggedDate: date
        }
        if (updatedBehavior.goalId === id) {
          setBehaviorValues([...behaviorValues, newBehavior]);
        }
      }
      return updatedBehavior;
    });

    behaviorValues.map(updatedBehavior => {
      if (updatedBehavior.loggedDate === date) {
        if (updatedBehavior.goalId === id) {
          var overridenBehavior = { ...updatedBehavior, "behaviorValue": +newBehaviorValue };
          setBehaviorData(behaviorData.map((behavior) => behavior.loggedDate === date
            && behavior.goalId === id ? overridenBehavior : behavior));
        }
        return updatedBehavior;
      }
      else {
        handleBehaviorCountChange();
        const newBehavior = {
          "behaviorId": behaviorCount,
          "behaviorDataId": updatedBehavior.goalId,
          "behaviorValue": +newBehaviorValue,
          "loggedDate": date
        }
        if (updatedBehavior.goalId === id) {
          console.log(behaviorValues);
          console.log(newBehavior.loggedDate);
          setBehaviorData([...behaviorData, newBehavior]);
        }
      }
      return updatedBehavior;
    });
  }

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
        <img onClick={() => setRightScreenMode("Progress Mode")} className="achievements-tab" src={require('../../components/images/journal/achievements_tab.png')}
          alt="Achievements bookmark tab" />
        <img onClick={() => setRightScreenMode("")} className="goals-tab" src={require('../../components/images/journal/goals_tab.png')}
          alt="Goals bookmark tab" />
        <div className="leftPageWrapper">
          {rightScreenMode === "Goal Selected Mode" ?
            <div className="goal-box">
              <h4>You've selected a goal. Do your best! If you still want to work on more goals right now, click the yellow "Goals" tab on the right page.</h4>
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
                <h1 className="journal-title">Behaviors</h1>
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
          <div className="goal-box">
            <h1 className="journal-title">My Goals</h1>
            <h4>{renderedDateToday}</h4>
            {goalCount === 0 ?
              <div className="goal-text">You don't have any goals added yet. Add some recommended behaviors from the left page to start!</div>
              :
              <div>
                {goalArray.map((goal) => (
                  <div className="current-goal" key={goal.id}>
                    {reflectOpen === false ?
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <div className="goal-container">
                          <div className="goal-description" onClick={() => handleOpenGoalModal()}>
                            <h3 className="goal-text">{goal.divInfo1}</h3>
                            <h6 className="goal-text">{goal.divInfo2}</h6>
                          </div>

                          <Modal
                            aria-labelledby="goal-modal"
                            aria-describedby="modal-to-create-new-goal"
                            open={goalOpen}
                            onClose={handleCloseGoalModal}
                          >
                            {editPage === 'General' ?
                              <div className="modal">
                                <h2>Edit Your Goal Progress</h2>
                                <h4>Goal Name</h4>
                                <input className="modal-input" type="text" name="goal" onChange={(e) => updateGoal(goal.id, e.target.value)} value={goal.divInfo1} />
                                <Button style={{
                                  backgroundColor: '#ADF083', width: '80%', textTransform: 'none', fontWeight: 'bold', fontSize: '18px',
                                  borderRadius: '20px'
                                }}
                                  onClick={() => { setEditPage('Calendar') }}
                                >
                                  Next
                                </Button>
                              </div>
                              :
                              <div className="modal">
                                <Calendar
                                  startDate={new Date(goal.startDateUnformatted.getFullYear(),
                                    goal.startDateUnformatted.getDate(),
                                    goal.startDateUnformatted.getMonth())}

                                  endDate={new Date(goal.endDateUnformatted.getFullYear(),
                                    goal.endDateUnformatted.getDate(),
                                    goal.endDateUnformatted.getMonth())}

                                  onChange={() => updateGoalDates(goal.id, goal.startDate, goal.endDate)}
                                />

                                <Button style={{
                                  backgroundColor: '#ADF083', width: '80%', textTransform: 'none', fontWeight: 'bold', fontSize: '18px',
                                  borderRadius: '20px'
                                }}
                                  onClick={() => { updateGoalDates(goal.id, goal.startDateUnformatted, goal.endDateUnformatted); handleCloseGoalModal(); }}
                                >
                                  Log Progress
                                </Button>
                              </div>
                            }
                          </Modal>

                          <div className="selection-container">
                            {goal.goalType === "Activity" ?
                              <IoIosArrowUp id="upIcon"
                                onClick={() => {
                                  if (goal.goalValue < 105) updateGoalValue(goal.id, +goal.goalValue + 15)
                                  else updateGoalValue(goal.id, goal.goalValue)
                                }} />
                              : goal.goalType === "Eating" ?
                                <IoIosArrowUp id="upIcon"
                                  onClick={() => {
                                    if (goal.goalValue < 5) updateGoalValue(goal.id, +goal.goalValue + 1)
                                    else updateGoalValue(goal.id, goal.goalValue)
                                  }} />
                                : goal.goalType === "Screentime" ?
                                  <IoIosArrowUp id="upIcon"
                                    onClick={() => {
                                      if (goal.goalValue < 5) updateGoalValue(goal.id, +goal.goalValue + 1)
                                      else updateGoalValue(goal.id, goal.goalValue)
                                    }} />
                                  : goal.goalType === "Sleep" ?
                                    <IoIosArrowUp id="upIcon"
                                      onClick={() => {
                                        if (goal.goalValue < 12) updateGoalValue(goal.id, +goal.goalValue + 1)
                                        else updateGoalValue(goal.id, goal.goalValue)
                                      }} />
                                    :
                                    <IoIosArrowUp id="upIcon"
                                      onClick={() => {
                                        updateGoalValue(goal.id, +goal.goalValue + 1)
                                      }} />
                            }
                            <h2 onClick={() => { setInputGoalValue(true) }}
                              className="number-text">
                              {inputGoalValue === true ?
                                <input type="number" name="goalValue" value={goal.goalValue} onBlur={handleBlur}
                                  id="goalValueInputBox"
                                  onChange={(e) => { updateGoalValue(goal.id, e.target.value); }}
                                  onKeyDown={handleEnter}
                                  style={styles.goalValueInput}
                                  autoComplete="off"
                                />
                                :
                                <div>{goal.goalValue}</div>
                              }
                            </h2>
                            {goal.goalType === "Activity" ?
                              <IoIosArrowDown id="downIcon"
                                onClick={() => {
                                  if (goal.goalValue > 30) updateGoalValue(goal.id, +goal.goalValue - 15)
                                  else updateGoalValue(goal.id, goal.goalValue)
                                }} />
                              : goal.goalType === "Eating" ?
                                <IoIosArrowDown id="downIcon"
                                  onClick={() => {
                                    if (goal.goalValue > 1) updateGoalValue(goal.id, +goal.goalValue - 1)
                                    else updateGoalValue(goal.id, goal.goalValue)
                                  }} />
                                : goal.goalType === "Screentime" ?
                                  <IoIosArrowDown id="downIcon"
                                    onClick={() => {
                                      if (goal.goalValue > 1) updateGoalValue(goal.id, +goal.goalValue - 1)
                                      else updateGoalValue(goal.id, goal.goalValue)
                                    }} />
                                  : goal.goalType === "Sleep" ?
                                    <IoIosArrowDown id="downIcon"
                                      onClick={() => {
                                        if (goal.goalValue > 8) updateGoalValue(goal.id, +goal.goalValue - 1)
                                        else updateGoalValue(goal.id, goal.goalValue)
                                      }} />
                                    :
                                    <IoIosArrowDown id="downIcon"
                                      onClick={() => {
                                        updateGoalValue(goal.id, +goal.goalValue - 1)
                                      }} />
                            }
                          </div>

                        </div>
                        <div className="reflect-wrapper" key={goal.id}>
                          <img className="reflect-image"
                            src={require('../../components/images/journal/reflect.png')} alt="Temporary reflection icon"
                            onClick={() => handleReflectionClick(goal.id)} />
                          <p style={{ fontWeight: 'bold' }}>Reflect</p>
                        </div>
                      </div>
                      :
                      <div key={goal.id}>
                        {selectedGoalReflectionIndex !== -1 && (
                          <div className="page-modal" key={goal.id}>
                            <div className="inside-modal">
                              <h2>Goal</h2>
                              <div className="feedback-page" onClick={() => console.log('work')}>
                                <div className='feedback-text'>
                                  <h3 className="goal-text">{goal.divInfo1}</h3>
                                </div>
                                <div className="feedback-num">
                                  {goal.goalType === "Activity" ?
                                    <IoIosArrowUp id="upIcon"
                                      onClick={() => {
                                        if (goal.goalValue < 105) updateGoalValue(goal.id, +goal.goalValue + 15)
                                        else updateGoalValue(goal.id, goal.goalValue)
                                      }} />
                                    : goal.goalType === "Eating" ?
                                      <IoIosArrowUp id="upIcon"
                                        onClick={() => {
                                          if (goal.goalValue < 5) updateGoalValue(goal.id, +goal.goalValue + 1)
                                          else updateGoalValue(goal.id, goal.goalValue)
                                        }} />
                                      : goal.goalType === "Screentime" ?
                                        <IoIosArrowUp id="upIcon"
                                          onClick={() => {
                                            if (goal.goalValue < 5) updateGoalValue(goal.id, +goal.goalValue + 1)
                                            else updateGoalValue(goal.id, goal.goalValue)
                                          }} />
                                        : goal.goalType === "Sleep" ?
                                          <IoIosArrowUp id="upIcon"
                                            onClick={() => {
                                              if (goal.goalValue < 12) updateGoalValue(goal.id, +goal.goalValue + 1)
                                              else updateGoalValue(goal.id, goal.goalValue)
                                            }} />
                                          :
                                          <IoIosArrowUp id="upIcon"
                                            onClick={() => {
                                              updateGoalValue(goal.id, +goal.goalValue + 1)
                                            }} />
                                  }
                                  <h2 onClick={() => { setInputGoalValue(true) }}
                                    className="number-text">
                                    {inputGoalValue === true ?
                                      <input type="number" name="goalValue" value={goal.goalValue} onBlur={handleBlur}
                                        id="goalValueInputBox"
                                        onChange={(e) => { updateGoalValue(goal.id, e.target.value); }}
                                        onKeyDown={handleEnter}
                                        style={styles.goalValueInput}
                                        autoComplete="off"
                                      />
                                      :
                                      <div>{goal.goalValue}</div>
                                    }
                                  </h2>
                                  {goal.goalType === "Activity" ?
                                    <IoIosArrowDown id="downIcon"
                                      onClick={() => {
                                        if (goal.goalValue > 30) updateGoalValue(goal.id, +goal.goalValue - 15)
                                        else updateGoalValue(goal.id, goal.goalValue)
                                      }} />
                                    : goal.goalType === "Eating" ?
                                      <IoIosArrowDown id="downIcon"
                                        onClick={() => {
                                          if (goal.goalValue > 1) updateGoalValue(goal.id, +goal.goalValue - 1)
                                          else updateGoalValue(goal.id, goal.goalValue)
                                        }} />
                                      : goal.goalType === "Screentime" ?
                                        <IoIosArrowDown id="downIcon"
                                          onClick={() => {
                                            if (goal.goalValue > 1) updateGoalValue(goal.id, +goal.goalValue - 1)
                                            else updateGoalValue(goal.id, goal.goalValue)
                                          }} />
                                        : goal.goalType === "Sleep" ?
                                          <IoIosArrowDown id="downIcon"
                                            onClick={() => {
                                              if (goal.goalValue > 8) updateGoalValue(goal.id, +goal.goalValue - 1)
                                              else updateGoalValue(goal.id, goal.goalValue)
                                            }} />
                                          :
                                          <IoIosArrowDown id="downIcon"
                                            onClick={() => {
                                              updateGoalValue(goal.id, +goal.goalValue - 1)
                                            }} />
                                  }
                                </div>
                              </div>
                            </div>

                            <hr className="line-break" />

                            <div className="inside-modal">
                              <h2>Track Behaviors {goal.id}</h2>
                              <h4>Enter how much of your goal (servings, hours, etc.) you achieved for today</h4>
                              <div className="behaviorInput">
                                <input type="text" name="goalValue"
                                  placeholder="0"
                                  value={behaviorValues[selectedGoalReflectionIndex].behaviorValue}
                                  style={styles.behaviorInput}
                                  onChange={(e) => {
                                    updateBehaviorValue(selectedGoalReflectionIndex, e.target.value)
                                  }}
                                />
                                <Button style={{
                                  backgroundColor: '#8054C9', width: '25%', textTransform: 'none', fontWeight: 'bold', fontSize: '14px',
                                  borderRadius: '20px', color: 'white', height: '10%', marginLeft: 'auto', marginTop: '4%'
                                }}
                                  onClick={() => {
                                    alert('Behavior logged for ' + renderedDateToday);
                                  }}
                                >
                                  Log
                                </Button>
                              </div>
                              {/* <LinearProgress style={{ margin: 'auto', }} color='success' variant="determinate" value={formCompletion} /> */}
                            </div>

                            <hr className="line-break" />

                              <div className="inside-modal">
                                <h2>Reflect on Your Goal</h2>
                                <h4>Feel free to type some insights into your goal here; it will be recorded for your own tracking.</h4>
                                <input className="modal-input" type="text" name="reflection" placeholder="Reflection thoughts"
                                  value={goalArray[selectedGoalReflectionIndex].reflection} onChange={(e) => { updateGoalReflection(selectedGoalReflectionIndex, e.target.value); }} />
                              </div>
                              
                              <div className="button-container">
                                <Button style={{
                                    backgroundColor: '#9F9F9F', width: '30%', textTransform: 'none', fontWeight: 'bold', fontSize: '18px',
                                    borderRadius: '20px'
                                  }}
                                    onClick={() => { handleCloseReflectModal(); }}
                                  >
                                    Cancel
                                </Button>
                                <Button style={{
                                    backgroundColor: '#ADF083', width: '30%', textTransform: 'none', fontWeight: 'bold', fontSize: '18px',
                                    borderRadius: '20px'
                                  }}
                                    onClick={() => { handleCloseReflectModal(); alert("Reflection/behavior successfully logged for " + renderedDateToday)}}
                                  >
                                    Reflect
                                </Button>
                              </div>
                            </div>
                        )}
                      </div>
                    }
                  </div>
                ))}
              </div>
            }
            <GoalCSV />
            <BehaviorTrackingCSV />
          </div>
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
    width: '100%'
  },
}
