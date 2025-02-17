const express = require('express')
const CompanyModel = require("../models/company.model")
const bcrypt = require('bcrypt')
const app = express()
app.use(express.json());
const jwt = require('jsonwebtoken')
require("dotenv").config();
const mongoose = require('mongoose');
 

function isValidEmail(email) {
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return emailPattern.test(email);
  }

  const signUpForCompany= async(req,res)=>{
    try {
   
        const {companyName,companyEmail,password,role,token}=req.body;
        console.log(req.body)
        const isUserPresent = await CompanyModel.findOne({ companyEmail });
       // console.log(isUserPresent)
      if (isUserPresent) {
        return res.status(401).json({ message: "Company already registered. Please login." ,success:flase});
    }
      if(!isValidEmail(companyEmail)) return res.status(401).json({message:"Email is not correct",success:flase})

      const hash_Password=await bcrypt.hash(password,10);
        const user=new CompanyModel({companyName,companyEmail,password:hash_Password,role,token});
        await user.save();
        res.status(200).json({message:"Signup successsfull!",success:true, user})
        
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message,success:false });
    }
  }

  const loginForCompany=async(req,res)=>{
    try {
        const { companyEmail, password } = req.body;
    
        // Check if user exists
        const user = await CompanyModel.findOne({ companyEmail });
        if (!user) {
            return res.status(404).json({ message: "company is not registered",success:false });
        }
    
        // Validate password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid credentials",success:false });
        }
    
        // Generate JWT token
        const token = jwt.sign(
            { userId: user._id },
            process.env.SECRET,
            { expiresIn: "15d" }
        );
    
      
        res.status(200).json({
            message: `${user.companyName}, You are logged in successsfully!`,
            token,
            success:true
           
        });
    
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message,success:false });
    }
    
  }

  const getAllCompany=async(req,res)=>{
    try {
      const { page = 1, limit = 10, search = '' ,_id,about,companyEmail,companyName,mobileno}=req.query;

      const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);

   
    const skip = (pageNumber - 1) * limitNumber;

  const filters={};

 
 if (_id) filters._id = mongoose.Types.ObjectId(_id);
 if (companyName) filters.companyName = { $regex: companyName, $options: 'i' }; 
 if (companyEmail) filters.companyEmail = { $regex: companyEmail, $options: 'i' };
 if (mobileno) filters.mobileno = mobileno;



 if (search) {
   filters.$or = [
     { companyName: { $regex: search, $options: 'i' } },
     { companyEmail: { $regex: search, $options: 'i' } },
     { about: { $regex: search, $options: 'i' } }
   ];
 }

    const Company = await CompanyModel.find(filters)
      .skip(skip)             
      .limit(limitNumber)      
      .sort({ createdAt: -1 }); 

    
    const totalCompany = await CompanyModel.countDocuments(filters);


    const totalPages = Math.ceil(totalCompany / limitNumber);


    return res.json({
      status: 200,
      message: 'Company fetched successsfully',
      success:true,
      data: {
        Company,
        pagination: {
          totalCompany,
          totalPages,
          currentPage: pageNumber,
          limit: limitNumber,
        },
      },
    });
      
    } catch (error) {
      console.error('Error fetching Company:', error);
      return res.status(500).json({
        status: 500,
        message: 'An error occurred while fetching Company',
        success:false
      });
    }
  }

  module.exports={signUpForCompany,loginForCompany,getAllCompany}