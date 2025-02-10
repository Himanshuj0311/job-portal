const express = require('express');
const JobModel = require("../models/job.model");
require("dotenv").config();


const jobPost = async (req, res) => {
    const { title, userId, description, expiryDate, applicants, additional } = req.body;
  
    try {   
      
      if (!title || !userId || !description || !expiryDate) {
        return res.status(400).json({ msg: "Please provide all required fields", success: false });
      }
  
      // Create a new job post
      const newJobPost = new JobModel({
        title,
        userId,
        description,
        expiryDate,
        applicants,  
        additional
      });
  
     
      await newJobPost.save();
  
     
      res.status(201).json({ msg: "Job post created successfully", success: true, jobPost: newJobPost });
    } catch (error) {
      res.status(500).json({ msg: "Server error", error: error.message, success: false });
    }
  };

  const updateJobPost=async(req,res)=>{
    const {
        _id,
        title,
        description,
        expiryDate,
        applicants,  
        additional}=req.body;
    try {
        
        const data= await JobModel.findById({_id});
        if(!data){
            return res.status(400).json({ msg: "Post not found", success: false });

        }
        if (applicants && Array.isArray(applicants)) {
            applicants.forEach(applicant => {
              if (!data.applicants.includes(applicant)) {
                data.applicants.push(applicant);  
              }
            });
          }
      
         
          if (additional && typeof additional === 'object') {
            data.additional = { ...data.additional, ...additional };  
          }
      

        const dataObj={_id,
            title,
            description,
            expiryDate,
            applicants:data.applicants,  
            additional:data.additional}

           const updatedData = await JobModel.findByIdAndUpdate({ _id }, { $set: dataObj }, { new: true });
           return res.status(200).json({ msg: "Job Post Updated successfully",data:updatedData,succes:true })



    } catch (error) {
        res.status(500).json({ msg: "Server error", error: error.message, success: false });

    }
  }

module.exports={jobPost,updateJobPost}