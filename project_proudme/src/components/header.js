import React from 'react';
import Button from '@material-ui/core/Button';
import { useNavigate } from 'react-router-dom';

import '../css/header.css';

const Header = () => {

    let navigate = useNavigate();

    return (
        <nav>
            <div class="left-nav">
                <Button 
                    style={{backgroundColor: "#B18EEB", padding: "5px 15px 5px 15px", borderRadius: "50px", color: "white", fontWeight: "bold", fontSize: "20px"}}
                    onClick={() => navigate('/home')}
                    >PROUDME</Button>
                <Button 
                    style={{backgroundColor: "#FFACE4", borderRadius: "25px", color: "white", fontWeight: "bold", textTransform: "none"}}
                    onClick={() => navigate('/pet')}
                    >My Pet</Button>
                <Button 
                    style={{backgroundColor: "#FF9770", borderRadius: "50px", color: "white", fontWeight: "bold", textTransform: "none"}}
                    onClick={() => navigate('/journal')}
                    >My Journal</Button>
                <Button 
                    style={{backgroundColor: "#94E065", borderRadius: "50px", color: "white", fontWeight: "bold", textTransform: "none"}}
                    onClick={() => navigate('/pet')}
                    >Pet Store</Button>
                <Button 
                    style={{backgroundColor: "#AB87FF", borderRadius: "50px", color: "white", fontWeight: "bold", textTransform: "none"}}
                    onClick={() => navigate('/pet')}
                    >ProudME PE</Button>
            </div>
            {/* <div>
                <Button style={{backgroundColor: "#B18EEB", borderRadius: "50px", color: "white", fontFamily: "Roboto"}}>Sign In</Button>
                <Button style={{backgroundColor: "#B18EEB", borderRadius: "50px", color: "white", fontFamily: "Roboto"}}>ProudME PE</Button>
                <Button style={{backgroundColor: "#B18EEB", borderRadius: "50px", color: "white", fontFamily: "Roboto"}}>ProudME PE</Button>
            </div> */}
        </nav>
    );
}

export default Header;
