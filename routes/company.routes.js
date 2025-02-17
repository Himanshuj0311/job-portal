const express = require("express");
const companyRouter = express.Router();
const {
  signUpForCompany,
  loginForCompany,
  getAllCompany,
} = require("../controllers/company.cont");

const {
  jobPost,
  updateJobPost,
  getJobs,
  deleteJobPost,
  addComment,
  toggleLikeJob
} = require("../controllers/jobpost.cont");

// Company Routes
companyRouter.post("/company/Companysignup", signUpForCompany);
companyRouter.post("/company/Companylogin", loginForCompany);
companyRouter.get("/company/getAllCompany", getAllCompany);

//Job Post Routes
companyRouter.post("/company/jobPosts", jobPost); // Create job post
companyRouter.put("/company/updateJobPost", updateJobPost); // Update job post
companyRouter.get("/company/getJobPosts", getJobs); // Get all job posts
companyRouter.delete("/company/jobPosts/:id", deleteJobPost); // Delete a job post by ID
companyRouter.post("/company/jobPosts/like", toggleLikeJob); //  Like a job post
companyRouter.post("/company/jobPosts/comment", addComment); //  Comment on a job post
module.exports = companyRouter;
