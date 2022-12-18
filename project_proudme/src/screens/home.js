import React from 'react';
import '../css/home.css';
import Button from '@material-ui/core/Button';

const HomeScreen = () => {
    return (
        <div className="home">
            <h1 className="title">Hello Username!</h1>
            <div className="imageWrapper">
            <div className="left-icons">
                <a href='/pet'>
                    <img className="miniGamesIcon" src={require('../components/images/mini_games_icon.png')} />
                </a>
                <a href='/pet'>
                    <img className="learnMoreIcon" src={require('../components/images/learn_more_icon.png')} />
                </a>
                <a href='/pet'>
                    <img className="petStoreIcon" src={require('../components/images/pet_store_icon.png')} />
                </a>
            </div>
                <img className="petRoom" src={require('../components/images/pet_room_icon.png')} />
                <Button style={{fontSize: '25px', position: 'absolute', 
                zIndex: '1', margin: 'auto', textTransform: 'none',
                backgroundColor: '#EED5AB', borderRadius: '50px', color: '#A87B06',
                fontWeight: 'bold',padding: '10px 30px 10px 30px', marginTop: '29%'}}>Visit PetName!</Button>
            <div className="right-icons">
                <a href='/journal'>
                    <img className="checkinIcon" src={require('../components/images/checkin_icon.png')} />
                </a>
                <a href='/journal'>
                    <img className="journalIcon" src={require('../components/images/journal_icon.png')} />
                </a>
            </div>
            </div>

            
        </div>
    );
};

export default HomeScreen;