import React, { useState } from "react";
import axios from "axios";
import { Button, TextField } from "@mui/material";
import { styled } from "styled-components";
import { useNavigate } from "react-router-dom";
import bcrypt from "bcryptjs";
import { DATABASE_URL } from "constants";

const RecoveryWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: #f5f5f5;
  padding: 20px;
`;

const FormWrapper = styled.div`
  background-color: white;
  padding: 40px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  text-align: center;
  max-width: 400px;
  width: 100%;
`;

const Title = styled.h1`
  color: #333;
  margin-bottom: 20px;
`;

const StyledButton = styled(Button)`
  background-color: #4caf50 !important;
  color: white !important;
  margin-top: 20px !important;
  padding: 10px 20px !important;
  font-size: 16px !important;
  text-transform: none !important;
  border-radius: 8px !important;
  &:hover {
    background-color: #45a049 !important;
  }
`;

const BackButton = styled(Button)`
  background-color: #d7a746 !important;
  color: white !important;
  margin-top: 20px !important;
  padding: 10px 20px !important;
  font-size: 16px !important;
  text-transform: none !important;
  border-radius: 8px !important;
  &:hover {
    background-color: #c6953e !important;
  }
`;

const ButtonWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px; /* Add space between buttons */
`;

const Recovery = () => {
  const navigate = useNavigate();
  const [verificationCode] = useState(generateVerificationCode());
  const [email, setEmail] = useState("");
  const [confirming, setConfirming] = useState(false);
  const [confirmedPassword, setConfirmedPassword] = useState(false);
  const [resetPassword, setResetPassword] = useState("");
  const [resetPasswordConfirm, setResetPasswordConfirm] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [resetMode, setResetMode] = useState("");

  const handleChange = (event) => setEmail(event.target.value);
  const handlePasswordChange = (event) => setResetPassword(event.target.value);
  const handlePasswordConfirmChange = (event) => setResetPasswordConfirm(event.target.value);
  const handleEmailConfirmChange = (event) => setPasswordConfirm(event.target.value);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setConfirming(true);
    try {
      const response = await axios.get(`${DATABASE_URL}/user`, {
        params: { email },
      });
      const newEmailData = {
        subject: "Project ProudMe Password Recovery",
        to: email,
        text: `Hi ${response.data.firstName},\n\nYou are receiving this email because you requested a password reset on the Project ProudMe webpage. \n\nEnter the confirmation code listed to reset your password: ${verificationCode}\n\nBest Regards, \nProject ProudMe Team \nLouisiana State University \nPedagogical Kinesiology Lab\n\n---\n This email was sent from an account associated with Louisiana State University.`,
      };

      await axios.post(`${DATABASE_URL}/send-email`, newEmailData);
    } catch (error) {
      console.error(error);
    }
  };

  const changePassword = async () => {
    const hashedPassword = await bcrypt.hash(resetPassword, 10);
    await axios.post(`${DATABASE_URL}/user`, { email, password: hashedPassword });
    navigate("/login");
  };

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
        params: { email },
      });
      const newEmailData = {
        subject: "Project ProudMe Username Recovery",
        to: email,
        text: `Hi ${response.data.firstName},\n\nYou are receiving this email because you requested a username reminder on the Project ProudMe webpage. \n\nThe username associated with this email account is ${response.data.name}.\n\nBest Regards, \nProject ProudMe Team \nLouisiana State University \nPedagogical Kinesiology Lab\n\n---\n This email was sent from an account associated with Louisiana State University.`,
      };

      await axios.post(`${DATABASE_URL}/send-email`, newEmailData);
      alert("Username has been sent to your email.");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <RecoveryWrapper>
      {resetMode === "password" ? (
        <FormWrapper>
          <Title>Recover Password</Title>
          {confirmedPassword ? (
            <>
              <TextField
                type="password"
                value={resetPassword}
                onChange={handlePasswordChange}
                placeholder="New Password"
                fullWidth
                margin="normal"
              />
              <TextField
                type="password"
                value={resetPasswordConfirm}
                onChange={handlePasswordConfirmChange}
                placeholder="Confirm New Password"
                fullWidth
                margin="normal"
              />
              <StyledButton onClick={changePassword}>Change Password</StyledButton>
            </>
          ) : (
            <>
              <form onSubmit={handleSubmit}>
                <TextField
                  type="email"
                  value={email}
                  onChange={handleChange}
                  placeholder="Your Email"
                  fullWidth
                  margin="normal"
                />
                <StyledButton type="submit">Send Email</StyledButton>
              </form>
              {confirming && (
                <>
                  <p>Enter the confirmation code sent to your email to reset your password!</p>
                  <form onSubmit={handleEmailConfirm}>
                    <TextField
                      type="password"
                      value={passwordConfirm}
                      onChange={handleEmailConfirmChange}
                      placeholder="Verification Code"
                      fullWidth
                      margin="normal"
                    />
                    <StyledButton type="submit">Confirm Email</StyledButton>
                  </form>
                </>
              )}
              <BackButton onClick={() => navigate("/login")}>Back to Login</BackButton>
            </>
          )}
        </FormWrapper>
      ) : resetMode === "username" ? (
        <FormWrapper>
          <Title>Recover Username</Title>
          <form onSubmit={handleUsernameSubmit}>
            <TextField
              type="email"
              value={email}
              onChange={handleChange}
              placeholder="Your Email"
              fullWidth
              margin="normal"
            />
            <StyledButton type="submit">Send Email</StyledButton>
          </form>
          <BackButton onClick={() => navigate("/login")}>Back to Login</BackButton>
        </FormWrapper>
      ) : (
        <FormWrapper>
          <ButtonWrapper>
            <StyledButton onClick={() => setResetMode("password")}>Reset Password</StyledButton>
            <StyledButton onClick={() => setResetMode("username")}>Recover Username</StyledButton>
          </ButtonWrapper>
        </FormWrapper>
      )}
    </RecoveryWrapper>
  );
};

const generateVerificationCode = () => {
  const charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let code = "";
  for (let i = 0; i < 8; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    code += charset[randomIndex];
  }
  return code;
};

export default Recovery;
