import React, { useState, useEffect } from "react";
import axios from "axios";
import "./createCampaign.css";
import API_BASE_URL from '../globals';

const CampaignPage = () => {
  const [audienceGroups, setAudienceGroups] = useState([]);
  const [selectedGroups, setSelectedGroups] = useState([]);
  const [campaignName, setCampaignName] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch audience groups on component mount
  useEffect(() => {
    fetchAudienceGroups();
  }, []);

  // Fetch audience groups from the backend
  const fetchAudienceGroups = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/audienceGroup/get_all`);
      setAudienceGroups(response.data || []);
    } catch (err) {
      console.error("Error fetching audience groups", err);
      alert("Failed to fetch audience groups. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Toggle group selection
  const handleGroupSelection = (groupId) => {
    setSelectedGroups((prevSelectedGroups) =>
      prevSelectedGroups.includes(groupId)
        ? prevSelectedGroups.filter((id) => id !== groupId)
        : [...prevSelectedGroups, groupId]
    );
  };

  // Create a campaign
  const createCampaign = async () => {
    if (selectedGroups.length === 0 || !campaignName.trim()) {
      alert("Please select at least one audience group and enter a campaign name.");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(`${API_BASE_URL}/campaigns/create`, {
        audienceGroups: selectedGroups,
        name: campaignName.trim(),
      });

      if (response.status === 201) {
        alert("Campaign created successfully!");
        setCampaignName("");
        setSelectedGroups([]);
      }
    } catch (err) {
      console.error("Error creating campaign", err);
      alert("Failed to create campaign. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="campaign-page">
      <h2>Create Campaign</h2>

      {/* Campaign Name Input */}
      <div className="campaign-input">
        <label htmlFor="campaignName">Campaign Name:</label>
        <input
          id="campaignName"
          type="text"
          placeholder="Enter Campaign Name"
          value={campaignName}
          onChange={(e) => setCampaignName(e.target.value)}
        />
      </div>

      {/* Audience Group Selection */}
      <div className="audience-group-section">
        <h3>Select Audience Groups</h3>
        {loading ? (
          <p>Loading audience groups...</p>
        ) : (
          <div className="audience-group-buttons">
            {audienceGroups.length > 0 ? (
              audienceGroups.map((group) => (
                <button
                  key={group.groupId}
                  onClick={() => handleGroupSelection(group.groupId)}
                  className={selectedGroups.includes(group.groupId) ? "selected" : ""}
                >
                  {group.name}
                </button>
              ))
            ) : (
              <p>No audience groups available.</p>
            )}
          </div>
        )}
      </div>

      {/* Create Campaign Button */}
      <div className="campaign-actions">
        <button onClick={createCampaign} disabled={loading}>
          {loading ? "Creating Campaign..." : "Create Campaign"}
        </button>
      </div>

      {/* Display Selected Groups */}
      <div className="selected-groups">
        <h4>Selected Audience Groups:</h4>
        <ul>
          {selectedGroups.map((groupId) => {
            const group = audienceGroups.find((g) => g.groupId === groupId);
            return group ? <li key={groupId}>{group.name}</li> : null;
          })}
        </ul>
      </div>
    </div>
  );
};

export default CampaignPage;
