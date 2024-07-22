const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const jobApplicationSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'users',
    required: true,
  },
  jobId: {
    type: String,
    required: true,
  },
  jobTitle: {
    type: String,
    required: true,
  },
  companyName: {
    type: String,
    required: true,
  },
  appliedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('JobApplication', jobApplicationSchema);
