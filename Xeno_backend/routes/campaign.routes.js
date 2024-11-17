const express = require("express");
const { v4: uuidv4 } = require("uuid");
const router = express.Router();
const Campaign = require("../models/campaign.model");
const AudienceGroup = require("../models/audienceGroup.model");

// Create campaign with multiple audience groups
router.post("/create", async (req, res) => {
  try {
    const { name, audienceGroups } = req.body;

    if (!name || !audienceGroups || audienceGroups.length === 0) {
      return res.status(400).json({ message: "Campaign name and at least one audience group are required." });
    }

    // Fetch audience groups data
    const audienceGroupData = await AudienceGroup.find({ groupId: { $in: audienceGroups } });

    if (audienceGroupData.length !== audienceGroups.length) {
      return res.status(404).json({ message: "One or more audience groups not found." });
    }

    const campaignId = uuidv4();
    const audienceGroupNames = audienceGroupData.map((group) => group.name);

    // Aggregate all unique customers from the selected groups
    const customers = [
      ...new Set(audienceGroupData.flatMap((group) => group.customers)),
    ];

    const newCampaign = new Campaign({
      campaignId,
      name,
      audienceGroupNames, // Store audience group names
      customers,          // Store all unique customers
      createdAt: new Date(),
    });

    await newCampaign.save();
    res.status(201).json({ message: "Campaign created successfully." });
  } catch (error) {
    console.error("Error creating campaign:", error);
    res.status(500).json({ message: "Error creating campaign.", error });
  }
});


// Fetch all campaigns
router.get("/get_all", async (req, res) => {
  try {
    const campaigns = await Campaign.find();
    res.status(200).json(campaigns);
  } catch (error) {
    res.status(500).json({ message: "Error fetching campaigns.", error });
  }
});

// Delete a campaign by ID
router.delete("/delete/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedCampaign = await Campaign.findOneAndDelete({ campaignId: id });

    if (!deletedCampaign) {
      return res.status(404).json({ message: "Campaign not found" });
    }

    res.status(200).json({ message: "Campaign deleted successfully" });
  } catch (error) {
    console.error("Error deleting campaign:", error);
    res.status(500).json({ message: "Error deleting campaign", error });
  }
});

module.exports = router;
