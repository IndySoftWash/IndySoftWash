require('../config/dataBase')
const mongoose = require('mongoose')


const serviceSchema = new mongoose.Schema({
    uniqueid: { type: String, default: '' },
    createDate: { type: Date, default: Date.now() },
    name: { type: String, default: '' },
    type: { type: String, default: '' },
    description: { type: String, default: '' },
    frequency: [{
        name: { type: String, default: '' },
        price: { type: Number, default: 0 },
        frequencyDigit: { type: Number, default: 0 },
    }]
})

const adminSchema = new mongoose.Schema({

firstName: { type: String, default: '' },
lastName: { type: String, default: '' },
address: { type: String, default: '' },
shirtSize: { type: String, default: '' },
phone: { type: Number, default: 0 },
email: { type: String, default: '' },
otp: { type: Number, default: 0 },
stage: { type: Number, default: 0 },
profileImage: {
    s3Url: { type: String, default: '' },
    s3Key: { type: String, default: '' },
},
password: { type: String, default: '' },
customServices: [serviceSchema]

}, { collection : "adminData" });

module.exports = mongoose.model('adminData', adminSchema);  