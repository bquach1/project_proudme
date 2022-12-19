import React from 'react';
import Button from '@material-ui/core/Button';
import { useNavigate } from 'react-router-dom';
import { slide as Menu } from 'react-burger-menu';

import '../css/header.css';

const Header = () => {

    let navigate = useNavigate();

    return (
        <nav>
            
            <div className="left-nav">
                <Button 
                    style={{backgroundColor: "#B18EEB", padding: "10px 15px 10px 15px", borderRadius: "50px", color: "white", fontWeight: "bold", fontSize: "20px"}}
                    onClick={() => navigate('/home')}
                    >PROUDME</Button>
                <Button 
                    style={{backgroundColor: "#FFACE4", padding: "5px 15px 5px 15px", borderRadius: "25px", color: "white", fontWeight: "bold", textTransform: "none", fontSize: "16px"}}
                    onClick={() => navigate('/pet')}
                    >My Pet</Button>
                <Button 
                    style={{backgroundColor: "#FF9770", padding: "5px 15px 5px 15px", borderRadius: "25px", color: "white", fontWeight: "bold", textTransform: "none", fontSize: "16px"}}
                    onClick={() => navigate('/journal')}
                    >My Journal</Button>
                <Button 
                    style={{backgroundColor: "#94E065", padding: "5px 15px 5px 15px", borderRadius: "25px", color: "white", fontWeight: "bold", textTransform: "none", fontSize: "16px"}}
                    onClick={() => navigate('/pet')}
                    >Pet Store</Button>
                <Button 
                    style={{backgroundColor: "#AB87FF", padding: "5px 15px 5px 15px", borderRadius: "25px", color: "white", fontWeight: "bold", textTransform: "none", fontSize: "16px"}}
                    onClick={() => navigate('/pet')}
                    >ProudME PE</Button>
            </div>

            <div className="right-nav">
                <a className="nav-link" href="/login">Sign In</a>
                <div className="nav-link">|</div>
                <a className="nav-link" href="/pet">For Grown-Ups</a>
            </div>

        </nav>
    );
}

export default Header;
