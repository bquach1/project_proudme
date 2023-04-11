import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const withAuth = (Component) => {
  const AuthRoute = (props) => {
    const navigate = useNavigate();
    const isAuthenticated = localStorage.getItem('authToken') !== null;

    useEffect(() => {
      console.log(localStorage.getItem('authToken'));
      if (!isAuthenticated) {
        navigate('/login');
      }
    }, [isAuthenticated, navigate]);

    if (!isAuthenticated) {
      return null;
    }

    return <Component {...props} />;
  };

  return AuthRoute;
};

export default withAuth;