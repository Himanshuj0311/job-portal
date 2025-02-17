const express = require("express");
const JobModel = require("../models/job.model");
const mongoose = require("mongoose")

const jobPost = (async (req, res) => {
   try {
    const { title, userId, description, expiryDate, additional } = req.body;

    if (!title || !userId || !description || !expiryDate) {
        return res.status(400).json({ message: "All fields are required", success: false });
    }

    const newJob = await JobModel.create({ title, userId, description, expiryDate, additional });
    
    res.status(201).json({ message: "Job post created successfully", success: true, job: newJob });
    
   } catch (error) {
    res.status(500).json({ message: error.message, success: false});

   }
});


const getJobs = (async (req, res) => {
    try {

    const { page = 1, limit = 10, search = '' ,_id,title,description}=req.query;

    const pageNumber = parseInt(page, 10);
  const limitNumber = parseInt(limit, 10);

 
  const skip = (pageNumber - 1) * limitNumber;

const filters={};


if (_id) filters._id = new mongoose.Types.ObjectId(_id);
if (title) filters.title = title;



if (search) {
 filters.$or = [
   { title: { $regex: search, $options: 'i' } },
   { description: { $regex: search, $options: 'i' } },
 ];
}

const jobs = await JobModel.find(filters)
     .populate("userId", "companyName companyEmail") 
   // .populate("comments.userId", "name email")
    .skip(skip)
      .limit(limitNumber)
      .sort({ createdAt: -1 });; 

  
      const totalJobPost = await JobModel.countDocuments(filters);
      const totalPages = Math.ceil(totalJobPost / limitNumber);


  return res.json({
    status: 200,
    message: 'Job Post fetched successsfully',
    success:true,
    data: {
      jobs,
      pagination: {
        totalJobPost,
        totalPages,
        currentPage: pageNumber,
        limit: limitNumber,
      },
    },})
      
    } catch (error) {
      res.status(500).json({ message: error.message, success: false});

    }
});




// ✅ Update a job post
const updateJobPost = async (req, res) => {
  try {
    const { _id, title, description, expiryDate, applicants, additional } = req.body;

    if (!_id) {
      return res.status(400).json({ message: "Job ID is required", success: false });
    }

    
    const updateFields = {};

    if (title) updateFields.title = title;
    if (description) updateFields.description = description;
    if (expiryDate) updateFields.expiryDate = expiryDate;

    if (applicants && Array.isArray(applicants)) {
      const job = await JobModel.findById(_id);
      if (!job) {
        return res.status(404).json({ message: "Job not found", success: false });
      }
      const duplicateApplicant = applicants.find(applicant => job.applicants.includes(applicant));
      if (duplicateApplicant) {
        return res.status(400).json({ message: `Applicant ${duplicateApplicant} has already applied for this job`, success: false });
      }
      updateFields.applicants = [...new Set([...job.applicants, ...applicants])];
    }
    
    // Merge additional data
    if (additional && typeof additional === "object") { 
      const job = await JobModel.findById(_id);
      if (!job) {
        return res.status(404).json({ message: "Job not found", success: false });
      }

      updateFields.additional = { ...job.additional, ...additional };
    }

    // Update the job
    const updatedJob = await JobModel.findByIdAndUpdate(_id, { $set: updateFields }, { new: true, runValidators: true });

    if (!updatedJob) {
      return res.status(404).json({ message: "Job not found", success: false });
    }

    res.status(200).json({ message: "Job updated successfully", success: true, job: updatedJob });

  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
};

// ✅ Like or Unlike a job post
const toggleLikeJob = (async (req, res) => {
   try {
    const { _id, userId } = req.body;

    const job = await JobModel.findById(_id);
    if (!job) {
        return res.status(404).json({ message: "Job not found", success: false });
    }

    // Check if user already liked
    const likedIndex = job.likes.indexOf(userId);
    if (likedIndex !== -1) {
        job.likes.splice(likedIndex, 1); // Unlike
        await job.save();
        return res.status(200).json({ message: "Like removed", success: true, job });
    } else {
        job.likes.push(userId); // Like
        await job.save();
        return res.status(200).json({ message: "Job liked", success: true, job });
    }
   } catch (error) {
    res.status(500).json({ message: error.message, success: false });
   }
});

// ✅ Add a comment to a job post
const addComment = (async (req, res) => {
    try {
      const { _id, userId, text } = req.body;

    if (!text) {
        return res.status(400).json({ message: "Comment text is required", success: false });
    }

    const job = await JobModel.findById(_id);
    if (!job) {
        return res.status(404).json({ message: "Job not found", success: false });
    }

    job.comments.push({ userId, text });
    await job.save();

    res.status(201).json({ message: "Comment added successfully", success: true, job });
    } catch (error) {
      res.status(500).json({ message: error.message, success: false });
    }
});

// ✅ Delete a job post
const deleteJobPost = (async (req, res) => {
   try {
    const { _id } = req.params;

    const job = await JobModel.findByIdAndDelete(_id);
    if (!job) {
        return res.status(404).json({ message: "Job not found", success: false });
    }

    res.status(200).json({ message: "Job deleted successfully", success: true });
   } catch (error) {
    res.status(500).json({ message: error.message, success: false });
   }
});

module.exports = { 
    jobPost, 
    getJobs, 
    updateJobPost, 
    toggleLikeJob, 
    addComment, 
    deleteJobPost 
};
