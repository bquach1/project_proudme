import React from 'react';
import Button from '@material-ui/core/Button';

import '../css/header.css';

const Header = () => {
    return (
        <nav>
            <div class="left-nav">
                <Button style={{backgroundColor: "#B18EEB", borderRadius: "50px", color: "white", fontFamily: "Roboto"}}>PROUDME</Button>
                <Button style={{backgroundColor: "#B18EEB", borderRadius: "50px", color: "white", fontFamily: "Roboto"}}>My Pet</Button>
                <Button style={{backgroundColor: "#B18EEB", borderRadius: "50px", color: "white", fontFamily: "Roboto"}}>My Journal</Button>
                <Button style={{backgroundColor: "#B18EEB", borderRadius: "50px", color: "white", fontFamily: "Roboto"}}>Pet Store</Button>
                <Button style={{backgroundColor: "#B18EEB", borderRadius: "50px", color: "white", fontFamily: "Roboto"}}>ProudME PE</Button>
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
