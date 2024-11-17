const mongoose = require("mongoose");

const CampaignSchema = new mongoose.Schema({
  campaignId: { type: String, unique: true, required: true },
  name: { type: String, required: true },
  audienceGroupNames: [{ type: String, required: true }], 
  customers: [{ type: mongoose.Schema.Types.ObjectId, ref: "Customer" }], // List of Customer IDs
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Campaign", CampaignSchema);
