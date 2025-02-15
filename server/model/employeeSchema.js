require('../config/dataBase')
const mongoose = require('mongoose')



const employeeSchema = new mongoose.Schema({

uniqueid: { type: String, default: '' },
createDate: { type: Date, default: Date.now() },
firstName: { type: String, default: '' },
lastName: { type: String, default: '' },
address: { type: String, default: '' },
email: { type: String, default: '' },
phone: { type: Number, default: 0 },
role: { type: String, default: '' },
status: { type: String, default: '' },
otp: { type: Number, default: 0 },
stage: { type: Number, default: 0 },
profileImage: {
    s3Url: { type: String, default: '' },
    s3Key: { type: String, default: '' },
},
password: { type: String, default: '' },

}, { collection : "employeeData" });

module.exports = mongoose.model('employeeData', employeeSchema);  