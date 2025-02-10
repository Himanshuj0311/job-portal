const express = require('express')
const UserModel = require("../models/user.model")
require("dotenv").config()
const mongoose = require('mongoose');
const bcrypt = require('bcrypt')
const app = express()
app.use(express.json());
const jwt = require('jsonwebtoken')
require("dotenv").config();

function isValidEmail(email) {
  const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
  return emailPattern.test(email);
}

const signUp = async (req, res) => {
  try {

    const { name, email, password, role, token } = req.body;
    const isUserPresent = await UserModel.findOne({ email });

    if (isUserPresent) {
      return res.status(401).json({ message: "User already registered. Please login." ,succes:false});
    }
    if (!isValidEmail(email)) return res.status(401).send("Email is not correct")
    const hash_Password = await bcrypt.hash(password, 10);
    const user = new UserModel({ name, email, password: hash_Password, role, token });
    await user.save();
    res.status(200).send({ msg: "Signup Successfull!" ,succes:true})

  } catch (error) {
    res.status(500).send({msg:error.message,succes:false});
  }
}

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ msg: "User not found",succes:false });
    }

    // Validate password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ msg: "Invalid credentials",succes:false });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id },
      process.env.SECRET,
      { expiresIn: "15d" }
    );

    // Send response
    res.status(200).json({
      msg: `${user.name}, You are logged in successfully!`,
      token,
      succes:true

    });

  } catch (error) {
    res.status(500).json({ msg: "Server error", error: error.message });
  }

}

const updateProfile = async (req, res) => {
  const { _id,
    name,
    email,
    mobileno,
    dateOfBirth,
    gender,
    skills,
    experienceOfNumber,
    experience,
    about,
    eduction,
    previousJob,
    tag,
    resume,
    project,
    social,
    language,
    profileImage, } = req.body;
  try {

    const user = await UserModel.findById({ _id });
    if (!user) {
      return res.status(404).json({ msg: "User not found",succes:false });
    }

    const dataObj={_id,
      name,
      email,
      mobileno,
      dateOfBirth,
      gender,
      skills,
      experienceOfNumber,
      experience,
      about,
      eduction,
      previousJob,
      tag,
      resume,
      project,
      social,
      language,
      profileImage,}

      const updatedUser= await userRouter.findByIdAndUpdate({ _id: ObjectId(_id) }, { $set: dataObj }, { new: true });
      return res.status(200).json({ msg: "Profile Updated successfully",data:updatedUser,succes:true });

  } catch (error) {
    res.status(500).json({ msg: "Server error", error: error.message,succes:false });

  }
}

const getAllUsers = async (req, res) => {
  try {
    
    const { page = 1, limit = 10, search = '' ,_id, name, email, mobileno, dateOfBirth, gender, skills, experience, tag, language} = req.query;

   
    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);

   
    const skip = (pageNumber - 1) * limitNumber;

    // Build the filter object
    const filters = {};
    if(_id) filters._id = mongoose.Types.ObjectId(_id);
    if (name) filters.name = { $regex: name, $options: 'i' };
    if (email) filters.email = { $regex: email, $options: 'i' };
    if (mobileno) filters.mobileno = mobileno;
    if (dateOfBirth) filters.dateOfBirth = dateOfBirth;
    if (gender) filters.gender = gender;
    if (skills) filters.skills = { $in: skills.split(',') };
    if (experience) filters.experience = { $regex: experience, $options: 'i' };
    if (tag) filters.tag = { $regex: tag, $options: 'i' };
    if (language) filters.language = { $in: language.split(',') };

    if (search) {
      filters.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { mobileno: { $regex: search, $options: 'i' } },
        { experience: { $regex: search, $options: 'i' } },
        { tag: { $regex: search, $options: 'i' } },
        { skills: { $in: [search] } },
      ];
    }

   
    const users = await UserModel.find(filters)
      .skip(skip)             
      .limit(limitNumber)      
      .sort({ createdAt: -1 }); 

    
    const totalUsers = await UserModel.countDocuments(filters);


    const totalPages = Math.ceil(totalUsers / limitNumber);


    return res.json({
      status: 200,
      message: 'Users fetched successfully',
      data: {
        users,
        succes:true,
        pagination: {
          totalUsers,
          totalPages,
          currentPage: pageNumber,
          limit: limitNumber,
        },
      },
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    return res.status(500).json({
      status: 500,
      message: 'An error occurred while fetching users',
      succes:false
    });
  }
};

module.exports = { signUp, login, updateProfile,getAllUsers }

