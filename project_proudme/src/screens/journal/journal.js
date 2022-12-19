import React from 'react';
import '../../css/journal.css';

const JournalScreen = () => {
    return (
        <div className="journal">
            <h1 className="title">My Journal</h1>
            <div className="journalWrapper">
                <img className="journalCover" src={require('../../components/images/journal/journal_cover.png')} />
                <div className="leftPageWrapper">
                    <img className="leftpage1" src={require('../../components/images/journal/left_page.png')} />
                </div>
            </div>
        </div>
    );
};

export default JournalScreen;