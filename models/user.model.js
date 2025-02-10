const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    mobileno:{ type: Number,  },
   dateOfBirth:{type:String,},
   gender:{type:String,},
   skills:{type:Array,},
   experienceOfNumber:{type:Number,},
   experience:{type:String,},
   about:{type:String,},
   eduction:{type:Object,},
   previousJob:{type:Object,},
   tag:{type:String},
   resume:{type:String},
   project:{type:String},
   social:{type:Object},
   language:{type:Array},
   profileImage:{type:String},
    role: { type: String, default: "user", enum: ["admin", "user","company"],required:true },
    token: { type: String, default: "" }
}

)


const UserModel = mongoose.model("user", userSchema)

module.exports = UserModel