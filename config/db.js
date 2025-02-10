const mongoose = require("mongoose");
require("dotenv").config()
const db= async () => {
    await mongoose.connect(process.env.DB_URL)
    console.log("connected to DataBase");
}
  
  
  module.exports={db}