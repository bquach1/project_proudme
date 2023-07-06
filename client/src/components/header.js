import React from 'react';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';

import '../css/header.css';

const Header = () => {

    let navigate = useNavigate();

    const token = localStorage.getItem('authToken');

    return (
        <nav>
            <div className="left-nav">
                <Button 
                    style={{backgroundColor: "#B2C5CB", padding: "10px 15px 10px 15px", borderRadius: "50px", color: "white", fontWeight: "bold", fontSize: "20px"}}
                    onClick={() => navigate('/home')}
                    >PROUDME</Button>
                <Button 
                    style={{backgroundColor: "transparent", padding: "5px 15px 5px 15px", borderRadius: "25px", color: "white", fontWeight: "bold", textTransform: "none", fontSize: "16px"}}
                    onClick={() => navigate('/pet')}
                    >My Pet</Button>
                <Button 
                    style={{backgroundColor: "transparent", padding: "5px 15px 5px 15px", borderRadius: "25px", color: "white", fontWeight: "bold", textTransform: "none", fontSize: "16px"}}
                    onClick={() => navigate('/journal')}
                    >My Journal</Button>
                <Button 
                    style={{backgroundColor: "transparent", padding: "5px 15px 5px 15px", borderRadius: "25px", color: "white", fontWeight: "bold", textTransform: "none", fontSize: "16px"}}
                    onClick={() => navigate('/pet')}
                    >Pet Store</Button>
                <Button 
                    style={{backgroundColor: "transparent", padding: "5px 15px 5px 15px", borderRadius: "25px", color: "white", fontWeight: "bold", textTransform: "none", fontSize: "16px"}}
                    onClick={() => navigate('/pe')}
                    >ProudME PE</Button>
                <Button 
                    style={{backgroundColor: "transparent", padding: "5px 15px 5px 15px", borderRadius: "25px", color: "white", fontWeight: "bold", textTransform: "none", fontSize: "16px"}}
                    onClick={() => navigate('/tracking')}
                    >Track Behaviors (Admin)</Button>
            </div>

            <div className="right-nav">
                {token === null ?
                <p className="nav-link" onClick={() => navigate('/login')}>Sign In</p>
                : 
                <p className="nav-link" 
                onClick={() => {navigate('/login'); localStorage.removeItem('authToken')}}>Sign Out</p>
                }                
            </div>
        </nav>
    );
}

export default Header;
