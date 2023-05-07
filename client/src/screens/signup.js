import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import { useNavigate } from 'react-router-dom';
import { Checkbox, FormGroup, FormControlLabel, Typography } from '@material-ui/core';
import axios from 'axios';

import '../css/signup.css';

const SignUpScreen = () => {

  const navigate = useNavigate();

  // States for checking the errors
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(false);

  const [form, setForm] = useState({
    name: "",
    firstName: "",
    lastName: "",
    gender: "",
    schoolYear: "",
    schoolAttending: "",
    password: "",
    confirmPassword: "",
    birthMonth: "",
    birthYear: "",
    email: ""
  });

  // These methods will update the state properties.
  function updateForm(value) {
    return setForm((prev) => {
      return { ...prev, ...value };
    });
  }

  // This function will handle the submission.
  const handleSubmit = (event) => {
    event.preventDefault();
    axios.post('https://project-proudme.onrender.com/signup', { email: form.email, password: form.password, confirmPassword: form.confirmPassword })
      .then(response => {
        console.log(response.data);
      })
      .catch(error => {
        console.error(error);
      });
  };

  const renderForm = (
    <div className="signup">
      <form className="signup-form" onSubmit={handleSubmit}>
        <div className="input-container">
          <label>Username: </label>
          <input className="input" onChange={(e) => updateForm({ name: e.target.value })} type="text" value={form.name} required />
        </div>
        <div className="input-container">
          <label>Password: </label>
          <input className="input" onChange={(e) => updateForm({ password: e.target.value })} type="password" value={form.password} required />
        </div>
        <div className="input-container">
          <label>Confirm Password: </label>
          <input className="input" onChange={(e) => updateForm({ confirmPassword: e.target.value })} type="password" value={form.confirmPassword} required />
        </div>
        <div className="line-container">
          <div className="row-container">
            <label>First Name: </label>
            <input className="dropdown" onChange={(e) => updateForm({ firstName: e.target.value })} type="text" value={form.firstName} required />
          </div>
          <div className="row-container">
            <label>Last Name: </label>
            <input className="dropdown" onChange={(e) => updateForm({ lastName: e.target.value })} type="text" value={form.lastName} required />
          </div>
          <div className="row-container">
            <label>School Attending: </label>
            <input className="dropdown" placeholder="Full school name" onChange={(e) => updateForm({ schoolAttending: e.target.value })} type="text" value={form.schoolAttending} required />
          </div>
        </div>
        <div className="line-container">
          <div className="row-container">
            <label>Birth Month: </label>
            <select className="dropdown" name="month" onChange={(e) => updateForm({ birthMonth: e.target.value })} required>
              <option value="" selected disabled hidden>Select an option</option>
              <option value="January">January</option>
              <option value="February">February</option>
              <option value="March">March</option>
              <option value="April">April</option>
              <option value="May">May</option>
              <option value="June">June</option>
              <option value="July">July</option>
              <option value="August">August</option>
              <option value="September">September</option>
              <option value="November">November</option>
              <option value="December">December</option>
            </select>
          </div>
          <div className="row-container">
            <label>Birth Year: </label>
            <select className="dropdown" name="year" onChange={(e) => updateForm({ birthYear: e.target.value })} required>
              <option value="" selected disabled hidden>Select an option</option>
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
          <div className="row-container">
            <label>Grade Level: </label>
            <select className="dropdown" name="grade" onChange={(e) => updateForm({ gradeLevel: e.target.value })} required>
              <option value="" selected disabled hidden>Select an option</option>
              <option value="prek">Pre-K</option>
              <option value="kindergarten">Kindergarten</option>
              <option value="first">1st</option>
              <option value="second">2nd</option>
              <option value="third">3rd</option>
              <option value="fourth">4th</option>
              <option value="fifth">5th</option>
              <option value="sixth">6th</option>
              <option value="seventh">7th</option>
              <option value="eighth">8th</option>
              <option value="ninth">9th</option>
              <option value="tenth">10th</option>
              <option value="eleventh">11th</option>
              <option value="twelfth">12th</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>
        <div className="line-container">
          <div className="input-container">
            <label>Gender: </label>
            <select className="dropdown" name="gender" onChange={(e) => updateForm({ gender: e.target.value })} required>
              <option value="" selected disabled hidden>Select an option</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
              <option value="none">Prefer not to tell</option>
            </select>
          </div>
          <div className="input-container">
            <label>Email Address: </label>
            <input className="input" type="text" onChange={(e) => updateForm({ email: e.target.value })} value={form.email} required />
          </div>
        </div>
        <div className="row-container">
          <div className="checkbox-container">
            <FormGroup>
              <FormControlLabel control={<Checkbox />} label={<Typography style={{ color: 'black' }}>
                I agree to the Terms of Use & Privacy Policy.</Typography>} />
              <FormControlLabel control={<Checkbox />} label={<Typography style={{ color: 'black' }}>
                I agree to receive news ad updates by email from ProudME.</Typography>} />
            </FormGroup>
          </div>
        </div>
        <div className="button-container">
          <Button
            style={{
              backgroundColor: '#D7A746', color: 'white', padding: '10px 50px 10px 50px',
              borderRadius: '20px', textTransform: 'none', marginTop: '3%', margin: 'auto', height: '60px',
              width: '25%', fontSize: '25px'
            }}
            type="submit" value="Register user">
            Register
          </Button>
        </div>
        <div className="signup-registration">
          <h2>Already have an account? <a className="nav-select" onClick={() => navigate('/login')}>Sign In!</a></h2>
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
        }}>
        <h1>User {form.name} successfully registered!!</h1>
      </div>
    );
  };

  // Showing error message if error is true
  const errorMessage = () => {
    return (
      <div
        className="error"
        style={{
          display: error ? '' : 'none',
        }}>
        <h1>Please enter all the fields</h1>
      </div>
    );
  };

  return (
    <div className="signup-page">
      <h1 id="welcome">Thanks for joining ProudME!</h1>
      {submitted ? successMessage : renderForm}
    </div>
  );
};

export default SignUpScreen;

// have left page recommended goals removed after child adds a goal to the right page.
// automated feedback, move right page to left page after goal added, reflection on right page after click (blank at first).