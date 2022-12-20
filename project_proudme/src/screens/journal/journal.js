import React from 'react';
import '../../css/journal.css';

const JournalScreen = () => {
    return (
        <div className="journal">
            <h1 className="title">My Journal</h1>
            <div className="journalWrapper">
                <img className="journalCover" src={require('../../components/images/journal/journal_cover.png')}
                alt="Journal cover image" />
                <div className="leftPageWrapper">
                        <div className="goal-box">
                            <h1>My Goals</h1>
                        </div>
                        <img className="leftpage1" src={require('../../components/images/journal/left_page.png')} 
                        alt="First left-side page" />
                        <img className="leftpage2" src={require('../../components/images/journal/left_page2.png')} 
                        alt="Second left-side page"/>
                        <img className="leftpage3" src={require('../../components/images/journal/left_page3.png')} 
                        alt="Third left-side page"/>
                </div>
                <img className="bookmark" src={require('../../components/images/journal/bookmark.png')} />
                <div className="rightPageWrapper">
                    <img className="rightpage1" src={require('../../components/images/journal/right_page.png')} 
                    alt="First right-side page"/>
                    <img className="rightpage2" src={require('../../components/images/journal/right_page2.png')} 
                    alt="Second right-side page" />
                    <img className="rightpage3" src={require('../../components/images/journal/right_page3.png')} 
                    alt="Third right-side page"/>
                </div>
            </div>
        </div>
    );
};

export default JournalScreen;