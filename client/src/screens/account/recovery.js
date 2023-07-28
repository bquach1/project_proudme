// In your React frontend
import React, { useState } from "react";
import axios from "axios";
import { Button, TextField } from "@mui/material";

const generateVerificationCode = () => {
    const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let code = '';
    let length = 6;
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      code += charset[randomIndex];
    }
    return code;
}

const Recovery = () => {    

  const verificationCode = generateVerificationCode();

  const [emailData, setEmailData] = useState({
    to: "",
    subject: "test",
    text: "Enter the confirmation code listed to reset your password: " + verificationCode,
  });
  const [confirming, setConfirming] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setEmailData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
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

  return (
    <div>
      <h1>Recover Password</h1>
      <form style={{display: "flex", justifyContent: "center"}} onSubmit={handleSubmit}>
        <TextField
          type="email"
          name="to"
          value={emailData.to}
          onChange={handleChange}
          placeholder="Your Email"
          style={{ width: "70%" }}
        />
        <Button style={{backgroundColor: "green", textTransform: "none", color: "white"}} type="submit">Send Email</Button>
      </form>
      {confirming &&
        <div>Enter the confirmation code sent to your email to reset your password!</div>  
      }    
    </div>
  );
};

export default Recovery;
