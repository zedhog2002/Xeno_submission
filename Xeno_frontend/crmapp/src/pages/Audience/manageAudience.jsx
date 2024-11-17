import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";  // Import useNavigate
import "./manageAudience.css";
import API_BASE_URL from '../globals';

const ManageAudience = () => {
  const [audienceGroups, setAudienceGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expandedGroup, setExpandedGroup] = useState(null);

  const navigate = useNavigate(); // Initialize navigate

  useEffect(() => {
    fetchAudienceGroups();
  }, []);

  const fetchAudienceGroups = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/audienceGroup/get_all`);
      setAudienceGroups(response.data || []);
    } catch (err) {
      console.error("Error fetching audience groups", err);
      setError("Failed to fetch audience groups. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const deleteAudienceGroup = async (groupId) => {
    try {
      await axios.delete(`${API_BASE_URL}/audienceGroup/delete/${groupId}`);
      setAudienceGroups(audienceGroups.filter(group => group.groupId !== groupId)); 
      alert("Audience Group deleted successfully!");
    } catch (err) {
      console.error("Error deleting audience group", err);
      setError("Failed to delete audience group. Please try again later.");
    }
  };

  const toggleGroupExpansion = (groupId) => {
    setExpandedGroup(expandedGroup === groupId ? null : groupId);
  };

  const renderFilters = (filters) => {
    return (
      <ul>
        {Object.entries(filters).map(([key, value], index) => (
          <li key={index}>
            <strong>{key}: </strong> {value || "Not Set"}
          </li>
        ))}
      </ul>
    );
  };

  const handleCreateAudience = () => {
    navigate("/createAudience"); // Redirect to Create Audience page
  };

  return (
    <div className="manage-audience-page">
      <h2>Manage Audience Groups</h2>


      {loading ? (
        <p>Loading audience groups...</p>
      ) : error ? (
        <p className="error">{error}</p>
      ) : audienceGroups.length === 0 ? (
        <p>No audience groups found.</p>
      ) : (
        <table className="audience-table">
          <thead>
            <tr>
              <th>Group Name</th>
              <th>Filters</th>
              <th>Created At</th>
              <th>Customers</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {audienceGroups.map((group) => (
              <React.Fragment key={group.groupId}>
                <tr onClick={() => toggleGroupExpansion(group.groupId)} className="main-group-row">
                  <td>{group.name}</td>
                  <td>{renderFilters(group.filters)}</td>
                  <td>{new Date(group.createdAt).toLocaleString()}</td>
                  <td>{group.customers.length} Customers</td>
                  <td>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteAudienceGroup(group.groupId);
                      }}
                      className="delete-btn"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
                {expandedGroup === group.groupId && (
                  <tr className="subtable-row">
                    <td colSpan="5">
                      <table className="subtable">
                        <thead>
                          <tr>
                            <th>Name</th>
                            <th>Age</th>
                            <th>Spent</th>
                            <th>Visits</th>
                          </tr>
                        </thead>
                        <tbody>
                          {group.customers.map((customer, index) => (
                            <tr key={index}>
                              <td>{customer.name}</td>
                              <td>{customer.age}</td>
                              <td>{customer.spent}</td>
                              <td>{customer.visits}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      )}
      <button onClick={handleCreateAudience} className="create-audience-btn">
        Create Audience
      </button>
    </div>
  );
};

export default ManageAudience;
