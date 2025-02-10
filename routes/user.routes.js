
const express = require("express")
const userRouter=express.Router();
const {signUp,login,updateProfile,getAllUsers}=require("../controllers/user.cont");

userRouter.post("/user/signup", signUp);
userRouter.post("/user/login", login);
userRouter.put("/user/profile", updateProfile);
userRouter.get("/user/getAllUsers", getAllUsers);

module.exports = userRouter;