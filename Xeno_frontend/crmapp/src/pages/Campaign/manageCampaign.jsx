import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./manageCampaign.css";
import API_BASE_URL from '../globals';
import { Link } from 'react-router-dom';

const ManageCampaignsPage = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Fetch campaigns when the component loads
  useEffect(() => {
    fetchCampaigns();
  }, []);

  // Fetch campaigns from the backend
  const fetchCampaigns = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/campaigns/get_all`);
      setCampaigns(response.data || []);
    } catch (err) {
      console.error("Error fetching campaigns", err);
      alert("Failed to fetch campaigns. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Delete a campaign
  const deleteCampaign = async (campaignId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this campaign?");
    if (!confirmDelete) return;

    try {
      const response = await axios.delete(`${API_BASE_URL}/campaigns/delete/${campaignId}`);
      if (response.status === 200) {
        alert("Campaign deleted successfully!");
        fetchCampaigns(); // Refresh campaigns list
      }
    } catch (err) {
      console.error("Error deleting campaign", err);
      alert("Failed to delete campaign. Please try again.");
    }
  };

  // Navigate to the Send Messages page
  const handleSendMessages = (campaignId) => {
    navigate(`/sendMessages/${campaignId}`);
  };

  return (
    <div className="manage-campaigns-page">
      <h2>Manage Campaigns</h2>

      {/* Loading State */}
      {loading ? (
        <p>Loading campaigns...</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Campaign Name</th>
              <th>Audience Groups</th>
              <th>Created At</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {campaigns.length > 0 ? (
              campaigns.map((campaign) => (
                <tr key={campaign.campaignId}>
                  <td>{campaign.name}</td>
                  <td>
                    {campaign.audienceGroupNames && campaign.audienceGroupNames.length > 0
                      ? campaign.audienceGroupNames.join(", ")
                      : "No Groups"}
                  </td>
                  <td>{new Date(campaign.createdAt).toLocaleString()}</td>
                  <td>
                    <button
                      onClick={() => handleSendMessages(campaign.campaignId)}
                      className="send-messages-btn"
                    >
                      Send Messages
                    </button>
                    <button
                      onClick={() => deleteCampaign(campaign.campaignId)}
                      className="delete-btn"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
              
            ) : (
              <tr>
                <td colSpan="4">No campaigns found.</td>
              </tr>
            )}
          </tbody>
        </table>
      )}
      <Link to="/createCampaign"><button className="action-button">Create Campaigns</button></Link>
    </div>
  );
};

export default ManageCampaignsPage;
