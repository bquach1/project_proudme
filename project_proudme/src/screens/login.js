import React, { useState, useEffect } from 'react';
import Button from '@material-ui/core/Button';
import { useNavigate } from 'react-router-dom';

import '../css/login.css';

const LoginScreen = () => {

    const navigate = useNavigate();

    const [form, setForm] = useState({
        name: "",
        password: "",
        birthMonth: "",
        birthDay: "",
        birthYear: "",
        email: ""
    ***REMOVED***

    const tempDatabase = [
        {
            username: "testUser",
            password: "testPassword"
    ***REMOVED***,
        {
            username: "testUser2",
            password: "testPassword2"
    ***REMOVED***
    ];

    const errors = {
        usernameError: "invalid username",
        passwordError: "invalid password"
***REMOVED***;

    const [errorMessages, setErrorMessages] = useState({***REMOVED***
    const [isSubmitted, setIsSubmitted] = useState(false);

    const renderErrorMessage = (name) => {
        name === errorMessages.name && (
            <div className="error">{errorMessages.message}</div>
        )
***REMOVED***;

    const [records, setRecords] = useState([]);
 
    // This method fetches the records from the database.
    useEffect(() => {
      async function getRecords() {
        const response = await fetch(`http://localhost:5000/record/`);
    
        if (!response.ok) {
          const message = `An error occurred: ${response.statusText}`;
          window.alert(message);
          return;
    ***REMOVED***
    
        const records = await response.json();
        setRecords(records);
        console.log(records);
  ***REMOVED***
    
      getRecords();
    
      return;
***REMOVED***, [records.length]);
    

    const handleSubmit = (event) => {
        event.preventDefault();

        var { usernameError, passwordError } = document.forms[0];

        const userData = records.find((user) => user.name === usernameError.value);
    
        console.log(userData);

        if (userData) {
            if (userData.password !== passwordError.value) {
                setErrorMessages({ name: "passwordError", message: errors.passwordError ***REMOVED***
        ***REMOVED*** 
            else {
                setIsSubmitted(true);
        ***REMOVED***
    ***REMOVED***
        else {
            setErrorMessages({ name: "usernameError", message: errors.usernameError ***REMOVED***
    ***REMOVED***
***REMOVED***;

    const renderForm = (
        <div className="form">
          <form onSubmit={handleSubmit}>
            <div className="input-container">
              <label>Username: </label>
              <input type="text" name="usernameError" required />
              {renderErrorMessage("usernameError")}
            </div>
            <div className="input-container">
              <label>Password: </label>
              <input type="password" name="passwordError" required />
              {renderErrorMessage("passwordError")}
            </div>
            <div className="button-container">
              <Button 
                style={{backgroundColor: '#EF9090', color: 'white', padding: '10px 50px 10px 50px', 
                borderRadius: '20px', textTransform: 'none', marginTop: '2%', height: '60px', 
                width: '25%', fontSize: '25px', margin: 'auto', marginBottom: '0px'}}
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

    function successfulLogin() {
        setTimeout(() => {
            navigate('/home');
    ***REMOVED***, 3000);
        return (
            <div className="success-login">User successfully logged in!</div>
        );
***REMOVED***

    return (
        <div className="login">
            <h1 id="welcome">Welcome back to ProudME!</h1>
            {isSubmitted ? successfulLogin() : renderForm}
        </div>
    );
};

export default LoginScreen;
