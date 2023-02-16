import React, { useState } from 'react';
import '../../css/journal.css';

import Button from '@material-ui/core/Button';
import Modal from '@mui/material/Modal';
import { FormGroup, Switch, FormControlLabel } from '@mui/material';
import { CSVLink } from 'react-csv';

import { IoIosArrowUp, IoIosArrowDown } from 'react-icons/io';

const JournalScreen = () => {

    const [open, setOpen] = useState(false);
    const [defineOpen, setDefineOpen] = useState(false);
    const [reflectOpen, setReflectOpen] = useState(false);
    const [progressError, setProgressError] = useState(false);
    const [booleanSelected, setBooleanSelected] = useState(false);
    const [numberSelected, setNumberSelected] = useState(false);
    const [timerSelected, setTimerSelected] = useState(false);
    
    const [goal, setGoal] = useState('');
    const [numericalValue, setNumericalValue] = useState(0);
    const [unit, setUnit] = useState('');
    const [description, setDescription] = useState('');
    const [goalIsComplete, setGoalIsComplete] = useState(false);
    const [rightScreenMode, setRightScreenMode] = useState('');

    const [goalArray, setGoalArray] = useState([]);
    const [progressArray, setProgressArray] = useState([]);
    const [reflectionArray, setReflectionArray] = useState([]);
    const [goalCount, setGoalCount] = useState(0);
    const [reflection, setReflection] = useState('');

    const [dataList, setDataList] = useState([]);

    const handleOpenGoalModal = () => {
        setOpen(true);
***REMOVED***;

    const handleCloseGoalModal = () => {
        setOpen(false);
***REMOVED***;

    const handleOpenDefineModal = () => {
        if (booleanSelected || numberSelected || timerSelected) {
            setDefineOpen(true);
            setProgressError(false);
            handleCloseGoalModal();
    ***REMOVED***
        else {
            setDefineOpen(false);
            setProgressError(true);
    ***REMOVED***
***REMOVED***;

    const handleCloseDefineModal = () => {
        setDefineOpen(false);
***REMOVED***;

    const handleOpenReflectModal = () => {
        setReflectOpen(true);
***REMOVED***;

    const handleCloseReflectModal = () => {
        setReflectOpen(false);
***REMOVED***;

    const handleGoalChange = (e) => {
        setGoal(e.target.value);
***REMOVED***;

    const handleNumericalChange = (e) => {
        e.persist();
        setNumericalValue(+e.target.value);
***REMOVED***;

    const handleUnitChange = (e) => {
        setUnit(e.target.value);
***REMOVED***

    const handleDescriptionChange = (e) => {
        setDescription(e.target.value);
***REMOVED***;

    const handleGoalIsCompleteChange = () => {
        setGoalIsComplete(!goalIsComplete);
***REMOVED***;

    const handleGoalCountChange = () => {
        setGoalCount(goalCount + 1);
        setProgressArray( updatedArray => [...updatedArray, 
            <div className="current-goal">
                <div className="goal-container">

                    <div className="goal-description">
                        <h3 className="goal-text">Progress Tracking</h3>
                        <h6 className="goal-text">You currently have {goalCount + 1} active goals</h6>
                    </div>

                </div>
            </div>]);
***REMOVED***

    const handleReflectionChange = (e) => {
        setReflection(e.target.value);
***REMOVED***

    const CSV = () => {

        const headers = [
            { label: "Goal Details", key: "goalDetails" },
            { label: "Goal Quantity", key: "goalQuantity" },
            { label: "Type of Goal", key: "goalType" },
        ];
    
        return (
            <div>
                <CSVLink data={dataList} headers={headers} filename='goaldata.csv'>Download Goal Data</CSVLink>
            </div>
        )
***REMOVED***

    function addGoal() {
        handleGoalCountChange();                            

***REMOVED***;

    function addEatingGoal() {

        setGoalArray( updatedArray => [...updatedArray, 
            <div className="current-goal">
                <div className="goal-container">

                    <div className="goal-description" onClick={() => handleOpenGoalModal()}>
                        <h3 className="goal-text">{"Eat 5 or more servings of fruits and/or vegetables"}</h3>
                        <h6 className="goal-text">{"Reach goal increments for servings of fruit (1-5)"}</h6>
                    </div>

                    <div className="selection-container">

                        <IoIosArrowUp id="upIcon" onClick={() => setNumericalValue(numericalValue + 1) } />
                        <h2 className="number-text">{5}</h2>
                        <IoIosArrowDown id="downIcon" onClick={() => setNumericalValue(numericalValue - 1)} />
                    </div>

                </div>

                <div className="reflect-wrapper">
                    <img className="reflect-image" 
                    src={require('../../components/images/journal/reflect.png')} alt="Temporary reflection icon" 
                    onClick={() => handleOpenReflectModal() } />
                    <p style={{fontWeight: 'bold'}}>Reflect</p>
                </div>
            </div>]);
        handleGoalCountChange();  
        setRightScreenMode("Goal Selected Mode");

        const newData = [...dataList, {"goalDetails": "Eat 5 or more servings of fruits and/or vegetables", "goalQuantity": 5, "goalType": "Eating"}];
        setDataList(newData);

***REMOVED***

    function addActivityGoal() {

        setGoalArray( updatedArray => [...updatedArray, 
            <div className="current-goal">
                <div className="goal-container">

                    <div className="goal-description">
                        <h3 className="goal-text">{"Get at least 60 minutes of physical activity per day"}</h3>
                        <h6 className="goal-text">{"Do exercises like running or playing sports for at least an hour a day."}</h6>
                    </div>

                    <div className="selection-container">

                        <IoIosArrowUp id="upIcon" onClick={() => setNumericalValue(numericalValue + 1) } />
                        <h2 className="number-text">{60}</h2>
                        <IoIosArrowDown id="downIcon" onClick={() => setNumericalValue(numericalValue - 1)} />
                    </div>

                </div>

                <div className="reflect-wrapper">
                    <img className="reflect-image" 
                    src={require('../../components/images/journal/reflect.png')} alt="Temporary reflection icon"
                    onClick={() => handleOpenReflectModal() } />
                    <p style={{fontWeight: 'bold'}}>Reflect</p>
                </div>
            </div>]);
        handleGoalCountChange();  
        setRightScreenMode("Goal Selected Mode");

        const newData = [...dataList, {"goalDetails": "Get at least 60 minutes of physical activity per day", "goalQuantity": 60, "goalType": "Activity"}];
        setDataList(newData);

***REMOVED***

    function addScreentimeGoal() {

        setGoalArray( updatedArray => [...updatedArray, 
            <div className="current-goal">
                <div className="goal-container">

                    <div className="goal-description">
                        <h3 className="goal-text">{"Limit screentime to 2 hours a day"}</h3>
                        <h6 className="goal-text">{"Use devices like phones, laptops, and TV's less."}</h6>
                    </div>

                    <div className="selection-container">

                        <IoIosArrowUp id="upIcon" onClick={() => setNumericalValue(numericalValue + 1) } />
                        <h2 className="number-text">{2}</h2>
                        <IoIosArrowDown id="downIcon" onClick={() => setNumericalValue(numericalValue - 1)} />
                    </div>

                </div>

                <div className="reflect-wrapper">
                    <img className="reflect-image" 
                    src={require('../../components/images/journal/reflect.png')} alt="Temporary reflection icon" 
                    onClick={() => handleOpenReflectModal() } />
                    <p style={{fontWeight: 'bold'}}>Reflect</p>
                </div>
            </div>]);
        handleGoalCountChange(); 
        setRightScreenMode("Goal Selected Mode"); 

        const newData = [...dataList, {"goalDetails": "Limit screentime to 2 hours a day", "goalQuantity": 2, "goalType": "Screentime"}];
        setDataList(newData);

***REMOVED***

    function addSleepGoal() {

        setGoalArray( updatedArray => [...updatedArray, 
            <div className="current-goal">
                <div className="goal-container">

                    <div className="goal-description">
                        <h3 className="goal-text">{"Sleep at least 9 hours a night"}</h3>
                        <h6 className="goal-text">{"Get anywhere from 9-11 hours of sleep a night to feel the best."}</h6>
                    </div>

                    <div className="selection-container">

                        <IoIosArrowUp id="upIcon" onClick={() => setNumericalValue(numericalValue + 1) } />
                        <h2 className="number-text">{9}</h2>
                        <IoIosArrowDown id="downIcon" onClick={() => setNumericalValue(numericalValue - 1)} />
                    </div>

                </div>

                <div className="reflect-wrapper">
                    <img className="reflect-image" 
                    src={require('../../components/images/journal/reflect.png')} alt="Temporary reflection icon" 
                    onClick={() => handleOpenReflectModal() } />
                    <p style={{fontWeight: 'bold'}}>Reflect</p>
                </div>
            </div>]);
        handleGoalCountChange();  
        setRightScreenMode("Goal Selected Mode");

        const newData = [...dataList, {"goalDetails": "Sleep at least 9 hours a night", "goalQuantity": 9, "goalType": "Sleep"}];
        setDataList(newData);

***REMOVED***

    function addReflection() {
        setReflectionArray( updatedArray => [...updatedArray,
            <div className="current-goal">
                {reflection}
            </div>
        ]
        );
***REMOVED***;

    const createGoalModal = () => {
        return (
            <Modal
                aria-labelledby="goal-modal"
                aria-describedby="modal-to-create-new-goal"
                open={open}
                onClose={handleCloseGoalModal}
            >
                <div className="modal">
                <h2>Edit Your Goal Progress</h2>
                <h4>Goal Name</h4>
                    <input className="modal-input" type="text" name="goal" onChange={handleGoalChange} value={goal}/>
                <h4>How much have you progressed towards your goal this week?</h4>
                    <input className="modal-input" type="text" name="goal" onChange={handleGoalChange} value={goal}/>
                <Button style={{backgroundColor: '#ADF083', width: '80%', textTransform: 'none', fontWeight: 'bold', fontSize: '18px',
                    borderRadius: '20px'}}
                    onClick={() => { handleCloseDefineModal(); addGoal(); }}
                    >
                        Log Progress
                </Button>
                </div>
            </Modal>
        );
    //         <Modal
    //             aria-labelledby="goal-modal"
    //             aria-describedby="modal-to-create-new-goal"
    //             open={open}
    //             onClose={handleCloseGoalModal}
    //         >
    //             <div className="modal">
    //                 <h2>Edit Your Goal Progress</h2>
    //                 <h4>Goal Name</h4>
    //                 <input className="modal-input" type="text" name="goal" onChange={handleGoalChange} value={goal}/>
    //                 <h4 className="progress-title">Keep track of your progress with a:</h4>

    //                 <div className="radio-group">
    //                     {booleanSelected ?
    //                     <Button style={{backgroundColor: '#AB87FF', marginTop: '4%', borderRadius: '20px', width: '90%', height: '60px',
    //                     textTransform: 'none', fontWeight: 'bold', fontSize: '18px', color: 'white'}}
    //                     onClick={() => { setBooleanSelected(false); setProgressError(true); }}
    //                     >Yes or No</Button> 
    //                     :
    //                     <Button style={{backgroundColor: '#ECECEC', marginTop: '4%', borderRadius: '20px', width: '90%', height: '60px',
    //                     textTransform: 'none', fontWeight: 'bold', fontSize: '18px'}}
    //                     onClick={() => { setBooleanSelected(true); setNumberSelected(false); setTimerSelected(false); setProgressError(false); }}
    //                     >Yes or No</Button>
    //                 ***REMOVED***

    //                     <FaQuestionCircle className="tip-icon" size={28}/>
    //                 </div>

    //                 <div className="radio-group">
    //                     {numberSelected ?
    //                     <Button style={{backgroundColor: '#AB87FF', marginTop: '4%', borderRadius: '20px', width: '90%', height: '60px',
    //                     textTransform: 'none', fontWeight: 'bold', fontSize: '18px', color: 'white'}}
    //                     onClick={() => { setNumberSelected(false); setProgressError(true); }}
    //                     >Numeric Value</Button> 
    //                     :
    //                     <Button style={{backgroundColor: '#ECECEC', marginTop: '4%', borderRadius: '20px', width: '90%', height: '60px',
    //                     textTransform: 'none', fontWeight: 'bold', fontSize: '18px'}}
    //                     onClick={() => { setNumberSelected(true); setBooleanSelected(false); setTimerSelected(false); setProgressError(false); }}
    //                     >Numeric Value</Button>
    //                 ***REMOVED***

    //                     <FaQuestionCircle className="tip-icon" size={28}/>
    //                 </div>

    //                 <div className="radio-group">
    //                     {timerSelected ?
    //                     <Button style={{backgroundColor: '#AB87FF', marginTop: '4%', borderRadius: '20px', width: '90%', height: '60px',
    //                     textTransform: 'none', fontWeight: 'bold', fontSize: '18px', color: 'white'}}
    //                     onClick={() => { setTimerSelected(false); setProgressError(true); }}
    //                     >Timer</Button> 
    //                     :
    //                     <Button style={{backgroundColor: '#ECECEC', marginTop: '4%', borderRadius: '20px', width: '90%', height: '60px',
    //                     textTransform: 'none', fontWeight: 'bold', fontSize: '18px'}}
    //                     onClick={() => { setTimerSelected(true); setBooleanSelected(false); setNumberSelected(false); setProgressError(false); }}
    //                     >Timer</Button>
    //                 ***REMOVED***

    //                     <FaQuestionCircle className="tip-icon" size={28}/>
    //                 </div> 
                    
    //                 {progressError &&
    //                 <div className="progress-error">
    //                     <h4>Please select a progress tracking method before moving on!</h4>
    //                 </div>}

    //                 <div className="nav-options">
    //                     <Button style={{backgroundColor: '#D9D9D9', width: '45%', textTransform: 'none', fontWeight: 'bold', fontSize: '18px',
    //                     borderRadius: '20px'}}
    //                     onClick={() => { handleCloseGoalModal(); setBooleanSelected(false); setNumberSelected(false); setTimerSelected(false); }}
    //                     >
    //                         Cancel
    //                     </Button>

    //                     <Button style={{backgroundColor: '#ADF083', width: '45%', textTransform: 'none', fontWeight: 'bold', fontSize: '18px',
    //                     borderRadius: '20px'}}
    //                     onClick={() => { handleOpenDefineModal(); }}
    //                     >
    //                         Next Step
    //                     </Button>
    //                 </div>

    //             </div>
    //         </Modal>
    //     );
    // };
***REMOVED***;

    function defineGoalModal() {

        return (
            
            <Modal
                aria-labelledby="define-modal"
                aria-describedby="modal-to-define-new-goal"
                open={defineOpen}
                onClose={handleCloseDefineModal}
            >
                <div className="modal">
                {booleanSelected &&
                <div className="inside-modal">
                    <h2>Defining a New Goal</h2>
                    <h4>Goal Name</h4>
                    <input className="modal-input" type="text" name="goal" placeholder="Goal Name" onChange={handleGoalChange} value={goal}/>
                    <h2>Have you achieved your goal?</h2>
                    <FormGroup onChange={ () => {handleGoalIsCompleteChange(); console.log(goalIsComplete);} }
                    sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        marginTop: '2%',
                ***REMOVED***}>
                        <FormControlLabel sx={{
                            color: 'black'
                    ***REMOVED***}
                        control={<Switch color="secondary"/>} label="Goal complete?" />
                    </FormGroup>
                    <h5 className="example-text">Example: "Eat fruits / vegetables" At least 5 times a day.</h5>
                    <input className="modal-input" type="text" name="description" placeholder="Optional Description..." onChange={handleDescriptionChange} value={description}/>
                </div>
            ***REMOVED***

                {numberSelected &&
                <div className="inside-modal">
                    <h2>Defining a New Goal</h2>
                    <h4>Goal Name</h4>
                    <input className="modal-input" type="text" name="goal" placeholder="Goal Name" onChange={handleGoalChange} value={goal}/>
                    <div className="goal-selection">
                        <select className="numerical-selection" id="numerical-selection" name="numerical-select" defaultValue={"at_least"} >
                            <option value={"at_least"}>At least</option>
                            <option value={"at_most"}>At most</option>
                            <option value={"equals"}>Equals</option>
                            <option value={"greater_than"}>Greater than</option>
                            <option value={"less_than"}>Less than</option>
                        </select>
                        <input className="numerical-selection" type="number" onChange={handleNumericalChange} placeholder="Quantity" value={numericalValue}/>
                    </div>
                    <input className="modal-half-input" type="text" name="goal-measurement" placeholder="Unit of measurement"
                    onChange={handleUnitChange} value={unit} />
                    <h5 className="example-text">Example: "Eat fruits / vegetables" At least 5 times a day.</h5>
                    <input className="modal-input" type="text" name="description" placeholder="Optional Description..." onChange={handleDescriptionChange} value={description}/>
                </div>
            ***REMOVED***

                {timerSelected &&
                <div className="inside-modal">
                    <h2>Defining a New Goal</h2>
                    <h4>Goal Name</h4>
                    <input className="modal-input" type="text" name="goal" placeholder="Goal Name" onChange={handleGoalChange} value={goal}/>
                    <div className="goal-selection">
                        <select className="numerical-selection" id="numerical-selection" name="numerical-select" defaultValue={"at_least"} >
                            <option value={"at_least"}>At least</option>
                            <option value={"at_most"}>At most</option>
                            <option value={"equals"}>Equals</option>
                            <option value={"greater_than"}>Greater than</option>
                            <option value={"less_than"}>Less than</option>
                        </select>
                        <input className="numerical-selection" type="number" onChange={handleNumericalChange} placeholder="Quantity" value={numericalValue}/>
                    </div>
                    <input className="modal-half-input" type="text" name="goal-measurement" placeholder="Unit of measurement"
                    onChange={handleUnitChange} value={unit} />
                    <h5 className="example-text">Example: "Eat fruits / vegetables" At least 5 times a day.</h5>
                    <input className="modal-input" type="text" name="description" placeholder="Optional Description..." onChange={handleDescriptionChange} value={description}/>
                </div>
            ***REMOVED***
                
                <div className="nav-options">
                        <Button style={{backgroundColor: '#D9D9D9', width: '45%', textTransform: 'none', fontWeight: 'bold', fontSize: '18px',
                        borderRadius: '20px'}}
                        onClick={() => { handleCloseDefineModal(); setBooleanSelected(false); setNumberSelected(false); setTimerSelected(false); setGoal(''); }}
                        >
                            Cancel
                        </Button>

                        <Button style={{backgroundColor: '#ADF083', width: '45%', textTransform: 'none', fontWeight: 'bold', fontSize: '18px',
                        borderRadius: '20px'}}
                        onClick={() => { handleCloseDefineModal(); addGoal(); }}
                        >
                            Create Goal
                        </Button>
                </div>

                </div>
                
            </Modal>
        );
***REMOVED***;

    function createReflectModal() {

        return (
            
            <Modal
                aria-labelledby="reflect-modal"
                aria-describedby="modal-to-reflect-on-goal"
                open={reflectOpen}
                onClose={handleCloseReflectModal}
            >
                <div className="modal">
                <div className="inside-modal">
                    <h2>Reflect on Your Goal</h2>
                    <h4>Give some thoughts on your goal progress so far.</h4>
                    <input className="modal-input" type="text" name="reflection" placeholder="Reflection thoughts" 
                    onChange={handleReflectionChange} value={reflection}/>
                    {reflectionArray}
                </div>
                            
                <div className="nav-options">
                        <Button style={{backgroundColor: '#D9D9D9', width: '45%', textTransform: 'none', fontWeight: 'bold', fontSize: '18px',
                        borderRadius: '20px'}}
                        onClick={() => { handleCloseReflectModal(); }}
                        >
                            Cancel
                        </Button>

                        <Button style={{backgroundColor: '#ADF083', width: '45%', textTransform: 'none', fontWeight: 'bold', fontSize: '18px',
                        borderRadius: '20px'}}
                        onClick={() => { handleCloseReflectModal(); addReflection(); }}
                        >
                            Reflect
                        </Button>
                </div>

                </div>
                
            </Modal>
        );
***REMOVED***;

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
                    alt="Gallery bookmark tab" />
                <div className="leftPageWrapper">                   
                                    
                    { rightScreenMode === "Eating Goal Mode" ?
                    
                    <div className="goal-box">
                        <h1 className="journal-title">Eating Goals</h1>

                                <div className="recommendation-container">
                                    
                                    <div className="text-container">
                                        <div className="eating-goal-image">
                                            <img src={require('../../components/images/journal/apple.png')} alt="Apple for servings goal"/>
                                        </div>

                                        <div className="selection-container">
                                            <h3 className="eating-goal-header">Eat 5 servings of fruits/vegetables</h3>
                                            <p>Eating fruits and vegetables can help you be healthy and get the vitamins and nutrients for a more balanced diet.</p>
                                        </div>

                                    </div>

                                    <div className="button-container">
                                        <Button variant="contained"
                                                startIcon={<img src={require("../../components/images/journal/brain.png")} 
                                                alt="Brain for learn more button"/>}
                                                style={{backgroundColor: '#9B8EEB', textTransform: 'none', fontWeight: 'bold', fontSize: '14px',
                                                borderRadius: '25px', color: 'white', width: '150px', marginTop: '5%'}}
                                                onClick={() => console.log('l')}
                                                >
                                                    Learn More
                                                </Button>
                                                <Button style={{backgroundColor: '#78C648', textTransform: 'none', fontWeight: 'bold', fontSize: '14px',
                                                borderRadius: '25px', color: 'white', width: '175px', marginTop: '5%'}}
                                                onClick={() => { addEatingGoal() }}
                                                >
                                                    Add to My Goals
                                        </Button>
                                    </div>
                                </div>

                    </div>

                    : rightScreenMode === "Activity Goal Mode" ?

                    <div className="goal-box">
                        <h1 className="journal-title">Activity Goals</h1>

                        <div className="recommendation-container">
                                    
                                    <div className="text-container">
                                        <div className="eating-goal-image">
                                        <img className="activity" src={require('../../components/images/journal/activity_goals.png')} alt="Activity goals icon on activity goals page"/>
                                        </div>

                                        <div className="selection-container">
                                            <h3 className="eating-goal-header">Get physical activity for 60 minutes a day</h3>
                                            <p>Getting active and breaking into a sweat will keep your body happy and healthy.</p>
                                        </div>

                                    </div>

                                    <div className="button-container">
                                        <Button variant="contained"
                                                startIcon={<img src={require("../../components/images/journal/brain.png")} 
                                                alt="Brain for learn more button"/>}
                                                style={{backgroundColor: '#9B8EEB', textTransform: 'none', fontWeight: 'bold', fontSize: '14px',
                                                borderRadius: '25px', color: 'white', width: '150px', marginTop: '5%'}}
                                                onClick={() => { setRightScreenMode('Other Goal Mode') }}
                                                >
                                                    Learn More
                                                </Button>
                                                <Button style={{backgroundColor: '#78C648', textTransform: 'none', fontWeight: 'bold', fontSize: '14px',
                                                borderRadius: '25px', color: 'white', width: '175px', marginTop: '5%'}}
                                                onClick={() => { addActivityGoal() }}
                                                >
                                                    Add to My Goals
                                        </Button>
                                    </div>
                                </div>

                    </div>

                    : rightScreenMode === "Screentime Goal Mode" ?

                    <div className="goal-box">
                        <h1 className="journal-title">Screentime Goals</h1>

                        <div className="recommendation-container">
                                    
                                    <div className="text-container">
                                        <div className="eating-goal-image">
                                            <img src={require('../../components/images/journal/tablet_icon.png')} alt="Apple for servings goal"/>
                                        </div>

                                        <div className="selection-container">
                                            <h3 className="eating-goal-header">Limit screen time to 2 hours a day</h3>
                                            <p>Keeping your screen time low and getting fresh air outside can help your mind and eyes.</p>
                                        </div>

                                    </div>

                                    <div className="button-container">
                                        <Button variant="contained"
                                                startIcon={<img src={require("../../components/images/journal/brain.png")} 
                                                alt="Brain for learn more button"/>}
                                                style={{backgroundColor: '#9B8EEB', textTransform: 'none', fontWeight: 'bold', fontSize: '14px',
                                                borderRadius: '25px', color: 'white', width: '150px', marginTop: '5%'}}
                                                onClick={() => { setRightScreenMode('Other Goal Mode') }}
                                                >
                                                    Learn More
                                                </Button>
                                                <Button style={{backgroundColor: '#78C648', textTransform: 'none', fontWeight: 'bold', fontSize: '14px',
                                                borderRadius: '25px', color: 'white', width: '175px', marginTop: '5%'}}
                                                onClick={() => { addScreentimeGoal() }}
                                                >
                                                    Add to My Goals
                                        </Button>
                                    </div>
                                </div>

                    </div>

                    : rightScreenMode === "Sleep Goal Mode" ?

                    <div className="goal-box">
                        <h1 className="journal-title">Screentime Goals</h1>

                        <div className="recommendation-container">

                        <div className="text-container">

                            <div className="eating-goal-image">
                                <img src={require('../../components/images/journal/pillow_icon.png')} alt="Crossed out candy icon for avoid sugary food"/>
                            </div>

                            <div className="selection-container">
                                <h3 className="eating-goal-header">Get 9 hours of sleep a day</h3>
                                <p>Getting a good amount of sleep improves focus while lowering stress and risk of serious health problems.</p>
                            </div>

                        </div>

                        <div className="button-container">
                            <Button variant="contained"
                                    startIcon={<img src={require("../../components/images/journal/brain.png")} 
                                    alt="Brain for learn more button"/>}
                                    style={{backgroundColor: '#9B8EEB', textTransform: 'none', fontWeight: 'bold', fontSize: '14px',
                                    borderRadius: '25px', color: 'white', width: '150px', marginTop: '5%'}}
                                    onClick={() => { setRightScreenMode('Other Goal Mode') }}
                                    >
                                        Learn More
                                    </Button>
                                    <Button style={{backgroundColor: '#78C648', textTransform: 'none', fontWeight: 'bold', fontSize: '14px',
                                    borderRadius: '25px', color: 'white', width: '175px', marginTop: '5%'}}
                                    onClick={() => { addSleepGoal() }}
                                    >
                                        Add to My Goals
                            </Button>
                        </div>

                        </div>

                    </div>

                    : rightScreenMode === "Goal Selected Mode" ?

                    <div className="goal-box">
                        <h4>You've selected a goal. Do your best! If you still want to work on more goals right now, click the yellow "Goals" tab on the right page.</h4>
                    </div>

                    : rightScreenMode === "Progress Mode" ?

                    <div className="goal-box">
                        <h1>Progress Checking Mode</h1>
                            { goalCount === 0 ?
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
                                        <img className="eating-goal-image" src={require('../../components/images/journal/eating_goals.png')} alt="Eating goals icon"/>

                                        <div className="selection-container">
                                            <h3>Eating</h3>
                                            <p>Changing up eating habits can improve your health. See some recommended diet goals here!</p>
                                        </div>
                                    </div>

                                    <div className="single-button-container">
                                        <Button style={{backgroundColor: '#78C648', textTransform: 'none', fontWeight: 'bold', fontSize: '18px',
                                        borderRadius: '25px', color: 'white', width: '175px', marginTop: '5%' }}
                                        onClick={() => { setRightScreenMode('Eating Goal Mode') }}
                                        >
                                            Set Goals
                                        </Button>
                                    </div>

                                </div>

                                <div className="recommendation-container">

                                    <div className="text-container">
                                        <img className="activity" src={require('../../components/images/journal/activity_goals.png')} alt="Eating goals icon"/>

                                        <div className="selection-container">
                                            <h3>Activity</h3>
                                            <p>Getting active and breaking into a sweat will keep your body happy. See some recommended activity goals here!</p>
                                        </div>
                                    </div>

                                    <div className="single-button-container">
                                        <Button style={{backgroundColor: '#78C648', textTransform: 'none', fontWeight: 'bold', fontSize: '18px',
                                        borderRadius: '25px', color: 'white', width: '175px', marginTop: '5%' }}
                                        onClick={() => { setRightScreenMode('Activity Goal Mode') }}
                                        >
                                            Set Goals
                                        </Button>
                                    </div>

                                </div>

                                <div className="recommendation-container">

                                    <div className="text-container">
                                        <img className="screentime" src={require('../../components/images/journal/tablet_icon.png')} alt="Eating goals icon"/>

                                        <div className="selection-container">
                                            <h3>Screentime</h3>
                                            <p>Limiting your screentime can improve your focus and make you more productive to reach healthy goals!</p>
                                        </div>
                                    </div>

                                    <div className="single-button-container">
                                        <Button style={{backgroundColor: '#78C648', textTransform: 'none', fontWeight: 'bold', fontSize: '18px',
                                        borderRadius: '25px', color: 'white', width: '175px', marginTop: '5%' }}
                                        onClick={() => { setRightScreenMode('Screentime Goal Mode') }}
                                        >
                                            Set Goals
                                        </Button>
                                    </div>

                                </div>

                                <div className="recommendation-container">

                                    <div className="text-container">
                                        <img className="sleep" src={require('../../components/images/journal/pillow_icon.png')} alt="Eating goals icon"/>

                                        <div className="selection-container">
                                            <h3>Sleep</h3>
                                            <p>Getting more sleep is important to work best and lower risk of major health problems.</p>
                                        </div>
                                    </div>

                                    <div className="single-button-container">
                                        <Button style={{backgroundColor: '#78C648', textTransform: 'none', fontWeight: 'bold', fontSize: '18px',
                                        borderRadius: '25px', color: 'white', width: '175px', marginTop: '5%' }}
                                        onClick={() => { setRightScreenMode('Sleep Goal Mode') }}
                                        >
                                            Set Goals
                                        </Button>
                                    </div>

                                </div>
                    </div>

                ***REMOVED***

                    <img className="leftpage1" src={require('../../components/images/journal/right_page.png')} 
                    alt="First left-side page"/>
                    <img className="leftpage2" src={require('../../components/images/journal/right_page2.png')} 
                    alt="Second left-side page" />
                    <img className="leftpage3" src={require('../../components/images/journal/right_page.png')} 
                    alt="Third left-side page"/>
                </div>
                <img className="middle-line" src={require('../../components/images/journal/middle_line.png')} alt="Middle journal line"/>
                <div className="rightPageWrapper">
                <img className="bookmark" src={require('../../components/images/journal/bookmark.png')} alt="Yellow bookmark icon"/>
                <div className="goal-box">
                            <h1 className="journal-title">My Goals</h1>
                            { goalCount === 0 ? 
                            <div className="goal-text">You don't have any goals added yet. Add some recommended behaviors from the left page to start!</div> 
                            :
                            <div>
                                {goalArray}
                                <Button style={{marginTop: '5%', backgroundColor: '#ADF083', borderRadius: '20px', width: '70%',
                                height: '60px', textTransform: 'none', fontSize: '20px', fontWeight: 'bold'}}
                                onClick = {() => handleOpenGoalModal()}
                                >Update Progress</Button>
                                </div>
                        ***REMOVED***

                            <CSV />
                            
                            {createGoalModal()}
                            {defineGoalModal()}
                            {createReflectModal()}
                        </div>
                        <img className="rightpage1" src={require('../../components/images/journal/left_page.png')} 
                        alt="First right-side page" />
                        <img className="rightpage2" src={require('../../components/images/journal/left_page2.png')} 
                        alt="Second right-side page"/>
                        <img className="rightpage3" src={require('../../components/images/journal/left_page3.png')} 
                        alt="Third right-side page"/>
                </div>
            </div>
        </div>
    );
};

export default JournalScreen;

// numerical rating for reflection
// percentage of progress from survey questions (multiple modals)
// incorporate AI for reflections on virtual coach