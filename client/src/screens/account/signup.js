import React, { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
import {
  Checkbox,
  FormGroup,
  FormControlLabel,
  Typography,
  Select,
  MenuItem,
  TextField,
} from "@mui/material";
import axios from "axios";
import { CircularProgress } from "@mui/material";
import styled from "styled-components";

import "../../css/signup.css";
import { DATABASE_URL } from "../../constants";

const FormWrapper = styled.div`
  background-color: white;
  width: 50%;
  position: absolute;
  right: 0;
  top: 0;
  font-family: Roboto;
  height: 140vh;
`;

const generateVerificationCode = () => {
  const charset =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let code = "";
  let length = 8;
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    code += charset[randomIndex];
  }
  return code;
};

const SignUpScreen = () => {
  const navigate = useNavigate();

  // States for checking the errors
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [verificationCode, setVerificationCode] = useState(
    generateVerificationCode()
  );
  const [passwordMatch, setPasswordMatch] = useState(true);
  const [emailError, setEmailError] = useState(false);
  const [usernameError, setUsernameError] = useState(false);

  const [accountConfirm, setAccountConfirm] = useState("");

  const [form, setForm] = useState({
    name: "",
    firstName: "",
    lastName: "",
    gender: "",
    gradeLevel: "",
    schoolAttending: "",
    password: "",
    confirmPassword: "",
    birthMonth: "",
    birthYear: "",
    email: "",
  });

  useEffect(() => {
    if (
      form.confirmPassword !== form.password &&
      form.password &&
      form.confirmPassword
    ) {
      setPasswordMatch(false);
    } else {
      setPasswordMatch(true);
    }
  }, [form.password, form.confirmPassword]);

  // These methods will update the state properties.
  function updateForm(value) {
    return setForm((prev) => {
      return { ...prev, ...value };
    });
  }

  const handleAccountConfirmChange = (e) => {
    setAccountConfirm(e.target.value);
  };

  const handleAccountConfirm = async (event) => {
    event.preventDefault();
    setLoading(true);
    if (verificationCode === accountConfirm) {
      await axios
        .post(`${DATABASE_URL}/signup`, {
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
        .then(() => {
          setLoading(false);
          setSubmitted(true);
          setConfirming(false);
        })
        .catch((error) => {
          console.log(error);
          if (error.response.data === "Email is already in use") {
            alert(
              "Email is already in use. Please try signing up again with a different email account."
            );
          } else if (error.response.data === "Username is already in use") {
            alert(
              "Username is already in use. Please try signing up again with a different email account."
            );
          }
          console.error(error);
          setLoading(false);
        });
    }
  };

  const handleEmailBlur = async (e) => {
    const response = await axios.get(`${DATABASE_URL}/user`, {
      params: {
        email: form.email,
      },
    });
    if (!response.data) {
      setEmailError(false);
    } else {
      setEmailError(true);
    }
  };

  const handleUsernameBlur = async (e) => {
    const response = await axios.get(`${DATABASE_URL}/user`, {
      params: {
        email: form.name,
      },
    });
    console.log(response);
    if (!response.data) {
      setUsernameError(false);
    } else {
      setUsernameError(true);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const newEmailData = {
        subject: "Project ProudME Registration Confirmation",
        to: form.email,
        text:
          `Hi ${form.name},\n\nYou are receiving this email because you recently registered a new account on the Project ProudME webpage. \n\nEnter the confirmation code listed to confirm your email account: ` +
          verificationCode +
          " \n\nProject ProudME Team \nLouisiana State University \nPedagogical Kinesiology Lab",
      };
      await axios.post(`${DATABASE_URL}/send-email`, newEmailData);
      setConfirming(true);
    } catch (error) {
      console.error(error);
    }
  };

  const renderForm = (
    <>
      <img
        src={require("../../components/images/login/schoolkids.png")}
        alt="Jumping schoolkids"
        style={{
          width: "auto",
          height: "140vh",
          objectFit: "cover",
          position: "absolute",
          left: 0,
          top: 0,
        }}
      />
      <img
        src={require("../../components/images/login/purple_background.png")}
        alt="Purple vector background"
        style={{
          width: "auto",
          height: "140vh",
          objectFit: "cover",
          position: "absolute",
          left: 0,
          top: 0,
          opacity: 0.8,
        }}
      />
      <FormWrapper>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            height: "100%",
          }}
        >
          <img
            src={require("../../components/images/login/logo.png")}
            alt="ProudME mini official Logo"
            style={{ position: "absolute", top: 20, right: 20 }}
          />
          <div
            style={{
              fontFamily: "Montserrat",
              fontSize: 38,
              width: "70%",
              margin: "0 auto",
              textAlign: "left",
              paddingTop: "5%",
            }}
          >
            Thank you for joining ProudME!
          </div>
          <form onSubmit={handleSubmit}>
            <div className="input-container">
              <label>Username: </label>
              <input
                className={
                  usernameError ? "error-signup-input" : "signup-input"
                }
                onChange={(e) => updateForm({ name: e.target.value })}
                onBlur={handleUsernameBlur}
                type="text"
                value={form.name}
                required
              />
              {usernameError && (
                <h4 style={{ color: "rgb(255, 0, 0, 0.8)" }}>
                  Username in use. Please login or use a different username.
                </h4>
              )}
            </div>
            <div className="input-container">
              <label>Password: </label>
              <input
                className="signup-input"
                onChange={(e) => updateForm({ password: e.target.value })}
                type="password"
                value={form.password}
                required
              />
            </div>
            <div className="input-container">
              <label>Confirm Password: </label>
              <input
                className={
                  !passwordMatch ? "error-signup-input" : "signup-input"
                }
                onChange={(e) =>
                  updateForm({ confirmPassword: e.target.value })
                }
                type="password"
                value={form.confirmPassword}
                required
              />
              {!passwordMatch && (
                <h4 style={{ color: "rgb(255, 0, 0, 0.8  )" }}>
                  Please make sure your passwords match.
                </h4>
              )}
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
                  onChange={(e) =>
                    updateForm({ schoolAttending: e.target.value })
                  }
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
                  style={{ backgroundColor: "white", width: "100%" }}
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
                  <MenuItem value="October">October</MenuItem>
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
                  style={{ backgroundColor: "white", width: 175 }}
                >
                  <MenuItem disabled value="">
                    <div style={{ opacity: 0.6 }}>Select an Option</div>
                  </MenuItem>
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
                  <MenuItem value="2017">2018</MenuItem>
                </Select>
              </div>
              <div className="row-container">
                <label>Grade Level: </label>
                <Select
                  className="dropdown"
                  name="grade"
                  onChange={(e) => updateForm({ gradeLevel: e.target.value })}
                  style={{ backgroundColor: "white", width: 175 }}
                  value={form.gradeLevel}
                  required
                  displayEmpty
                >
                  <MenuItem disabled value="">
                    <div style={{ opacity: 0.6 }}>Select an Option</div>
                  </MenuItem>
                  <MenuItem value="fifth">5th</MenuItem>
                  <MenuItem value="sixth">6th</MenuItem>
                  <MenuItem value="seventh">7th</MenuItem>
                  <MenuItem value="eighth">8th</MenuItem>
                  <MenuItem value="ninth">9th</MenuItem>
                </Select>
              </div>
            </div>
            <div className="line-container">
              <div className="row-container">
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
              <div className="overflow-row-container">
                <label>Email Address: </label>
                <input
                  className={emailError ? "error-signup-input" : "signup-input"}
                  type="text"
                  onChange={(e) => updateForm({ email: e.target.value })}
                  onBlur={handleEmailBlur}
                  value={form.email}
                  required
                />
                {emailError && (
                  <h4 style={{ color: "rgb(255, 0, 0, 0.8)" }}>
                    Email in use. Please login or use a different email.
                  </h4>
                )}
              </div>
            </div>
            <div className="row-container">
              <div className="checkbox-container">
                <FormGroup>
                  <FormControlLabel
                    control={<Checkbox required />}
                    label={
                      <Typography style={{ color: "black" }}>
                        I agree to the{" "}
                        <a
                          target="blank"
                          href="https://www.freeprivacypolicy.com/live/94b2fbf3-9648-4b6c-8816-c38b7f14f912"
                        >
                          Terms of Use & Privacy Policy.
                        </a>
                      </Typography>
                    }
                  />
                  <FormControlLabel
                    control={<Checkbox required />}
                    label={
                      <Typography style={{ color: "black" }}>
                        I agree to receive news ad updates by email from
                        ProudME.
                      </Typography>
                    }
                  />
                </FormGroup>
              </div>
            </div>
            <div className="button-container">
              <Button
                style={{
                  backgroundColor: "#3C3293",
                  color: "white",
                  padding: "10px 50px 10px 50px",
                  borderRadius: "20px",
                  textTransform: "none",
                  marginTop: "3%",
                  margin: "auto",
                  height: "60px",
                  width: "25%",
                  fontSize: "25px",
                  opacity: (emailError || usernameError || !passwordMatch) && 0.4
                }}
                type="submit"
                disabled={(emailError || usernameError || !passwordMatch) && true}
                value="Register user"
              >
                Register
              </Button>
            </div>
          </form>
          {confirming && (
            <div style={{ marginTop: "2%" }}>
              Enter the confirmation code sent to your email to confirm your
              account registration!
              <form
                style={{
                  display: "flex",
                  justifyContent: "center",
                  marginTop: "2%",
                }}
                onSubmit={handleAccountConfirm}
              >
                <TextField
                  type="text"
                  name="account-confirm"
                  value={accountConfirm}
                  onChange={handleAccountConfirmChange}
                  placeholder="Verification Code"
                  style={{ width: "20%" }}
                />
                <Button
                  style={{
                    backgroundColor: "green",
                    textTransform: "none",
                    color: "white",
                  }}
                  type="submit"
                >
                  Confirm Account
                </Button>
              </form>
            </div>
          )}
          <div className="signup-registration">
            <h2>
              Already have an account?{" "}
              <a className="nav-select" onClick={() => navigate("/login")}>
                Sign In!
              </a>
            </h2>
          </div>
        </div>
      </FormWrapper>
    </>
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
    <div style={{ height: "140vh" }}>
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
