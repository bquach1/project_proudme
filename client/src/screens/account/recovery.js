import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button, TextField } from "@mui/material";
import { styled } from "styled-components";
import { useNavigate } from "react-router-dom";
import bcrypt from 'bcryptjs';

import { DATABASE_URL } from "../../constants";

const ButtonPageWrapper = styled.div`
  height: calc(100vh - 80px);
  display: flex;
  flex-direction: column;
  margin: auto;
`;

const RecoveryWrapper = styled.div`
  margin-top: 2%;
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

const Recovery = () => {
  const navigate = useNavigate();
  const [verificationCode, setVerificationCode] = useState(
    generateVerificationCode()
  );

  const [email, setEmail] = useState("");
  const [emailData, setEmailData] = useState({
    to: "",
    from: "quachbruce@gmail.com",
    subject: "Project ProudME Password Recovery",
    text:
      "Enter the confirmation code listed to reset your password: " +
      verificationCode,
  });
  const [confirming, setConfirming] = useState(false);
  const [confirmedPassword, setConfirmedPassword] = useState(false);

  const [resetPassword, setResetPassword] = useState("");
  const [resetPasswordConfirm, setResetPasswordConfirm] = useState("");

  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [resetMode, setResetMode] = useState("");

  useEffect(() => {
    console.log(verificationCode);
    console.log(resetPassword);
    console.log(resetPasswordConfirm);
  });

  useEffect(() => {
    setEmailData((prevEmailData) => ({
      ...prevEmailData,
      to: email,
    }));
  }, [email]);

  const handleChange = (event) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setResetPassword(event.target.value);
  };

  const handlePasswordConfirmChange = (event) => {
    setResetPasswordConfirm(event.target.value);
  };

  const handleEmailConfirmChange = (event) => {
    setPasswordConfirm(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setConfirming(true);
    axios.post(`${DATABASE_URL}/send-email`, emailData).catch((error) => {
      console.error(error);
    });
  };

  const changePassword = async () => {
    const hashedPassword = await bcrypt.hash(resetPassword, 10);
    console.log(hashedPassword);
    axios.post(`${DATABASE_URL}/user`, {
      email: email,
      password: hashedPassword,
    })
    navigate("/login");
  }

  const handleEmailConfirm = (event) => {
    event.preventDefault();
    if (verificationCode === passwordConfirm) {
      setConfirming(false);
      setConfirmedPassword(true);
    }
  };

  const handleUsernameSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.get(`${DATABASE_URL}/user`, {
        params: {
          email: email,
        },
      });
      const newEmailData = {
        subject: "Project ProudME Username Recovery",
        to: email,
        text:
          "The username associated with this email account is " +
          response.data[0].name +
          ".",
      };

      setEmailData(newEmailData);

      await axios.post(`${DATABASE_URL}/send-email`, newEmailData);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      {resetMode === "password" ? (
        <RecoveryWrapper>
          <h1>Recover Password</h1>
          {confirmedPassword ? (
            <>
              <div>
                <TextField
                  type="password"
                  name="password"
                  value={resetPassword}
                  onChange={handlePasswordChange}
                  placeholder="New Password"
                  style={{ width: "40%" }}
                />
                <TextField
                  type="password"
                  name="confirm-password"
                  value={resetPasswordConfirm}
                  onChange={handlePasswordConfirmChange}
                  placeholder="Confirm New Password"
                  style={{ width: "40%" }}
                />
              </div>
              <div style={{marginTop: "2%"}}>
                <Button
                  style={{
                    backgroundColor: "green",
                    textTransform: "none",
                    color: "white",
                  }}
                  onClick={() => changePassword()}
                >
                  Change Password
                </Button>
              </div>
            </>
          ) : (
            <>
              <form
                style={{ display: "flex", justifyContent: "center" }}
                onSubmit={handleSubmit}
              >
                <TextField
                  type="email"
                  name="to"
                  value={email}
                  onChange={handleChange}
                  placeholder="Your Email"
                  style={{ width: "70%" }}
                />
                <Button
                  style={{
                    backgroundColor: "green",
                    textTransform: "none",
                    color: "white",
                  }}
                  type="submit"
                >
                  Send Email
                </Button>
              </form>
              {confirming && (
                <div style={{ marginTop: "2%" }}>
                  Enter the confirmation code sent to your email to reset your
                  password!
                  <form
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      marginTop: "2%",
                    }}
                    onSubmit={handleEmailConfirm}
                  >
                    <TextField
                      type="password"
                      name="password-confrim"
                      value={passwordConfirm}
                      onChange={handleEmailConfirmChange}
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
                      Confirm Email
                    </Button>
                  </form>
                </div>
              )}
              <Button
                style={{
                  backgroundColor: "#D7A746",
                  color: "white",
                  padding: "10px 50px 10px 50px",
                  borderRadius: "20px",
                  textTransform: "none",
                  width: "40%",
                  fontSize: "25px",
                  margin: "auto",
                  display: "flex",
                  alignSelf: "center",
                  marginTop: "3%",
                }}
                onClick={() => navigate("/login")}
              >
                Back to Login
              </Button>
            </>
          )}
        </RecoveryWrapper>
      ) : resetMode === "username" ? (
        <RecoveryWrapper>
          <h1>Recover Username</h1>
          <form
            style={{
              display: "flex",
              justifyContent: "center",
              marginTop: "2%",
            }}
            onSubmit={handleUsernameSubmit}
          >
            <TextField
              type="email"
              name="to"
              value={email}
              onChange={handleChange}
              placeholder="Your Email"
              style={{ width: "70%" }}
            />
            <Button
              style={{
                backgroundColor: "green",
                textTransform: "none",
                color: "white",
              }}
              type="submit"
            >
              Send Email
            </Button>
          </form>
          <Button
            style={{
              backgroundColor: "#D7A746",
              color: "white",
              padding: "10px 50px 10px 50px",
              borderRadius: "20px",
              textTransform: "none",
              width: "40%",
              fontSize: "25px",
              margin: "auto",
              display: "flex",
              alignSelf: "center",
              marginTop: "3%",
            }}
            onClick={() => navigate("/login")}
          >
            Back to Login
          </Button>
        </RecoveryWrapper>
      ) : (
        <ButtonPageWrapper>
          <Button
            style={{
              backgroundColor: "#D7A746",
              color: "white",
              padding: "10px 50px 10px 50px",
              borderRadius: "20px",
              textTransform: "none",
              width: "40%",
              fontSize: "25px",
              margin: "auto",
              display: "flex",
              alignSelf: "center",
            }}
            onClick={() => setResetMode("password")}
          >
            Reset Password
          </Button>
          <Button
            style={{
              backgroundColor: "#D7A746",
              color: "white",
              padding: "10px 50px 10px 50px",
              borderRadius: "20px",
              textTransform: "none",
              marginTop: "auto",
              width: "40%",
              fontSize: "25px",
              margin: "auto",
              display: "flex",
              alignSelf: "center",
            }}
            onClick={() => setResetMode("username")}
          >
            Forgot Username
          </Button>
        </ButtonPageWrapper>
      )}
    </>
  );
};

export default Recovery;
