import React, { useState, useEffect } from 'react';
import { googleLogout, useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { useProfile } from '../../ProfileContext'; // Import the useProfile hook
import './login.css';
import { Navigate, useNavigate } from 'react-router-dom';

function Login() {
  const { login } = useProfile(); // Get login function from context
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);

  const loginWithGoogle = useGoogleLogin({
    onSuccess: (codeResponse) => setUser(codeResponse),
    onError: (error) => console.log('Login Failed:', error),
  });

  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      axios
        .get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${user.access_token}`, {
          headers: {
            Authorization: `Bearer ${user.access_token}`,
            Accept: 'application/json',
          },
        })
        .then((res) => {
          setProfile(res.data);
          login(res.data); // Store profile globally after login
          navigate("/home");
        })
        .catch((err) => console.log(err));
    }
  }, [user, login]);

  const logOut = () => {
    googleLogout();
    setProfile(null);
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Login</h2>
        <button onClick={() => loginWithGoogle()}>Login with Google</button>
        {profile && (
          <div className="profile-container">
            <h3>User Logged In</h3>
            <p>Name: {profile.name}</p>
            <p>Email Address: {profile.email}</p>
            <button onClick={logOut}>Log Out</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Login;
