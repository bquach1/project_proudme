import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import { useNavigate } from 'react-router-dom';
import { Checkbox, FormGroup, FormControlLabel, Typography } from '@material-ui/core';

import '../css/signup.css';

const SignUpScreen = () => {

    const navigate = useNavigate();

    // States for registration
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [emailConfirm, setEmailConfirm] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirm, setPasswordConfirm] = useState('');
    const [month, setMonth] = useState('');
    const [day, setDay] = useState('');
    const [year, setYear] = useState('');

    // States for checking the errors
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState(false);

    // Handling the name change
    const handleName = (e) => {
        setName(e.target.value);
        setSubmitted(false);
***REMOVED***;

    // Handling the email change
    const handleEmail = (e) => {
        setEmail(e.target.value);
        setSubmitted(false);
***REMOVED***;

    const handleEmailConfirm = (e) => {
        setEmailConfirm(e.target.value);
        setSubmitted(false);
***REMOVED***;

    // Handling the password change
    const handlePassword = (e) => {
        setPassword(e.target.value);
        setSubmitted(false);
***REMOVED***;

    const handlePasswordConfirm = (e) => {
        setPasswordConfirm(e.target.value);
        setSubmitted(false);
***REMOVED***

    const handleMonth = (e) => {
        setMonth(e.target.value);
        setSubmitted(false);
***REMOVED***;

    const handleDay = (e) => {
        setDay(e.target.value);
        setSubmitted(false);
***REMOVED***;

    const handleYear = (e) => {
        setYear(e.target.value);
        setSubmitted(false);
***REMOVED***;

    // Handling the form submission
    const handleSubmit = (e) => {
    e.preventDefault();
    if (name === '' || email === '' || password === '') {
        setError(true);
***REMOVED***
        setSubmitted(true);
        setError(false);
***REMOVED***
***REMOVED***;

    const renderForm = (
        <div className="signup">
          <form onSubmit={handleSubmit}>
            <div className="input-container">
              <label>Username: </label>
              <input className="input" onChange={handleName} type="text" value={name} required />
            </div>
            <div className="input-container">
              <label>Password: </label>
              <input className="input" onChange={handlePassword} type="password" value={password} required />
            </div>
            <div className="input-container">
              <label>Confirm Password: </label>
              <input className="input" onChange={handlePasswordConfirm} type="password" value={passwordConfirm} required />
            </div>
            <div className="input-container">
                <label>Date of Birth: </label>
                <div className="birth-container">
                    <select className="dropdown" name="month" onChange={handleMonth} value={month} required>
                        <option value="January">January</option>
                        <option value="February">February</option>
                        <option value="March">March</option>
                        <option value="April">April</option>
                        <option value="May">May</option>
                        <option value="June">June</option>
                        <option value="July">July</option>
                        <option value="August">August</option>
                        <option value="September">September</option>
                        <option value="October">January</option>
                        <option value="November">November</option>
                        <option value="December">December</option>
                    </select>
                    <select className="dropdown" name="day" onChange={handleDay} value={day} required>
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                        <option value="5">5</option>
                        <option value="6">6</option>
                        <option value="7">7</option>
                        <option value="8">8</option>
                        <option value="9">9</option>
                        <option value="10">10</option>
                        <option value="11">11</option>
                        <option value="12">12</option>
                        <option value="12">12</option>
                        <option value="13">13</option>
                        <option value="14">14</option>
                        <option value="15">15</option>
                        <option value="16">16</option>
                        <option value="17">17</option>
                        <option value="18">18</option>
                        <option value="19">19</option>
                        <option value="20">20</option>
                        <option value="21">21</option>
                        <option value="22">22</option>
                        <option value="23">23</option>
                        <option value="24">24</option>
                        <option value="25">25</option>
                        <option value="26">26</option>
                        <option value="27">27</option>
                        <option value="28">28</option>
                        <option value="29">29</option>
                        <option value="30">30</option>
                        <option value="31">31</option>
                    </select>
                    <select className="dropdown" name="year" onChange={handleYear} value={year} required>
                        <option value="1940">1940</option>
                        <option value="1941">1941</option>
                        <option value="1942">1942</option>
                        <option value="1943">1943</option>
                        <option value="1944">1944</option>
                        <option value="1945">1945</option>
                        <option value="1946">1946</option>
                        <option value="1947">1947</option>
                        <option value="1948">1948</option>
                        <option value="1949">1949</option>
                        <option value="1950">1950</option>
                        <option value="1951">1951</option>
                        <option value="1952">1952</option>
                        <option value="1953">1953</option>
                        <option value="1954">1954</option>
                        <option value="1955">1955</option>
                        <option value="1956">1956</option>
                        <option value="1957">1957</option>
                        <option value="1958">1958</option>
                        <option value="1959">1959</option>
                        <option value="1960">1960</option>
                        <option value="1961">1961</option>
                        <option value="1962">1962</option>
                        <option value="1963">1963</option>
                        <option value="1964">1964</option>
                        <option value="1965">1965</option>
                        <option value="1966">1966</option>
                        <option value="1967">1967</option>
                        <option value="1968">1968</option>
                        <option value="1969">1969</option>
                        <option value="1970">1970</option>
                        <option value="1971">1971</option>
                        <option value="1972">1972</option>
                        <option value="1973">1973</option>
                        <option value="1974">1974</option>
                        <option value="1975">1975</option>
                        <option value="1976">1976</option>
                        <option value="1977">1977</option>
                        <option value="1978">1978</option>
                        <option value="1979">1979</option>
                        <option value="1980">1980</option>
                        <option value="1981">1981</option>
                        <option value="1982">1982</option>
                        <option value="1983">1983</option>
                        <option value="1984">1984</option>
                        <option value="1985">1985</option>
                        <option value="1986">1986</option>
                        <option value="1987">1987</option>
                        <option value="1988">1988</option>
                        <option value="1989">1989</option>
                        <option value="1990">1990</option>
                        <option value="1991">1991</option>
                        <option value="1992">1992</option>
                        <option value="1993">1993</option>
                        <option value="1994">1994</option>
                        <option value="1995">1995</option>
                        <option value="1996">1996</option>
                        <option value="1997">1997</option>
                        <option value="1998">1998</option>
                        <option value="1999">1999</option>
                        <option value="2000">2000</option>
                        <option value="2001">2001</option>
                        <option value="2002">2002</option>
                        <option value="2003">2003</option>
                        <option value="2004">2004</option>
                        <option value="2005">2005</option>
                        <option value="2006">2006</option>
                        <option value="2007">2007</option>
                        <option value="2008">2008</option>
                        <option value="2009">2009</option>
                        <option value="2010">2010</option>
                        <option value="2011">2011</option>
                        <option value="2012">2012</option>
                        <option value="2013">2013</option>
                        <option value="2014">2014</option>
                        <option value="2015">2015</option>
                        <option value="2016">2016</option>
                        <option value="2017">2017</option>
                        <option value="2018">2018</option>
                        <option value="2019">2019</option>
                        <option value="2020">2020</option>
                        <option value="2021">2021</option>
                        <option value="2022">2022</option>
                    </select>
                </div>
                <div className="input-container">
                <label>Email Address: </label>
                    <input className="input" onChange={handleEmail} type="text" value={email} required />
                </div>
                <div className="input-container">
                <label>Confirm Email Address: </label>
                    <input className="input" onChange={handleEmailConfirm} type="text" value={emailConfirm} required />
                </div>
                <div className="checkbox-container">
                  <FormGroup>
                    <FormControlLabel control={<Checkbox />} label = {<Typography variant="p" style={{color:'black'}}> 
                    I agree to the Terms of Use & Privacy Policy.</Typography>}/>
                    <FormControlLabel control={<Checkbox />} label = {<Typography variant="p" style={{color:'black'}}> 
                    I agree to receive news ad updates by email from ProudME.</Typography>}/>
                  </FormGroup>
                </div>
            </div>
            <div className="button-container">
              <Button 
                style={{backgroundColor: '#EF9090', color: 'white', padding: '10px 50px 10px 50px', 
                borderRadius: '20px', textTransform: 'none', marginTop: '2%', margin: 'auto', height: '60px', 
                width: '25%', fontSize: '25px'}}
                type="submit">
                    Register
              </Button>
            </div>
            <div className="registration">
                <h2>Already have an account? <a href='/login'>Sign In!</a></h2>
            </div>
          </form>
        </div>
    );

    const successMessage = () => {
        return (
          <div
            className="success"
            style={{
              display: submitted ? '' : 'none',
        ***REMOVED***}>
            <h1>User {name} successfully registered!!</h1>
          </div>
        );
  ***REMOVED***;
     
      // Showing error message if error is true
      const errorMessage = () => {
        return (
          <div
            className="error"
            style={{
              display: error ? '' : 'none',
        ***REMOVED***}>
            <h1>Please enter all the fields</h1>
          </div>
        );
  ***REMOVED***;

    return (
        <div className="login">
            <h1 id="welcome">Thanks for joining ProudME!</h1>
            {submitted ? successMessage : renderForm}
        </div>
    );
};

export default SignUpScreen;
