// PasswordReset.js
import React, { useState } from 'react';
import { useParams } from 'react-router-dom'; // if using React Router

const Recovery = () => {
  const { token } = useParams(); // Get the token from the URL parameter
  const [newPassword, setNewPassword] = useState('');

  const handlePasswordChange = (e) => {
    setNewPassword(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add the logic to send a request to the backend with the token and new password
    // (you can use a service like sending an API request to your backend)
  };

  return (
    <div>
      <h2>Password Reset</h2>
      <form onSubmit={handleSubmit}>
        <label>
          New Password:
          <input type="password" value={newPassword} onChange={handlePasswordChange} />
        </label>
        <button type="submit">Reset Password</button>
      </form>
    </div>
  );
};

export default Recovery;
