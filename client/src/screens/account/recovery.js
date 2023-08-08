import React, { useState } from "react";
import axios from "axios";
import { Button, TextField, Modal } from "@mui/material";
import { styled } from "styled-components";

const ButtonPageWrapper = styled.div`
  height: calc(100vh - 80px);
  display: flex;
  flex-direction: column;
  margin: auto;
`;

const RecoveryWrapper = styled.div`
  margin-top: 2%;
`

const generateVerificationCode = () => {
  const charset =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let code = "";
  let length = 6;
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    code += charset[randomIndex];
  }
  return code;
};

const Recovery = () => {
  const verificationCode = generateVerificationCode();

  const [email, setEmail] = useState("");
  const [emailData, setEmailData] = useState({
    to: "",
    subject: "test",
    text:
      "Enter the confirmation code listed to reset your password: " +
      verificationCode,
  });
  const [confirming, setConfirming] = useState(false);
  const [resetMode, setResetMode] = useState("");

  const handleChange = (event) => {
    setEmail(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setConfirming(true);
    axios
      .post("https://project-proudme.onrender.com/send-email", emailData)
      .then((response) => {
        console.log(response.data);
        // Handle success response
      })
      .catch((error) => {
        console.error(error);
        // Handle error response
      });
  };

  const handleUsernameSubmit = (event) => {
    event.preventDefault();

    try {
      axios
        .get("https://project-proudme.onrender.com/user", {
          params: {
            email: email,
          },
        })
        .then((response) => {
          setEmailData((prevEmailData) => ({
            ...prevEmailData,
            to: email,
            subject: "Project ProudME Username Recovery",
            text:
              "The username associated with this email account is " +
              response.data[0].name +
              ".",
          }));
          axios
            .post("https://project-proudme.onrender.com/send-email", emailData)
            .then((response) => {
              console.log(response.data);
              // Handle success response
            })
            .catch((error) => {
              console.error(error);
              // Handle error response
            });
        });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      {resetMode === "password" ? (
        <RecoveryWrapper>
          <h1>Recover Password</h1>
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
            <div>
              Enter the confirmation code sent to your email to reset your
              password!
            </div>
          )}
        </RecoveryWrapper>
      ) : resetMode === "username" ? (
        <RecoveryWrapper>
          <h1>Recover Username</h1>
          <form
            style={{ display: "flex", justifyContent: "center" }}
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
