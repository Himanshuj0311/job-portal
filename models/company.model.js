const mongoose = require('mongoose');

const companySchema = mongoose.Schema({
    companyName: { type: String, required: true },
    companyEmail: { type: String, required: true },
    password: { type: String, required: true },
    mobileno: { type: Number },
    countOfEmployees: { type: Number },
    social: { type: Object },
    about: { type: String },
    webUrl: { type: String },
    profileImage: { type: String },
    role: { type: String, default: "user", enum: ["admin", "user", "company"], required: true },
    token: { type: String, default: "" }
});


const CompanyModel = mongoose.model("company", companySchema);


module.exports = CompanyModel;
