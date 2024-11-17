import React from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { ProfileProvider } from './ProfileContext'; // Import ProfileProvider
import Login from './pages/Login/login';
import Home from './pages/Home/Home';
import AddCustomer from './pages/Customer/addCustomer';
import AddAudience from './pages/Audience/createAudience';
import CampaignPage from './pages/Campaign/createCampaign';
import ManageCampaignsPage from './pages/Campaign/manageCampaign';
import ManageAudience from './pages/Audience/manageAudience';
import SendMessagesPage from './pages/Messages/sendMessages';
function App() {
  return (
    <ProfileProvider>
      <>
        <Routes>
          <Route path="/" element={<Login />} /> {/* Login page route */}
          <Route path="/home" element={<Home />} />
          <Route path="/addCustomer" element={<AddCustomer />} />
          <Route path="/createAudience" element={<AddAudience />} />
          <Route path="/manageAudience" element={<ManageAudience/>} />
          <Route path="/createCampaign" element={<CampaignPage/>} />
          <Route path="/manageCampaign" element={<ManageCampaignsPage/>} />
          <Route path="/sendMessages/:campaignId" element={<SendMessagesPage/>} />
        </Routes>
      </>
    </ProfileProvider>
  );
}

export default App;
