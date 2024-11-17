const express = require("express");
const { v4: uuidv4 } = require("uuid");
const router = express.Router();
const AudienceGroup = require("../models/audienceGroup.model");

router.delete("/delete/:groupId", async (req, res) => {
  const { groupId } = req.params;

  try {
    const deletedGroup = await AudienceGroup.findOneAndDelete({ groupId });

    if (!deletedGroup) {
      return res.status(404).json({ message: "Audience group not found" });
    }

    res.status(200).json({ message: "Audience group deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error deleting audience group" });
  }
});

router.get("/get_all", async (req, res) => {
  try {
    const audienceGroups = await AudienceGroup.find();
    if (audienceGroups.length === 0) {
      return res.status(404).json({ message: "No audience groups found." });
    }

    // Format the response data
    const formattedGroups = audienceGroups.map(group => ({
      groupId: group.groupId,
      name: group.name,
      filters: group.filters,
      customers: group.customers.map(customer => ({
        name: customer.name,
        age: customer.age,
        spent: customer.spent,
        visits: customer.visits,
      })),
      createdAt: group.createdAt,
    }));

    res.status(200).json(formattedGroups);
  } catch (error) {
    res.status(500).json({ message: "Error getting audience data", error: error.message });
  }
});


router.get("/get_distinct_values", async (req, res) => {
  try {
    const distinctAges = await AudienceGroup.distinct("customers.age");
    const distinctAddresses = await AudienceGroup.distinct("customers.address");
    const distinctSpent = await AudienceGroup.distinct("customers.spent");
    const distinctVisits = await AudienceGroup.distinct("customers.visits");

    res.status(200).json({
      distinctAges,
      distinctAddresses,
      distinctSpent,
      distinctVisits,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching distinct values", error });
  }
});


router.post("/save_audience_group", async (req, res) => {
  try {
    const { name, filters, customers } = req.body;

    if (!name || !filters || !customers) {
      return res.status(400).json({ message: "Name, filters, and customers are required" });
    }

    const groupId = uuidv4();
    const newGroup = new AudienceGroup({
      groupId,
      name,
      filters,
      customers,
    });

    await newGroup.save();
    res.status(201).json({ message: "Audience group saved successfully", groupId });
  } catch (error) {
    res.status(500).json({ message: "Error saving audience group", error });
  }
});


router.get("/get_audience/:campaignId", async (req, res) => {
  const { campaignId } = req.params;
  try {
    const audienceGroups = await AudienceGroup.find({ groupId: campaignId });
    res.status(200).json(audienceGroups);
  } catch (error) {
    console.error("Error fetching audience group:", error);
    res.status(500).json({ error: "Failed to fetch audience group" });
  }
});

module.exports = router;
