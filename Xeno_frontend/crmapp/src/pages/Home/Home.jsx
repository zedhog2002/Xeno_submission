import React from 'react';
import Navbar from '../../components/navbar'; // Import Navbar
import './home.css';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="home-page">
       <Navbar 
      />
      <div className="home-content">
        <h2>Welcome to the Dashboard</h2>
        <div className="button-container">
          <Link to="/addCustomer"><button className="action-button">Create Customer</button></Link>
          <Link to="/createAudience"><button className="action-button">Create Audience Segments</button></Link>
          <Link to="/createCampaign"><button className="action-button">Create Campaigns</button></Link>
          <Link to="/manageCampaign"><button className="action-button">Manage Campaigns</button></Link>
          <Link to="/manageAudience"><button className="action-button">Manage Audience Segments</button></Link>
        </div>
      </div>
    </div>
  );
}

export default Home;
