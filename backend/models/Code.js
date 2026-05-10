const mongoose = require('mongoose');

const codeSchema = new mongoose.Schema({
  roomId: {
    type: String,
    required: true
  },

  code: {
    type: String,
    required: true,
    
  },

  username: {
    type: String,
    required: true
  }


}, { timestamps: true });

module.exports = mongoose.model('Code', codeSchema);