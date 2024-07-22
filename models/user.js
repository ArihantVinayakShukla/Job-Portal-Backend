const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    required: true,
  },
  profession: {
    type: String,
    required: true,
  },
  degree: {
    type: String,
    required: true,
  },
  university: {
    type: String,
    required: true,
  },
  graduation: {
    type: String,
    required: true,
  },
  location: {
    type: [String],
    required: true,
  },
  job: {
    type: String,
    required: true,
  },
  jobtype: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Number,
    default: new Date().getTime(),
  },
  isActive: {
    type: Boolean,
    required: true,
  },
  jobApplications: [
    {
      type: Schema.Types.ObjectId,
      ref: "JobApplication",
    },
  ],
});

module.exports = mongoose.model("users", userSchema);
