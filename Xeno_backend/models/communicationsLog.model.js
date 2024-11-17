const mongoose = require("mongoose");

const CommunicationsLogSchema = mongoose.Schema({
  logId: { type: String, unique: true, required: true }, // UUID
  campaignId: { type: String, required: true }, // References Campaign ID
  audienceName: { type: String, required: true },
  message: { type: String, required: true },
  status: { 
    type: String, 
    enum: ["PENDING", "SENT", "FAILED"], 
    default: "PENDING" 
  },
  timestamp: { type: Date, default: Date.now },
});

const CommunicationsLog = mongoose.model("CommunicationsLog", CommunicationsLogSchema);

module.exports = CommunicationsLog;
