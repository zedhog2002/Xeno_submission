import React, { useState, useEffect } from "react";
import axios from "axios";
import "./createAudience.css";
import API_BASE_URL from '../globals'; // Import the base URL

const AddAudience = () => {
  const [customers, setCustomers] = useState([]);
  const [filters, setFilters] = useState({
    age: "",
    address: "",
    spent: "",
    visits: "",
    most_frequent: "",
  });

  const [distinctValues, setDistinctValues] = useState({
    ages: [],
    addresses: [],
    spentRanges: [],
    visitsRanges: [],
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch distinct values when the component mounts
  useEffect(() => {
    fetchDistinctValues();
  }, []);

  // Fetch customers when filters change
  useEffect(() => {
    if (filters.age || filters.address || filters.spent || filters.visits || filters.most_frequent) {
      fetchCustomers();
    }
    else {
      fetchCustomers();
    }
  }, [filters]);

  // Fetch distinct filter values
  const fetchDistinctValues = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/audienceGroup/get_distinct_values`);
      const {
        distinctAges = [],
        distinctAddresses = [],
        distinctSpent = [],
        distinctVisits = [],
      } = response.data;

      setDistinctValues({
        ages: distinctAges,
        addresses: distinctAddresses,
        spentRanges: distinctSpent,
        visitsRanges: distinctVisits,
      });
      setError(""); // Reset any previous errors
    } catch (err) {
      setError("Error fetching distinct values. Please try again later.");
    }
  };

  // Fetch customers based on filters
  const fetchCustomers = async () => {
    console.log("hi");
    setLoading(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/customers/get_query`, filters);
      setCustomers(response.data || []);
      console.log(response.data);
      setError(""); // Reset any previous errors
    } catch (err) {
      setError("Error fetching customer data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Handle filter changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  // Handle adding an audience group
  const handleAddAudienceGroup = async () => {
    if (loading) {
      alert("Data is still loading, please wait.");
      return;
    }

    if (customers.length === 0) {
      alert("No customers found with the selected filters.");
      return;
    }

    const groupName = prompt("Enter a name for the audience group:");
    if (!groupName) {
      alert("Audience group name is required.");
      return;
    }

    try {
      const response = await axios.post(`${API_BASE_URL}/audienceGroup/save_audience_group`, {
        name: groupName,
        filters,
        customers,
      });

      if (response.data.groupId) {
        setMessage("Audience group saved successfully!");
      }
    } catch (err) {
      setError("Error saving audience group. Please try again.");
    }
  };

  return (
    <div className="customer-table-container">
      <h2>Customer Table</h2>

      {/* Filters */}
      <div className="filters">
        <select name="age" value={filters.age} onChange={handleFilterChange}>
          <option value="">Select Age</option>
          {distinctValues.ages.map((age, idx) => (
            <option key={idx} value={age}>
              {age}
            </option>
          ))}
        </select>

        <select name="address" value={filters.address} onChange={handleFilterChange}>
          <option value="">Select Address</option>
          {distinctValues.addresses.map((address, idx) => (
            <option key={idx} value={address}>
              {address}
            </option>
          ))}
        </select>

        <select name="spent" value={filters.spent} onChange={handleFilterChange}>
          <option value="">Select Spent Range</option>
          {distinctValues.spentRanges.map((spent, idx) => (
            <option key={idx} value={spent}>
              {spent}
            </option>
          ))}
        </select>

        <select name="visits" value={filters.visits} onChange={handleFilterChange}>
          <option value="">Select Visits Range</option>
          {distinctValues.visitsRanges.map((visits, idx) => (
            <option key={idx} value={visits}>
              {visits}
            </option>
          ))}
        </select>

        <input
          type="text"
          name="most_frequent"
          placeholder="Filter by Most Frequent"
          value={filters.most_frequent}
          onChange={handleFilterChange}
        />
      </div>

      {/* Table */}
      <table>
        <thead>
          <tr>
            <th>Customer ID</th>
            <th>Name</th>
            <th>Age</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Address</th>
            <th>Spent</th>
            <th>Visits</th>
            <th>Most Frequent</th>
            <th>Last Visited</th>
          </tr>
        </thead>
        <tbody>
          {customers.length > 0 ? (
            customers.map((customer) => (
              <tr key={customer.customerId}>
                <td>{customer.customerId}</td>
                <td>{customer.name}</td>
                <td>{customer.age}</td>
                <td>{customer.email}</td>
                <td>{customer.phone}</td>
                <td>{customer.address}</td>
                <td>{customer.spent}</td>
                <td>{customer.visits}</td>
                <td>{customer.most_frequent}</td>
                <td>
                  {customer.lastVisited
                    ? new Date(customer.lastVisited).toLocaleDateString()
                    : "N/A"}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="10">No customers found.</td>
            </tr>
          )}
        </tbody>
      </table>

      {message && <p className="success-message">{message}</p>}
      {error && <p className="error-message">{error}</p>}

      <button className="add-customer-btn" onClick={handleAddAudienceGroup}>
        Save Audience Group
      </button>
    </div>
  );
};

export default AddAudience;
