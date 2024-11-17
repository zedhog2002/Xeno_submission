import React from 'react';
import { useProfile } from '../ProfileContext'; // Import the useProfile hook
import { useLocation } from 'react-router-dom'; // Import useLocation hook to get the current route
import './navbar.css';
import { useState } from 'react';

function Navbar() {
  const { profile, logOut } = useProfile(); // Access profile and logout function from context
  const location = useLocation(); // Get current route location
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  // Render Navbar only on Home page
  if (location.pathname !== '/home') return null;

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <span className="logo">xeno</span>
      </div>

      <div className="navbar-right">
        {profile ? (
          <div className="user-dropdown">
            <div className="user-info" onClick={toggleDropdown}>
              <img src={profile.picture} alt="user_image" className="user-image" />
              <span className="user-name">{profile.name}</span>
            </div>
            {isDropdownOpen && (
              <div className="dropdown">
                <button className="dropdown-item" onClick={() => alert('Go to profile')}>
                  Profile
                </button>
                <button className="dropdown-item" onClick={logOut}>
                  Log Out
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="auth-buttons">
            <button className="login-button">Sign in</button>
            <button className="get-started-button">Get started</button>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
