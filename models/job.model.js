const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'company',
    required: true
  },
  description: { type: String, required: true },  
  expiryDate: { type: Number },
  applicants: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'users'
  },
  additional: { type: Object }
});

const jobModel = mongoose.model('jobpost', jobSchema);

module.exports = jobModel;
