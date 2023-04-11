import React, { useState, useEffect } from 'react';
import Button from '@material-ui/core/Button';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import '../css/login.css';

const LoginScreen = () => {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isSubmitted, setIsSubmitted] = useState(false);

    const navigate = useNavigate();

    const handleSubmit = (event) => {
      event.preventDefault();
      
      axios.post('http://localhost:3000/login', { 
        email, 
        password 
  ***REMOVED***)
        .then(response => {
          console.log(response.data);
    ***REMOVED***)
        .catch(error => {
      ***REMOVED***
        ***REMOVED***
***REMOVED***;

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
