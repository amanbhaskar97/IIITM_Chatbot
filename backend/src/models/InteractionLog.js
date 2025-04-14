const mongoose = require('mongoose');

const interactionLogSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  message: { type: String, required: true },
  response: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
}, { timestamps: true });

const InteractionLog = mongoose.model('InteractionLog', interactionLogSchema);

module.exports = InteractionLog;
