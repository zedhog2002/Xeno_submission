const mongoose = require("mongoose");

const AudienceGroupSchema = new mongoose.Schema({
  groupId: { type: String, unique: true, required: true },
  name: { type: String, required: true },
  filters: { type: Object, required: true },
  customers: { type: Array, required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("AudienceGroup", AudienceGroupSchema);
