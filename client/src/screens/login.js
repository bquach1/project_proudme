import React, { useState, useEffect } from 'react';
import Button from '@material-ui/core/Button';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';

import '../css/login.css';

async function loginUser(credentials) {
    return fetch('http://localhost:8080/login', {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json'
    ***REMOVED***,
        body: JSON.stringify(credentials)
***REMOVED***)
        .then(data => data.json())
}

const LoginScreen = ({ setToken }) => {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isSubmitted, setIsSubmitted] = useState(false);

    const navigate = useNavigate();

    const handleSubmit = async e => {
        e.preventDefault();
        const token = await loginUser({
          email,
          password
        ***REMOVED***
        setToken(token);
***REMOVED***

    const renderForm = (
        <div className="form">
          <form onSubmit={handleSubmit}>
            <div className="input-container">
              <label>Email: </label>
              <input type="email" onChange={e => setEmail(e.target.value)} name="emailInput" required />
            </div>
            <div className="input-container">
              <label>Password: </label>
              <input type="password" onChange={e => setPassword(e.target.value)} name="passwordInput" required />
            </div>
            <div className="button-container">
              <Button 
                style={{backgroundColor: '#EF9090', color: 'white', padding: '10px 50px 10px 50px', 
                borderRadius: '20px', textTransform: 'none', marginTop: '2%', height: '60px', 
                width: '40%', fontSize: '25px', margin: 'auto', marginBottom: '0px'}}
                type="submit">
                    Log In
              </Button>
            </div>
            <div className="registration">
                <div className="registration-link">
                    <h2>Forgot your <a className="nav-link" onClick={() => navigate('/signup')}>Username or Password</a>?</h2>
                </div>
                <div className="registration-link">
                    <h2>Don't have an account? <a className="nav-link" onClick={() => navigate('/signup')}>Register Here</a>!</h2>
                </div>
            </div>
          </form>
        </div>
    );

    return (
        <div className="login">
            <h1 id="welcome">Welcome back to ProudME!</h1>
            {renderForm}
        </div>
    );
};

export default LoginScreen;

LoginScreen.propTypes = {
    setToken: PropTypes.func.isRequired
}