import React, { createContext, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

// Create the Profile context
const ProfileContext = createContext();

// Custom hook to access the Profile context
export const useProfile = () => useContext(ProfileContext);



export const ProfileProvider = ({ children }) => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);

  const login = (profileData) => {
    setProfile(profileData);
  };

  const logOut = () => {
    setProfile(null);
    navigate("/");
  };

  return (
    <ProfileContext.Provider value={{ profile, login, logOut }}>
      {children}
    </ProfileContext.Provider>
  );
};
