import React, { useContext } from 'react';
import { UserContext } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';

const LogoutButton = () => {
  const { logoutUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutUser();
    navigate('/login'); // Redirect the user to the login page
  };

  return (
    <button onClick={handleLogout}>
      Logged Out
    </button>
  );
};

export default LogoutButton;