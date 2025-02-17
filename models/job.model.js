const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "company", required: true },
  description: { type: String, required: true },
  expiryDate: { type: Number },
  applicants: [{ type: mongoose.Schema.Types.ObjectId, ref: "users" }],
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "users" }], // List of users who liked
  comments: [
    {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
      text: { type: String, required: true },
      createdAt: { type: Date, default: Date.now },
    },
  ],
  additional: { type: Object },
});

const JobModel = mongoose.model("jobpost", jobSchema);
module.exports = JobModel;
