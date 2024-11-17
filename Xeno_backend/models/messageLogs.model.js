const mongoose = require("mongoose");

const CustomerMessageSchema = new mongoose.Schema({
  recipientName: { type: String, required: true },
  recipientEmail: { type: String, required: true },
  message: { type: String, required: true },
  status: { type: String, enum: ["PENDING", "SENT", "FAILED"], default: "PENDING" },
  sentAt: { type: Date, default: Date.now },
});

const MessageLogSchema = new mongoose.Schema({
  campaignId: { type: String, unique: true, required: true },
  campaignName: { type: String, required: true },
  customers: [CustomerMessageSchema], // Array of customer message details
  createdAt: { type: Date, default: Date.now },
});

const MessageLog = mongoose.model("MessageLog", MessageLogSchema);
module.exports = MessageLog;
