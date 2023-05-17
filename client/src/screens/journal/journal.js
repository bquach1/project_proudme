import React, { useState, useEffect } from 'react';
import '../../css/journal.css';
import withAuth from '../../components/auth/withAuth';
import axios from 'axios';

import { CSVLink } from 'react-csv';
import { TextField } from '@mui/material';

const JournalScreen = () => {

  const [user, setUser] = useState([]);
  const [goalData, setGoalData] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    fetch(`http://localhost:3001/users`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(response => response.json())
      .then(data => {
        setUser(data);
      })
      .catch(error => console.error(error));
  }, []);
  
  useEffect(() => {
    const fetchGoals = async () => {
      try {
        const response = await axios.get('http://localhost:3001/goals', { 
          params: {
            user: user
          }
         });
        setGoalData(response.data);
        console.log(response.data);
      } catch (error) {
        console.error(error);
      }
    };  
    fetchGoals();
  }, [user]);

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
      goalValue: null,
      divInfo1: "Get at least 60 minutes of physical activity per day",
      divInfo2: "Do exercises like running or playing sports for at least an hour a day.",
      reflection: "",
      date: date
    },
    {
      id: 1,
      goalType: "screentime",
      goalValue: null,
      divInfo1: "Limit screentime to 2 hours a day",
      divInfo2: "Go outside instead of using tech like laptops, phones, and televisions.",
      reflection: "",
      date: date
    },
    {
      id: 2,
      goalType: "eating",
      goalValue: null,
      divInfo1: "Eat 5 or more servings of fruits and/or vegetables",
      divInfo2: "Reach target increments for servings of healthy foods.",
      reflection: "",
      date: date
    },
    {
      id: 3,
      goalType: "sleep",
      goalValue: null,
      divInfo1: "Get at least 9 hours of sleep a night",
      divInfo2: "Sleep at least 9-11 hours a night to feel the best and most productive.",
      reflection: "",
      date: date
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
  const [dataList, setDataList] = useState(goalData);

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

  const GoalCSV = () => {
    const headers = [
      { label: "_id", key: "_id" },
      { label: "User", key: "user" },
      { label: "Goal Details", key: "divInfo1" },
      { label: "Goal Description", key: "divInfo2" },
      { label: "Goal Quantity", key: "goalValue" },
      { label: "Type of Goal", key: "goalType" },
      { label: "Date", key: "date" },
      { label: "Goal Reflection", key: "reflection" },
      { label: "__v", key: "__v"}
    ];

    return (
      <div>
        <CSVLink data={goalData} headers={headers} filename='goaldata.csv'>
          <img className="achievements-tab" src={require('../../components/images/journal/achievements_tab.png')}
          alt="Achievements bookmark tab" />
        </CSVLink>
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

  function updateGoalValue(id, newQuantity) {
    console.log(goalData);
    setGoalArray(prevGoals =>
      prevGoals.map(goal => {
        if (goal.id === id) {
          axios.post('http://localhost:3001/goals', { 
            user: user._id,
            goalType: goal.goalType,
            goalValue: newQuantity,
            divInfo1: goal.divInfo1,
            divInfo2: goal.divInfo2,
            date: date,
            reflection: goal.reflection
          })
            .then(response => {
              console.log(response.data);
            })
            .catch(error => {
              console.error(error);
          })
          return { ...goal, goalValue: +newQuantity };
        }
        return goal;
      }),
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

  function updateGoalReflection(id, newReflection) {
    setGoalArray(prevGoals =>
      prevGoals.map(goal => {
        if (goal.id === id) {
          axios.post('http://localhost:3001/goals', { 
            user: user._id,
            goalType: goal.goalType,
            reflection: newReflection
          })
            .then(response => {
              console.log(response.data);
            })
            .catch(error => {
              console.error(error);
          })
          return { ...goal, reflection: newReflection };
        }
        return goal;
      })
    );
    setDataList(prevGoals =>
      prevGoals.map(goal => {
        if (goal.goalDataId === id) {
          return { ...goal, "reflection": newReflection };
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
          // console.log(behaviorValues);
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

  return (
    <div className="journal">
      <h1 className="title">My Journal</h1>
      <div className="journalWrapper">
        <GoalCSV />
        <img className="journalCover" src={require('../../components/images/journal/journal_cover.png')}
          alt="Journal cover screen wrapper" />      
        <div className="leftPageWrapper">        
            <div style={styles.goalScreen}>

              <div style={styles.goalRow}>
                <h2 style={styles.goalHeader}>Health Behaviors</h2>
                <h2 style={styles.goalHeader}>Set My Goal</h2>
                <h2 style={styles.goalHeader}>Track My Behavior</h2>
              </div>

              <div style={styles.goalRow}>
                  <div style={styles.titleGroup}>
                    <img style={styles.activityIcon} src={require('../../components/images/journal/activity_goals.png')} alt="Activity goals icon on activity goals page" />
                    <h2 style={styles.goalLabel}>Do</h2>
                  </div>
                  {/* <p>Exercise, do chores, play sports, and other physical activities.</p> */}
                {inputGoalValue === false ?
                  <TextField style={styles.inputBox} label="minutes/day"
                    type="number"
                    onBlur={handleBlur}
                    onKeyDown={handleEnter}
                    
                    onChange={(e) => {
                      updateGoalValue(0, +e.target.value);
                    }} />
                  :
                  <h2>{goalArray[0].goalValue}</h2>
                }
                <TextField style={styles.inputBox} label="minutes/day"
                  type="number"
                  onChange={(e) => {
                    updateBehaviorValue(0, +e.target.value);
                  }} />
              </div>

              <div style={styles.goalRow}>
                <div style={styles.titleGroup}>
                  <img style={styles.screentimeIcon} src={require('../../components/images/journal/tablet_icon.png')} alt="Tablet for screentime goals" />
                  <h2 style={styles.goalLabel}>View</h2>
                </div>
                {inputGoalValue === false ?
                  <TextField style={styles.inputBox} label="minutes/day"
                    type="number"
                    onChange={(e) => {
                      updateGoalValue(1, +e.target.value);
                    }} />
                  :
                  <h2>{goalArray[1].goalValue}</h2>
                }

                <TextField style={styles.inputBox} label="minutes/day"
                  type="number"
                  onChange={(e) => {
                    updateBehaviorValue(1, +e.target.value);
                  }} />
              </div>

              <div style={styles.goalRow}>
                <div style={styles.titleGroup}>
                  <img style={styles.eatingIcon} src={require('../../components/images/journal/apple.png')} alt="Apple for servings goal" />
                  <h2 style={styles.goalLabel}>Chew</h2>
                </div>

                {inputGoalValue === false ?
                  <TextField style={styles.inputBox} label="servings/day"
                    type="number"
                    onChange={(e) => {
                      updateGoalValue(2, +e.target.value);
                    }} />
                  :
                  <h2>{goalArray[2].goalValue}</h2>
                }

                <TextField style={styles.inputBox} label="servings/day"
                  type="number"
                  onChange={(e) => {
                    updateBehaviorValue(2, +e.target.value);
                  }} />
              </div>

              <div style={styles.goalRow}>

                <div style={styles.titleGroup}>
                  <img style={styles.sleepIcon} src={require('../../components/images/journal/pillow_icon.png')} alt="Crossed out candy icon for avoid sugary food" />
                  <h2 style={styles.goalLabel}>Sleep</h2>
                </div>

                {inputGoalValue === false ?
                  <TextField style={styles.inputBox} label="hours/day"
                    type="number"
                    onChange={(e) => {
                      updateGoalValue(3, +e.target.value);
                    }} />
                  :
                  <h2>{goalArray[3].goalValue}</h2>
                }

                <TextField style={styles.inputBox} label="hours/day"
                  type="number"
                  onChange={(e) => {
                    updateBehaviorValue(3, +e.target.value);
                  }} />
              </div>
            </div>        

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
                      <h4 style={styles.feedback}>...</h4>}
              <TextField type="text" placeholder="Type my thoughts" 
              onChange={(e) => {updateGoalReflection(0, e.target.value); console.log(goalArray[0].reflection)}}/>
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
                      <h4 style={styles.feedback}>...</h4>}
              <TextField type="text" placeholder="Type my thoughts" 
              onChange={(e) => updateGoalReflection(1, e.target.value)}/>
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
                      <h4 style={styles.feedback}>...</h4>}
              <TextField type="text" placeholder="Type my thoughts" 
              onChange={(e) => updateGoalReflection(2, e.target.value)}/>
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
                      <h4 style={styles.feedback}>...</h4>}
              <TextField type="text" placeholder="Type my thoughts" 
              onChange={(e) => updateGoalReflection(3, e.target.value)}/>
            </div>
          </div>               
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
    alignItems:  'center',
    width: 'auto',
  },
  goalLabel: {
    width: '30%'
  },
  inputBox: {
    width: '20%',
    marginLeft: 'auto',
    marginRight: 'auto',
    size: '10px'
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
    width: '30px',
  },
  titleGroup: {
    display: 'flex',
    margin: 'auto',
    flexDirection: 'row',
    width: '10%',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  feedback: {
    width: '40%',
    color: 'blue',
    marginLeft: 'auto'
  },
}
