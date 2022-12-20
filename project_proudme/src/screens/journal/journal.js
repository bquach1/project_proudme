import React, { useState } from 'react';
import '../../css/journal.css';

import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { Radio, RadioGroup, FormControl, FormControlLabel, FormLabel } from '@mui/material';

const JournalScreen = () => {

    const [open, setOpen] = useState(false);

    const handleOpenGoalModal = () => {
        setOpen(true);
***REMOVED***;

    const handleCloseGoalModal = () => {
        setOpen(false);
***REMOVED***;

    return (
        <div className="journal">
            <h1 className="title">My Journal</h1>
            <div className="journalWrapper">
                <img className="journalCover" src={require('../../components/images/journal/journal_cover.png')}
                alt="Journal cover image" />
                <div className="leftPageWrapper">
                        <div className="goal-box">
                            <h1 className="journal-title">My Goals</h1>
                            <Button style={{marginTop: '10%', backgroundColor: '#ADF083', borderRadius: '20px', width: '70%',
                            height: '60px', textTransform: 'none', fontSize: '20px', fontWeight: 'bold'}}
                            onClick = {() => handleOpenGoalModal()}
                            >Create a New Goal</Button>
                            <Modal
                                aria-labelledby="simple-modal-title"
                                aria-describedby="simple-modal-description"
                                open={open}
                                onClose={handleCloseGoalModal}
                            >
                                <div className="modal">
                                    <h2>Creating a New Goal</h2>
                                    <h4>Goal Name</h4>
                                    <input className="modal-input" type="text" />
                                    <FormControl>
                                    <FormLabel id="demo-radio-buttons-group-label">Keep track of your progress with a:</FormLabel>
                                    <RadioGroup
                                        aria-labelledby="demo-radio-buttons-group-label"
                                        defaultValue="female"
                                        name="radio-buttons-group"
                                    >
                                        <FormControlLabel value="boolean" control={<Radio />} label="Yes or No" />
                                        <FormControlLabel value="number" control={<Radio />} label="Numeric Value" />
                                        <FormControlLabel value="timer" control={<Radio />} label="Timer" />
                                    </RadioGroup>
                                    </FormControl>
                                </div>
                            </Modal>
                        </div>
                        <img className="leftpage1" src={require('../../components/images/journal/left_page.png')} 
                        alt="First left-side page" />
                        <img className="leftpage2" src={require('../../components/images/journal/left_page2.png')} 
                        alt="Second left-side page"/>
                        <img className="leftpage3" src={require('../../components/images/journal/left_page3.png')} 
                        alt="Third left-side page"/>
                </div>
                <img className="middle-line" src={require('../../components/images/journal/middle_line.png')} alt="Middle journal line"/>
                <img className="bookmark" src={require('../../components/images/journal/bookmark.png')} alt="Yellow bookmark icon"/>
                <div className="rightPageWrapper">
                    <div className="goal-box">
                        <h1 className="journal-title">Recommended Goals</h1>
                    </div>
                    <img className="rightpage1" src={require('../../components/images/journal/right_page.png')} 
                    alt="First right-side page"/>
                    <img className="rightpage2" src={require('../../components/images/journal/right_page2.png')} 
                    alt="Second right-side page" />
                    <img className="rightpage3" src={require('../../components/images/journal/right_page.png')} 
                    alt="Third right-side page"/>
                </div>
            </div>
        </div>
    );
};

export default JournalScreen;