import React from 'react';
import Button from '@material-ui/core/Button';

import '../css/header.css';

const Header = () => {
    return (
        <nav>
            <div>
                <Button style={{backgroundColor: "#B18EEB"}}>ProudMe</Button>
            </div>
        </nav>
    );
}

export default Header;
