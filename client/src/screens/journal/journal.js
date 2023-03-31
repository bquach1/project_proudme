import React, { useState } from 'react';
import '../../css/journal.css';

import Button from '@material-ui/core/Button';
import Modal from '@mui/material/Modal';
import { CSVLink } from 'react-csv';
import Calendar from "../../components/calendar.js";

import { IoIosArrowUp, IoIosArrowDown } from 'react-icons/io';

const JournalScreen = () => {

  const [goalOpen, setGoalOpen] = useState(false);
  const [reflectOpen, setReflectOpen] = useState(false);
  const [selectedGoalReflectionIndex, setSelectedGoalReflectionIndex] = useState(-1);

  const [rightScreenMode, setRightScreenMode] = useState('');
  const [reflectionPage, setReflectionPage] = useState('Default');
  const [editPage, setEditPage] = useState('General');

  const [goalArray, setGoalArray] = useState([]);
  const [goalCount, setGoalCount] = useState(0);
  const [inputGoalValue, setInputGoalValue] = useState(false);

  const [dataList, setDataList] = useState([]);

  var renderedDate = new Date(),
      renderedMonth = renderedDate.getMonth(),
      renderedDay = renderedDate.getDate(),
      renderedYear = renderedDate.getFullYear(),
      renderedDateToday = (renderedMonth + 1) + '/' + renderedDay + '/' + renderedYear;

  const handleEnter = (event) => {
    if (event.key === "Enter") {
      setInputGoalValue(false);
***REMOVED***
***REMOVED***

  const handleBlur = (event) => {
    setInputGoalValue(false);
***REMOVED***

  const handleOpenGoalModal = () => {
    setGoalOpen(true);
***REMOVED***;

  const handleCloseGoalModal = () => {
    setGoalOpen(false);
***REMOVED***;

  const handleReflectionClick = (index) => {
    setSelectedGoalReflectionIndex(index);
    setReflectOpen(true);
***REMOVED***;

  const handleCloseReflectModal = () => {
    setSelectedGoalReflectionIndex(-1);
    setReflectOpen(false);
    setReflectionPage('');
***REMOVED***;

  const handleGoalCountChange = () => {
    setGoalCount(goalCount + 1);
***REMOVED***

  const GoalCSV = () => {
    const headers = [
      { label: "Goal Data ID", key: "goalDataId" },
      { label: "Goal Details", key: "goalDetails" },
      { label: "Goal Quantity", key: "goalQuantity" },
      { label: "Goal Reflection", key: "goalReflection" },
      { label: "Goal Reflection Value", key: "goalReflectionValue" },
      { label: "Type of Goal", key: "goalType" },
      { label: "Start Date", key: "startDate" },
      { label: "End Date", key: "endDate" }
    ];

    return (
      <div>
        <CSVLink data={dataList} headers={headers} filename='goaldata.csv'>Download Goal Data</CSVLink>
      </div>
    )
***REMOVED***

  const BehaviorTrackingCSV = () => {
    const headers = [
      { label: "Goal Data ID", key: "goalDataId" },
      { label: "Date", key: "currentDate" },
      { label: "Behavior Quantity", key: "behaviorAmount" },
    ]
***REMOVED***

  function addGoal(type) {
    var dateToday = new Date(),
      month = dateToday.getMonth(),
      day = dateToday.getDate(),
      year = dateToday.getFullYear(),
      date = (month + 1) + '/' + day + '/' + year;

    var defaultEndDate = new Date();
    defaultEndDate.setDate(defaultEndDate.getDate() + 14);
    console.log(defaultEndDate);

    if (defaultEndDate.getMonth !== dateToday.getMonth) {
      var defaultEndDay = (defaultEndDate.getMonth() + 2) + '/' + defaultEndDate.getDate() + '/' + year;
***REMOVED***
    else {
      defaultEndDay = (defaultEndDate.getMonth() + 1) + '/' + defaultEndDate.getDate() + '/' + year;
***REMOVED***

    const newGoal = {
      id: goalCount,
      goalType: type,
      goalValue: 5,
      divInfo1: "Eat 5 or more servings of fruits and/or vegetables",
      divInfo2: "Reach target increments for servings of healthy foods.",
      reflection: "",
      reflectionValue: 0,
      startDate: date,
      endDate: defaultEndDay,
      startDateUnformatted: dateToday,
      endDateUnformatted: defaultEndDate
***REMOVED***

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
***REMOVED***

    setGoalArray([...goalArray, newGoal]);
    handleGoalCountChange();
    setRightScreenMode("Goal Selected Mode");

    const newData = [...dataList, {
      "goalDataId": newGoal.id,
      "goalDetails": newGoal.divInfo1, "goalQuantity": newGoal.goalValue,
      "goalReflection": newGoal.reflection, "goalReflectionValue": newGoal.reflectionValue,
      "goalType": "Eating", "startDate": newGoal.startDate, "endDate": newGoal.endDate
***REMOVED***];
    setDataList(newData);
***REMOVED***

  function updateGoalValue(id, newQuantity) {
    setGoalArray(prevGoals =>
      prevGoals.map(goal => {
        if (goal.id === id) {
          return { ...goal, goalValue: newQuantity };
    ***REMOVED***
        return goal;
  ***REMOVED***)
    );
    setDataList(prevGoals =>
      prevGoals.map(goal => {
        if (goal.goalDataId === id) {
          return { ...goal, "goalQuantity": newQuantity };
    ***REMOVED***
        return goal;
  ***REMOVED***)
    );
***REMOVED***

  function updateGoal(id, newDescription) {
    setGoalArray(prevGoals =>
      prevGoals.map(goal => {
        if (goal.id === id) {
          return { ...goal, divInfo1: newDescription };
    ***REMOVED***
        return goal;
  ***REMOVED***)
    );
    setDataList(prevGoals =>
      prevGoals.map(goal => {
        if (goal.goalDataId === id) {
          return { ...goal, "goal": newDescription };
    ***REMOVED***
        return goal;
  ***REMOVED***)
    );
***REMOVED***

  function updateGoalReflection(id, newReflection) {
    setGoalArray(prevGoals =>
      prevGoals.map(goal => {
        if (goal.id === id) {
          return { ...goal, reflection: newReflection };
    ***REMOVED***
        return goal;
  ***REMOVED***)
    );
    setDataList(prevGoals =>
      prevGoals.map(goal => {
        if (goal.goalDataId === id) {
          console.log(dataList);
          return { ...goal, "goalReflection": newReflection };
    ***REMOVED***
        return goal;
  ***REMOVED***)
    );
***REMOVED***

  function updateGoalReflectionValue(id, newReflectionValue) {
    setGoalArray(prevGoals =>
      prevGoals.map(goal => {
        if (goal.id === id) {
          return { ...goal, reflectionValue: +newReflectionValue };
    ***REMOVED***
        return goal;
  ***REMOVED***)
    );
    setDataList(prevGoals =>
      prevGoals.map(goal => {
        if (goal.goalDataId === id) {
          console.log(dataList);
          return { ...goal, "goalReflectionValue": +newReflectionValue };
    ***REMOVED***
        return goal;
  ***REMOVED***)
    );
***REMOVED***

  function updateGoalDates(id, newStartDate, newEndDate) {
    setGoalArray(prevGoals =>
      prevGoals.map(goal => {
        if (goal.id === id) {
          return {
            ...goal,
            startDateUnformatted: newStartDate,
            endDateUnformatted: newEndDate
      ***REMOVED***
    ***REMOVED***
        return goal;
  ***REMOVED***))
    setDataList(prevGoals =>
      prevGoals.map(goal => {
        if (goal.goalDataId === id) {
          console.log(dataList);
          return { ...goal, "startDate": newStartDate, "endDate": newEndDate };
    ***REMOVED***
        return goal;
  ***REMOVED***)
    );
***REMOVED***

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
        <img className="gallery-tab" src={require('../../components/images/journal/gallery_tab.png')}
          alt="Gallery bookmark tab" onClick={() => console.log(dataList)} />
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
            ***REMOVED***
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
                    <Button variant="contained"
                      startIcon={<img src={require("../../components/images/journal/brain.png")}
                        alt="Brain for learn more button" />}
                      style={styles.learnMoreButton}
                      onClick={() => console.log('l')}
                    >
                      Learn More
                    </Button>
                    <Button style={styles.addGoalButton}
                      onClick={() => { addGoal('Eating') }}
                    >
                      Add to My Goals
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
                    <Button variant="contained"
                      startIcon={<img src={require("../../components/images/journal/brain.png")}
                        alt="Brain for learn more button" />}
                      style={styles.learnMoreButton}
                      onClick={() => { setRightScreenMode('Other Goal Mode') }}
                    >
                      Learn More
                    </Button>
                    <Button style={styles.addGoalButton}
                      onClick={() => { addGoal('Activity') }}
                    >
                      Add to My Goals
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
                    <Button variant="contained"
                      startIcon={<img src={require("../../components/images/journal/brain.png")}
                        alt="Brain for learn more button" />}
                      style={styles.learnMoreButton}
                      onClick={() => { setRightScreenMode('Other Goal Mode') }}
                    >
                      Learn More
                    </Button>
                    <Button style={styles.addGoalButton}
                      onClick={() => { addGoal('Screentime') }}
                    >
                      Add to My Goals
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
                    <Button variant="contained"
                      startIcon={<img src={require("../../components/images/journal/brain.png")}
                        alt="Brain for learn more button" />}
                      style={styles.learnMoreButton}
                      onClick={() => { setRightScreenMode('Other Goal Mode') }}
                    >
                      Learn More
                    </Button>
                    <Button style={styles.addGoalButton}
                      onClick={() => { addGoal('Sleep') }}
                    >
                      Add to My Goals
                    </Button>
                  </div>
                </div>
              </div>
      ***REMOVED***

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
            {goalCount === 0 ?
              <div className="goal-text">You don't have any goals added yet. Add some recommended behaviors from the left page to start!</div>
              :
              <div>
                {goalArray.map((goal) => (
                  <div className="current-goal" key={goal.id}>
                    <div className="goal-container">
                      <div className="goal-description" onClick={() => handleOpenGoalModal()}>
                        <h3 className="goal-text">{goal.divInfo1}</h3>
                        <h6 className="goal-text">{goal.divInfo2}</h6>
                      </div>

                      <div className="selection-container">
                        {goal.goalType === "Activity" ?
                          <IoIosArrowUp id="upIcon"
                            onClick={() => {
                              if (goal.goalValue < 105) updateGoalValue(goal.id, +goal.goalValue + 15)
                              else updateGoalValue(goal.id, goal.goalValue)
                        ***REMOVED***} />
                          : goal.goalType === "Eating" ?
                            <IoIosArrowUp id="upIcon"
                              onClick={() => {
                                if (goal.goalValue < 5) updateGoalValue(goal.id, +goal.goalValue + 1)
                                else updateGoalValue(goal.id, goal.goalValue)
                          ***REMOVED***} />
                            : goal.goalType === "Screentime" ?
                              <IoIosArrowUp id="upIcon"
                                onClick={() => {
                                  if (goal.goalValue < 5) updateGoalValue(goal.id, +goal.goalValue + 1)
                                  else updateGoalValue(goal.id, goal.goalValue)
                            ***REMOVED***} />
                              : goal.goalType === "Sleep" ?
                                <IoIosArrowUp id="upIcon"
                                  onClick={() => {
                                    if (goal.goalValue < 12) updateGoalValue(goal.id, +goal.goalValue + 1)
                                    else updateGoalValue(goal.id, goal.goalValue)
                              ***REMOVED***} />
                                :
                                <IoIosArrowUp id="upIcon"
                                  onClick={() => {
                                    updateGoalValue(goal.id, +goal.goalValue + 1)
                              ***REMOVED***} />
                    ***REMOVED***

                        <h2 onClick={() => {setInputGoalValue(true)}}
                          className="number-text">
                          {inputGoalValue === true ?                            
                            <input type="number" name="goalValue" value={goal.goalValue} onBlur={handleBlur}
                              id="goalValueInputBox"
                              onChange={(e) => {updateGoalValue(goal.id, e.target.value); console.log(e.target.value);}}                        
                              onKeyDown={handleEnter}
                              style={styles.goalValueInput}
                              autoComplete="off"
                            />
                            :
                            <div>{goal.goalValue}</div>
                      ***REMOVED***
                        </h2>
                        {goal.goalType === "Activity" ?
                          <IoIosArrowDown id="downIcon"
                            onClick={() => {
                              if (goal.goalValue > 30) updateGoalValue(goal.id, +goal.goalValue - 15)
                              else updateGoalValue(goal.id, goal.goalValue)
                        ***REMOVED***} />
                          : goal.goalType === "Eating" ?
                            <IoIosArrowDown id="downIcon"
                              onClick={() => {
                                if (goal.goalValue > 1) updateGoalValue(goal.id, +goal.goalValue - 1)
                                else updateGoalValue(goal.id, goal.goalValue)
                          ***REMOVED***} />
                            : goal.goalType === "Screentime" ?
                              <IoIosArrowDown id="downIcon"
                                onClick={() => {
                                  if (goal.goalValue > 1) updateGoalValue(goal.id, +goal.goalValue - 1)
                                  else updateGoalValue(goal.id, goal.goalValue)
                            ***REMOVED***} />
                              : goal.goalType === "Sleep" ?
                                <IoIosArrowDown id="downIcon"
                                  onClick={() => {
                                    if (goal.goalValue > 8) updateGoalValue(goal.id, +goal.goalValue - 1)
                                    else updateGoalValue(goal.id, goal.goalValue)
                              ***REMOVED***} />
                                :
                                <IoIosArrowDown id="downIcon"
                                  onClick={() => {
                                    updateGoalValue(goal.id, +goal.goalValue - 1)
                              ***REMOVED***} />
                    ***REMOVED***
                      </div>
                    </div>

                    <div className="reflect-wrapper" key={goal.id}>
                      <img className="reflect-image"
                        src={require('../../components/images/journal/reflect.png')} alt="Temporary reflection icon"
                        onClick={() => handleReflectionClick(goal.id)} />
                      <p style={{ fontWeight: 'bold' }}>Reflect</p>
                      {selectedGoalReflectionIndex !== -1 && (
                        <Modal
                          aria-labelledby="reflect-modal"
                          aria-describedby="modal-to-reflect-on-goal"
                          open={reflectOpen}
                          onClose={handleCloseReflectModal}
                          key={goal.id}
                        >
                          {reflectionPage === 'Text' ?
                            <div className="modal">
                              <div className="inside-modal">
                                <h2>Reflect on Your Goal</h2>
                                <h4>Feel free to type some insights into your goal here; it will be recorded for your own tracking.</h4>
                                <input className="modal-input" type="text" name="reflection" placeholder="Reflection thoughts"
                                  value={goalArray[selectedGoalReflectionIndex].reflection} onChange={(e) => { updateGoalReflection(selectedGoalReflectionIndex, e.target.value); }} />
                              </div>

                              <div className="nav-options">
                                <Button style={{
                                  backgroundColor: '#D9D9D9', width: '45%', textTransform: 'none', fontWeight: 'bold', fontSize: '18px',
                                  borderRadius: '20px'
                            ***REMOVED***}
                                  onClick={() => { setReflectionPage(''); }}
                                >
                                  Back
                                </Button>

                                <Button style={{
                                  backgroundColor: '#ADF083', width: '45%', textTransform: 'none', fontWeight: 'bold', fontSize: '18px',
                                  borderRadius: '20px'
                            ***REMOVED***}
                                  onClick={() => { handleCloseReflectModal(); }}
                                >
                                  Reflect
                                </Button>
                              </div>
                            </div>
                            :
                            <div className="modal">
                              <div className="inside-modal">
                                <h6>{renderedDateToday}</h6>
                                <h2>Track Behaviors</h2>
                                <h4>Enter how much of your goal (servings, hours, etc.) you achieved for today</h4>
                                <input type="number" name="goalValue" value={goal.goalReflectionValue}
                                  style={styles.behaviorInput}
                                  onChange={(e) => updateGoalReflectionValue(goal.id, e.target.value)}
                                />
                              </div>

                              <div className="nav-options">
                                <Button style={styles.cancelButton}
                                  onClick={() => { handleCloseReflectModal(); }}
                                >
                                  Cancel
                                </Button>

                                <Button style={{
                                  backgroundColor: '#ADF083', width: '45%', textTransform: 'none', fontWeight: 'bold', fontSize: '18px',
                                  borderRadius: '20px'
                            ***REMOVED***}
                                  onClick={() => { setReflectionPage('Text') }}
                                >
                                  Next
                                </Button>
                              </div>
                            </div>
                      ***REMOVED***
                        </Modal>
                      )}
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
                        ***REMOVED***}
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
                        ***REMOVED***}
                              onClick={() => { updateGoalDates(goal.id, goal.startDateUnformatted, goal.endDateUnformatted); handleCloseGoalModal(); }}
                            >
                              Log Progress
                            </Button>
                          </div>
                    ***REMOVED***
                      </Modal>
                    </div>
                  </div>
                ))}
              </div>
        ***REMOVED***
            <GoalCSV />
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

export default JournalScreen;

let styles = {
  addGoalButton: {
    backgroundColor: '#78C648', textTransform: 'none', fontWeight: 'bold', fontSize: '14px',
    borderRadius: '25px', color: 'white', width: '175px', marginTop: '5%'
***REMOVED***,
  learnMoreButton: {
    backgroundColor: '#9B8EEB', textTransform: 'none', fontWeight: 'bold', fontSize: '14px',
    borderRadius: '25px', color: 'white', width: '150px', marginTop: '5%'
***REMOVED***,
  cancelButton: {
    backgroundColor: '#D9D9D9', width: '45%', textTransform: 'none', fontWeight: 'bold',
    fontSize: '18px', borderRadius: '20px'
***REMOVED***,
  behaviorInput: {
    width: '80%'
***REMOVED***,
  goalValueInput: {
    width: '100%'
***REMOVED***,
}