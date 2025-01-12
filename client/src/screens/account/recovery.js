import React, { useState } from 'react';
import axios from 'axios';
import { Button, TextField } from '@mui/material';
import { styled } from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { DATABASE_URL } from 'constants';

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

const Recovery = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [step, setStep] = useState('username'); // username, questions, or reset
  const [resetToken, setResetToken] = useState('');

  const handleUsernameSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.get(`${DATABASE_URL}/security-questions/${username}`);
      setQuestions(response.data.questions);
      setAnswers(new Array(response.data.questions.length).fill(''));
      setStep('questions');
    } catch (error) {
      alert('Username not found or error fetching security questions');
    }
  };

  const handleAnswerChange = (index, value) => {
    const newAnswers = [...answers];
    newAnswers[index] = value;
    setAnswers(newAnswers);
  };

  const handleSecurityQuestions = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${DATABASE_URL}/recover-password`, {
        username,
        securityAnswers: answers
      });
      setResetToken(response.data.resetToken);
      setStep('reset');
    } catch (error) {
      alert('Incorrect answers to security questions');
    }
  };

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    try {
      await axios.post(`${DATABASE_URL}/reset-password`, {
        resetToken,
        newPassword
      });
      alert('Password reset successful');
      navigate('/login');
    } catch (error) {
      alert('Error resetting password');
    }
  };

  return (
    <RecoveryWrapper>
      <FormWrapper>
        <Title>Account Recovery</Title>
        
        {step === 'username' && (
          <form onSubmit={handleUsernameSubmit}>
            <TextField
              fullWidth
              label="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              margin="normal"
              required
            />
            <StyledButton type="submit">Next</StyledButton>
          </form>
        )}

        {step === 'questions' && (
          <form onSubmit={handleSecurityQuestions}>
            {questions.map((question, index) => (
              <TextField
                key={index}
                fullWidth
                label={question}
                value={answers[index]}
                onChange={(e) => handleAnswerChange(index, e.target.value)}
                margin="normal"
                required
              />
            ))}
            <StyledButton type="submit">Verify Answers</StyledButton>
          </form>
        )}

        {step === 'reset' && (
          <form onSubmit={handlePasswordReset}>
            <TextField
              fullWidth
              type="password"
              label="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              type="password"
              label="Confirm New Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              margin="normal"
              required
            />
            <StyledButton type="submit">Reset Password</StyledButton>
          </form>
        )}

        <Button 
          onClick={() => navigate('/login')}
          style={{ marginTop: '20px' }}
        >
          Back to Login
        </Button>
      </FormWrapper>
    </RecoveryWrapper>
  );
};

export default Recovery;