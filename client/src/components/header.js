import React from 'react';
import Button from '@material-ui/core/Button';
import { useNavigate } from 'react-router-dom';

import '../css/header.css';

const Header = () => {

    let navigate = useNavigate();

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
                    onClick={() => navigate('/csv')}
                    >CSV Reader</Button>
            </div>

            <div className="right-nav">
                <p className="nav-link" onClick={() => navigate('/login')}>Sign In</p>
                <div className="nav-text">|</div>
                <p className="nav-link" onClick={() => navigate('/pet')}>For Grown-Ups</p>
            </div>
        </nav>
    );
}

export default Header;