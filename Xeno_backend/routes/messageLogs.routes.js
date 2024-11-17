const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const Customer = require("../models/customers.model");
const MessageLog = require("../models/messageLogs.model");
const Campaign = require("../models/campaign.model");

// Fetch message logs for a campaign
router.get("/:campaignId", async (req, res) => {
  const { campaignId } = req.params;
  try {
    const messageLogs = await MessageLog.find({ campaignId });
    if (!messageLogs.length) {
      return res.status(404).json({ error: "No message logs found for this campaign." });
    }
    // Return all message logs instead of just customers from the first one
    res.status(200).json(messageLogs); // Send the full message logs
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch message logs" });
  }
});

// Send messages for a campaign
router.post("/send_message", async (req, res) => {
  const { campaignId, messageTemplate } = req.body;

  try {
    if (!campaignId || !messageTemplate) {
      return res.status(400).json({ error: "Campaign ID and message template are required." });
    }

    console.log(`Received campaignId: ${campaignId}, messageTemplate: ${messageTemplate}`);

    // Fetch campaign and its linked customers
    const campaign = await Campaign.findOne({ campaignId }).populate("customers");
    if (!campaign) {
      return res.status(404).json({ error: "Campaign not found." });
    }

    const { customers } = campaign;
    if (!customers || !customers.length) {
      return res.status(404).json({ error: "No customers linked to this campaign." });
    }

    console.log(`Fetched ${customers.length} customers linked to campaign.`);

    // Prepare customer message data
    const customerMessages = customers.map((customer) => {
      // Replace all occurrences of [Name] with the customer's name
      const personalizedMessage = messageTemplate.replace(/\[name\]/gi, customer.name || "Customer");
      const status = Math.random() < 0.9 ? "SENT" : "FAILED";

      return {
        recipientName: customer.name || "Unknown",
        recipientEmail: customer.email || "No Email",
        message: personalizedMessage,
        status,
        sentAt: new Date(),
      };
    });

    console.log("Prepared customer messages:", customerMessages);

    // Check if a MessageLog entry exists for this campaign
    let messageLog = await MessageLog.findOne({ campaignId });

    if (messageLog) {
      // Append new messages to the existing log
      messageLog.customers.push(...customerMessages);
    } else {
      // Create a new log
      messageLog = new MessageLog({
        campaignId,
        campaignName: campaign.name,
        customers: customerMessages,
        createdAt: new Date(),
      });
    }

    // Save the message log
    await messageLog.save();
    console.log("Saved message log:", messageLog);

    // Send back the response in the correct format
    res.status(200).json({
      message: "Messages sent successfully!",
      customers: customerMessages, // Return the customer message data directly
    });
  } catch (error) {
    console.error("Error in /send_message route:", error);
    res.status(500).json({ error: "Failed to send messages. Please try again later." });
  }
});


module.exports = router;
