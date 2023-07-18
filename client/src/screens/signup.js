import React, { useState } from "react";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
import {
  Checkbox,
  FormGroup,
  FormControlLabel,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import axios from "axios";
import { CircularProgress } from "@mui/material";

import "../css/signup.css";

const SignUpScreen = () => {
  const navigate = useNavigate();

  // States for checking the errors
  const [submitted, setSubmitted] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [loading, setLoading] = useState(false);

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
    email: "",
  });

  // These methods will update the state properties.
  function updateForm(value) {
    return setForm((prev) => {
      return { ...prev, ...value };
    });
  }

  // This function will handle the submission.
  const handleSubmit = (event) => {
    setLoading(true);
    event.preventDefault();
    axios
      .post("http://localhost:3001/signup", {
        email: form.email,
        password: form.password,
        confirmPassword: form.confirmPassword,
        name: form.name,
        firstName: form.firstName,
        lastName: form.lastName,
        schoolName: form.schoolAttending,
        birthMonth: form.birthMonth,
        birthYear: form.birthYear,
        gradeLevel: form.gradeLevel,
        gender: form.gender,
      })
      .then((response) => {
        setLoading(false);
        setSubmitted(true);
        console.log(response.data);
      })
      .catch((error) => {
        console.error(error);
        if (error.response.data == "Email is already in use") {
          console.log('t');
          setLoginError("Email is already registered. Try signing in or using a different email!");
        } else if (error.response.data == "Username is already in use!") {
          setLoginError("Username is already registered. Try signing in or using a different username!")
        }
        setLoading(false);
      })
      .then(() => {
        alert(loginError);
      });
  };

  const renderForm = (
    <div className="signup">
      <form className="signup-form" onSubmit={handleSubmit}>
        <div className="input-container">
          <label>Username: </label>
          <input
            className="input"
            onChange={(e) => updateForm({ name: e.target.value })}
            type="text"
            value={form.name}
            required
          />
        </div>
        <div className="input-container">
          <label>Password: </label>
          <input
            className="input"
            onChange={(e) => updateForm({ password: e.target.value })}
            type="password"
            value={form.password}
            required
          />
        </div>
        <div className="input-container">
          <label>Confirm Password: </label>
          <input
            className="input"
            onChange={(e) => updateForm({ confirmPassword: e.target.value })}
            type="password"
            value={form.confirmPassword}
            required
          />
        </div>
        <div className="line-container">
          <div className="row-container">
            <label>First Name: </label>
            <input
              className="dropdown"
              onChange={(e) => updateForm({ firstName: e.target.value })}
              type="text"
              value={form.firstName}
              required
            />
          </div>
          <div className="row-container">
            <label>Last Name: </label>
            <input
              className="dropdown"
              onChange={(e) => updateForm({ lastName: e.target.value })}
              type="text"
              value={form.lastName}
              required
            />
          </div>
          <div className="row-container">
            <label>School Attending: </label>
            <input
              className="dropdown"
              placeholder="Full school name"
              onChange={(e) => updateForm({ schoolAttending: e.target.value })}
              type="text"
              value={form.schoolAttending}
              required
            />
          </div>
        </div>
        <div className="line-container">
          <div className="row-container">
            <label>Birth Month: </label>
            <Select
              className="dropdown"
              name="month"
              onChange={(e) => updateForm({ birthMonth: e.target.value })}
              required
              displayEmpty
              value={form.birthMonth}
              style={{ width: 190, backgroundColor: "white" }}
            >
              <MenuItem disabled value="">
                <div style={{ opacity: 0.6 }}>Select an Option</div>
              </MenuItem>
              <MenuItem value="January">January</MenuItem>
              <MenuItem value="February">February</MenuItem>
              <MenuItem value="March">March</MenuItem>
              <MenuItem value="April">April</MenuItem>
              <MenuItem value="May">May</MenuItem>
              <MenuItem value="June">June</MenuItem>
              <MenuItem value="July">July</MenuItem>
              <MenuItem value="August">August</MenuItem>
              <MenuItem value="September">September</MenuItem>
              <MenuItem value="November">November</MenuItem>
              <MenuItem value="December">December</MenuItem>
            </Select>
          </div>
          <div className="row-container">
            <label>Birth Year: </label>
            <Select
              className="dropdown"
              name="year"
              onChange={(e) => updateForm({ birthYear: e.target.value })}
              required
              displayEmpty
              value={form.birthYear}
              style={{ width: 190, backgroundColor: "white" }}
            >
              <MenuItem disabled value="">
                <div style={{ opacity: 0.6 }}>Select an Option</div>
              </MenuItem>
              <MenuItem value="1990">1990</MenuItem>
              <MenuItem value="1991">1991</MenuItem>
              <MenuItem value="1992">1992</MenuItem>
              <MenuItem value="1993">1993</MenuItem>
              <MenuItem value="1994">1994</MenuItem>
              <MenuItem value="1995">1995</MenuItem>
              <MenuItem value="1996">1996</MenuItem>
              <MenuItem value="1997">1997</MenuItem>
              <MenuItem value="1998">1998</MenuItem>
              <MenuItem value="1999">1999</MenuItem>
              <MenuItem value="2000">2000</MenuItem>
              <MenuItem value="2001">2001</MenuItem>
              <MenuItem value="2002">2002</MenuItem>
              <MenuItem value="2003">2003</MenuItem>
              <MenuItem value="2004">2004</MenuItem>
              <MenuItem value="2005">2005</MenuItem>
              <MenuItem value="2006">2006</MenuItem>
              <MenuItem value="2007">2007</MenuItem>
              <MenuItem value="2008">2008</MenuItem>
              <MenuItem value="2009">2009</MenuItem>
              <MenuItem value="2010">2010</MenuItem>
              <MenuItem value="2011">2011</MenuItem>
              <MenuItem value="2012">2012</MenuItem>
              <MenuItem value="2013">2013</MenuItem>
              <MenuItem value="2014">2014</MenuItem>
              <MenuItem value="2015">2015</MenuItem>
              <MenuItem value="2016">2016</MenuItem>
              <MenuItem value="2017">2017</MenuItem>
              <MenuItem value="2018">2018</MenuItem>
              <MenuItem value="2019">2019</MenuItem>
              <MenuItem value="2020">2020</MenuItem>
              <MenuItem value="2021">2021</MenuItem>
              <MenuItem value="2022">2022</MenuItem>
              <MenuItem value="2023">2023</MenuItem>
            </Select>
          </div>
          <div className="row-container">
            <label>Grade Level: </label>
            <Select
              className="dropdown"
              name="grade"
              onChange={(e) => updateForm({ schoolYear: e.target.value })}
              style={{ width: 190, backgroundColor: "white" }}
              value={form.schoolYear}
              required
              displayEmpty
            >
              <MenuItem disabled value="">
                <div style={{ opacity: 0.6 }}>Select an Option</div>
              </MenuItem>
              <MenuItem value="prek">Pre-K</MenuItem>
              <MenuItem value="kindergarten">Kindergarten</MenuItem>
              <MenuItem value="first">1st</MenuItem>
              <MenuItem value="second">2nd</MenuItem>
              <MenuItem value="third">3rd</MenuItem>
              <MenuItem value="fourth">4th</MenuItem>
              <MenuItem value="fifth">5th</MenuItem>
              <MenuItem value="sixth">6th</MenuItem>
              <MenuItem value="seventh">7th</MenuItem>
              <MenuItem value="eighth">8th</MenuItem>
              <MenuItem value="ninth">9th</MenuItem>
              <MenuItem value="tenth">10th</MenuItem>
              <MenuItem value="eleventh">11th</MenuItem>
              <MenuItem value="twelfth">12th</MenuItem>
              <MenuItem value="other">Other</MenuItem>
            </Select>
          </div>
        </div>
        <div className="line-container">
          <div className="input-container">
            <label>Gender: </label>
            <Select
              className="dropdown"
              value={form.gender}
              name="gender"
              onChange={(e) => updateForm({ gender: e.target.value })}
              required
              displayEmpty
              style={{ width: 200, backgroundColor: "white" }}
            >
              <MenuItem disabled value="">
                <div style={{ opacity: 0.6 }}>Select an Option</div>
              </MenuItem>
              <MenuItem value="male">Male</MenuItem>
              <MenuItem value="female">Female</MenuItem>
              <MenuItem value="other">Other</MenuItem>
              <MenuItem value="none">Prefer not to tell</MenuItem>
            </Select>
          </div>
          <div className="input-container">
            <label>Email Address: </label>
            <input
              className="input"
              type="text"
              onChange={(e) => updateForm({ email: e.target.value })}
              value={form.email}
              required
            />
          </div>
        </div>
        <div className="row-container">
          <div className="checkbox-container">
            <FormGroup>
              <FormControlLabel
                control={<Checkbox />}
                label={
                  <Typography style={{ color: "black" }}>
                    I agree to the Terms of Use & Privacy Policy.
                  </Typography>
                }
              />
              <FormControlLabel
                control={<Checkbox />}
                label={
                  <Typography style={{ color: "black" }}>
                    I agree to receive news ad updates by email from ProudME.
                  </Typography>
                }
              />
            </FormGroup>
          </div>
        </div>
        <div className="button-container">
          <Button
            style={{
              backgroundColor: "#D7A746",
              color: "white",
              padding: "10px 50px 10px 50px",
              borderRadius: "20px",
              textTransform: "none",
              marginTop: "3%",
              margin: "auto",
              height: "60px",
              width: "25%",
              fontSize: "25px",
            }}
            type="submit"
            value="Register user"
          >
            Register
          </Button>
        </div>
        <div className="signup-registration">
          <h2>
            Already have an account?{" "}
            <a className="nav-select" onClick={() => navigate("/login")}>
              Sign In!
            </a>
          </h2>
        </div>
      </form>
    </div>
  );

  function successMessage() {
    setTimeout(() => {
      navigate("/");
    }, 3000);
    return (
      <div className="success" style={styles.messageText}>
        User {form.name} successfully registered!
      </div>
    );
  }

  return (
    <div className="signup-page">
      <h1 id="welcome">Thanks for joining ProudME!</h1>
      {submitted ? (
        successMessage()
      ) : loading ? (
        <CircularProgress />
      ) : (
        renderForm
      )}
    </div>
  );
};

export default SignUpScreen;

const styles = {
  messageText: {
    fontSize: "30px",
    fontWeight: "bold",
  },
};
