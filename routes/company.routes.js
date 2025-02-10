
const express = require("express")
const companyRouter=express.Router();
const {signUpForCompany,loginForCompany,getAllCompany}=require("../controllers/company.cont");
const {jobPost,updateJobPost}=require("../controllers/jobpost.cont");


companyRouter.post("/company/signup", signUpForCompany);
companyRouter.post("/company/login", loginForCompany);
companyRouter.post("/company/jobPosts", jobPost);
companyRouter.put("/company/updateJobPost", updateJobPost);
companyRouter.get("/company/getAllCompany", getAllCompany);


module.exports = companyRouter;