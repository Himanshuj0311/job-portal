const express = require('express');
const JobModel = require("../models/job.model");
require("dotenv").config();


const jobPost = async (req, res) => {
    const { title, userId, description, expiryDate, applicants, additional } = req.body;
  
    try {   
      
      if (!title || !userId || !description || !expiryDate) {
        return res.status(400).json({ message: "Please provide all required fields", success: false });
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
  
     
      res.status(201).json({ message: "Job post created successfully", success: true, jobPost: newJobPost });
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message, success: false });
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
            return res.status(400).json({ message: "Post not found", success: false });

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
           return res.status(200).json({ message: "Job Post Updated successfully",data:updatedData,succes:true })



    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message, success: false });

    }
  }

  
  const getAllJobPost = async (req, res) => {
    try {
   
      const { page = 1, limit = 10, search = '', title, _id, description, expiryDate, applicants, additional } = req.query;
  
   
      const pageNumber = parseInt(page, 10);
      const limitNumber = parseInt(limit, 10);
      const skip = (pageNumber - 1) * limitNumber;
  
   
      const filters = {};
  
      // Add filters to the object
      if (_id) filters._id = mongoose.Types.ObjectId(_id);
      if (title) filters.title = { $regex: title, $options: 'i' }; 
      if (description) filters.description = { $regex: description, $options: 'i' };  
      if (additional) filters.additional = { $regex: additional, $options: 'i' };  
    if (expiryDate) filters.expiryDate = { $gte: expiryDate }; 
     
  
      if (search) {
        filters.$or = [
          { title: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } },
          { additional: { $regex: search, $options: 'i' } },
        ];
      }
  
      // Fetch job posts with applied filters
      const jobPosts = await JobPostModel.find(filters)
        .skip(skip)
        .limit(limitNumber)
        .sort({ postedDate: -1 }); 
  
      
      const totalJobPosts = await JobPostModel.countDocuments(filters);
      const totalPages = Math.ceil(totalJobPosts / limitNumber);
  
      // Return response with job posts and pagination info
      return res.json({
        status: 200,
        message: 'Job posts fetched successfully',
        success: true,
        data: {
          jobPosts,
          pagination: {
            totalJobPosts,
            totalPages,
            currentPage: pageNumber,
            limit: limitNumber,
          },
        },
      });
    } catch (error) {
      console.error('Error fetching job posts:', error);
      return res.status(500).json({
        status: 500,
        message: 'An error occurred while fetching job posts',
        success: false,
      });
    }
  };
  
 
  
module.exports={jobPost,updateJobPost,getAllJobPost}